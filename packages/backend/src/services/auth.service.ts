import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { config } from '../config';
import { AppError } from '../utils/AppError';
import { UserRole } from '../types/enums';
import { JwtPayload } from '../middlewares/auth';
import logger from '../utils/logger';

const userRepository = () => AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: {
    first_name: string;
    last_name: string;
    phone: string;
    email?: string;
    password: string;
    role: UserRole;
    establishment_name?: string;
    licence_number?: string;
    address?: string;
  }): Promise<Omit<User, 'password_hash'>> {
    const repo = userRepository();

    // Check if phone already exists
    const existingPhone = await repo.findOne({ where: { phone: data.phone } });
    if (existingPhone) {
      throw new AppError('Ce numéro de téléphone est déjà utilisé.', 409);
    }

    // Check if email already exists (if provided)
    if (data.email) {
      const existingEmail = await repo.findOne({ where: { email: data.email } });
      if (existingEmail) {
        throw new AppError('Cet email est déjà utilisé.', 409);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(data.password, salt);

    // Determine validation status
    // Patients are auto-validated; others need admin approval
    const is_validated = data.role === UserRole.PATIENT || data.role === UserRole.ADMIN;

    const user = repo.create({
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email || undefined,
      password_hash,
      role: data.role,
      is_validated,
      establishment_name: data.establishment_name,
      licence_number: data.licence_number,
      address: data.address,
    });

    const savedUser = await repo.save(user);
    logger.info(`New user registered: ${savedUser.id} (${savedUser.role})`);

    // Remove password_hash from response
    const result = { ...savedUser } as Record<string, unknown>;
    delete result.password_hash;
    return result as Omit<User, 'password_hash'>;
  }

  static async login(data: {
    login: string; // phone or email
    password: string;
  }): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const repo = userRepository();

    // Find user by phone or email, including password_hash
    const user = await repo
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.phone = :login OR user.email = :login', { login: data.login })
      .getOne();

    if (!user) {
      throw new AppError('Identifiants incorrects.', 401);
    }

    if (!user.is_active) {
      throw new AppError('Votre compte a été désactivé. Contactez le support.', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw new AppError('Identifiants incorrects.', 401);
    }

    // Generate JWT
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    logger.info(`User logged in: ${user.id}`);

    const loginResult = { ...user } as Record<string, unknown>;
    delete loginResult.password_hash;
    return {
      user: loginResult as Omit<User, 'password_hash'>,
      token,
    };
  }

  static async requestOtp(phone: string): Promise<void> {
    const repo = userRepository();

    const user = await repo.findOne({ where: { phone } });
    if (!user) {
      throw new AppError('Aucun compte associé à ce numéro de téléphone.', 404);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp_code = otp;
    user.otp_expires_at = otpExpiresAt;
    await repo.save(user);

    // TODO: Send OTP via Twilio SMS
    // In development, log the OTP
    logger.info(`OTP for ${phone}: ${otp} (dev mode)`);

    // In production, integrate Twilio:
    // await twilioClient.messages.create({
    //   body: `Votre code MédiAccès : ${otp}. Valide pendant 5 minutes.`,
    //   from: config.twilio.phoneNumber,
    //   to: phone,
    // });
  }

  static async verifyOtp(data: {
    phone: string;
    otp: string;
  }): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const repo = userRepository();

    const user = await repo.findOne({ where: { phone: data.phone } });
    if (!user) {
      throw new AppError('Aucun compte associé à ce numéro de téléphone.', 404);
    }

    if (!user.otp_code || !user.otp_expires_at) {
      throw new AppError("Aucun code OTP n'a été demandé.", 400);
    }

    if (new Date() > user.otp_expires_at) {
      throw new AppError('Le code OTP a expiré. Veuillez en demander un nouveau.', 400);
    }

    if (user.otp_code !== data.otp) {
      throw new AppError('Code OTP incorrect.', 400);
    }

    // Mark phone as verified and clear OTP
    user.is_phone_verified = true;
    user.otp_code = '';
    user.otp_expires_at = new Date(0);
    await repo.save(user);

    // Generate JWT
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    logger.info(`OTP verified for user: ${user.id}`);

    const otpResult = { ...user } as Record<string, unknown>;
    delete otpResult.password_hash;
    delete otpResult.otp_code;
    delete otpResult.otp_expires_at;
    return {
      user: otpResult as Omit<User, 'password_hash'>,
      token,
    };
  }
}
