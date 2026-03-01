// Set test environment before any imports
process.env.NODE_ENV = 'test';

import request from 'supertest';
import { DataSource } from 'typeorm';
import app from '../app';
import { User } from '../entities/User';
import { Vehicle } from '../entities/Vehicle';
import { Trip } from '../entities/Trip';
import { Payment } from '../entities/Payment';
import { Document } from '../entities/Document';
import { Notification } from '../entities/Notification';
import { AppDataSource } from '../config/database';

// Mock the database
let testDataSource: DataSource;

beforeAll(async () => {
  // Create an in-memory SQLite database for testing
  testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    entities: [User, Vehicle, Trip, Payment, Document, Notification],
    logging: false,
  });

  await testDataSource.initialize();

  // Override the AppDataSource methods
  Object.defineProperty(AppDataSource, 'getRepository', {
    value: (entity: unknown) => testDataSource.getRepository(entity as typeof User),
    writable: true,
  });

  Object.defineProperty(AppDataSource, 'isInitialized', {
    value: true,
    writable: true,
  });
});

afterAll(async () => {
  if (testDataSource?.isInitialized) {
    await testDataSource.destroy();
  }
});

beforeEach(async () => {
  // Clear all tables before each test
  const entities = testDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = testDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

describe('Auth API', () => {
  const validUser = {
    first_name: 'Kouadio',
    last_name: 'Aya',
    phone: '+2250101020304',
    email: 'aya.kouadio@email.com',
    password: 'MonMotDePasse1',
    role: 'patient',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new patient successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.first_name).toBe(validUser.first_name);
      expect(res.body.data.last_name).toBe(validUser.last_name);
      expect(res.body.data.phone).toBe(validUser.phone);
      expect(res.body.data.role).toBe('patient');
      expect(res.body.data.is_validated).toBe(true); // Patients auto-validated
      expect(res.body.data).not.toHaveProperty('password_hash');
    });

    it('should register a driver (not auto-validated)', async () => {
      const driverData = {
        ...validUser,
        phone: '+2250505060708',
        email: 'driver@email.com',
        role: 'chauffeur',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(driverData)
        .expect(201);

      expect(res.body.data.role).toBe('chauffeur');
      expect(res.body.data.is_validated).toBe(false);
    });

    it('should reject duplicate phone number', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'other@email.com' })
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('téléphone');
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, phone: '+2250909080706' })
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('email');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, phone: '+2250707080910', email: 'weak@email.com', password: '12345' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ first_name: 'Test' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid phone number', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, phone: 'invalid' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should reject invalid role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, phone: '+2250303040506', email: 'role@email.com', role: 'invalid_role' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login with phone number', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: validUser.phone,
          password: validUser.password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should login with email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: validUser.email,
          password: validUser.password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: validUser.phone,
          password: 'WrongPassword1',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('incorrects');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          login: '+2259999999999',
          password: validUser.password,
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/request-otp', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should send OTP to registered phone', async () => {
      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ phone: validUser.phone })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('OTP');
    });

    it('should reject non-registered phone', async () => {
      const res = await request(app)
        .post('/api/auth/request-otp')
        .send({ phone: '+2259999999999' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    let otpCode: string;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
      await request(app).post('/api/auth/request-otp').send({ phone: validUser.phone });

      // Get OTP from database directly
      const userRepo = testDataSource.getRepository(User);
      const user = await userRepo.findOne({ where: { phone: validUser.phone } });
      otpCode = user!.otp_code;
    });

    it('should verify correct OTP', async () => {
      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          phone: validUser.phone,
          otp: otpCode,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject incorrect OTP', async () => {
      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          phone: validUser.phone,
          otp: '000000',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('incorrect');
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ login: validUser.phone, password: validUser.password });
      authToken = loginRes.body.data?.token;
    });

    describe('GET /api/user/profile', () => {
      it('should return user profile with valid token', async () => {
        expect(authToken).toBeDefined();
        const res = await request(app)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.phone).toBe(validUser.phone);
      });

      it('should reject request without token', async () => {
        const res = await request(app)
          .get('/api/user/profile')
          .expect(401);

        expect(res.body.success).toBe(false);
      });

      it('should reject invalid token', async () => {
        const res = await request(app)
          .get('/api/user/profile')
          .set('Authorization', 'Bearer invalid_token')
          .expect(401);

        expect(res.body.success).toBe(false);
      });
    });

    describe('PUT /api/user/profile', () => {
      it('should update user profile', async () => {
        const res = await request(app)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            blood_group: 'O+',
            allergies: 'Pénicilline',
            treating_doctor: 'Dr. Koné',
          })
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data.blood_group).toBe('O+');
        expect(res.body.data.allergies).toBe('Pénicilline');
      });

      it('should reject invalid blood group', async () => {
        const res = await request(app)
          .put('/api/user/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ blood_group: 'XYZ' })
          .expect(400);

        expect(res.body.success).toBe(false);
      });
    });
  });
});

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('opérationnelle');
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route').expect(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('non trouvée');
  });
});
