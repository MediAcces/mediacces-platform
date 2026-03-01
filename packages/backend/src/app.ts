import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

import { config } from './config';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? ['https://mediacces.ci', 'https://admin.mediacces.ci']
    : '*',
  credentials: true,
}));

// Rate limiting (disabled in test environment)
if (config.nodeEnv !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.',
    },
  });
  app.use('/api/', limiter);

  // Stricter rate limit for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    },
  });
  app.use('/api/auth/', authLimiter);
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MédiAccès API Documentation',
}));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'MédiAccès API est opérationnelle.',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée.',
  });
});

// Global error handler
app.use(errorHandler);

logger.info('Express app initialized');

export default app;
