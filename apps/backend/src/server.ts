import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { config, logger, prisma, redis } from './config';
import mainRouter from './routes';
import { errorHandler } from './middleware/error.middleware';
import { startAttendanceCron } from './cron/attendance.cron';
import { startMissingDetailsReminderCron } from './cron/missing-details-reminder.cron';
import { startLeadFollowUpReminderCron } from './cron/lead-followup-reminder.cron';
import { TERRIFIC_LOGO_BASE64 } from './assets/logo.constant';

async function bootstrap() {
  const app = express();

  // Basic Middlewares
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(compression());
  app.use(cors({
    origin: '*',
    credentials: true,
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Disable caching for all API responses
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Swagger Documentation Setup
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Enterprise Travel Management System',
        description: 'TMS backend API specifications and schemas',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts', './src/routes/*.js'],
  };
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health check endpoint (mandatory for Docker Compose check)
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Public brand logo asset endpoint
  app.get('/api/assets/logo.png', (req, res) => {
    const logoBuffer = Buffer.from(TERRIFIC_LOGO_BASE64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(logoBuffer);
  });

  // Mount API main router
  app.use('/api', mainRouter);

  // Global Error Handler Middleware
  app.use(errorHandler);

  // Connect Database & Caching Client
  try {
    await prisma.$connect();
    logger.info('Database connected successfully.');
  } catch (err) {
    logger.error('Failed to connect to database:', err);
  }

  try {
    await redis.connect();
    logger.info('Redis connected successfully.');
  } catch (err) {
    // Redis might throw because lazyConnect is true but connect is called.
    // That's fine if it's already connected.
  }

  // Start cron jobs
  startAttendanceCron();
  startMissingDetailsReminderCron();
  startLeadFollowUpReminderCron();

  app.listen(config.port, () => {
    logger.info(`Express server listening on port ${config.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error('App bootstrap crashed:', err);
});
