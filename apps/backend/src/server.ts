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
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.listen(config.port, () => {
    logger.info(`Express server listening on port ${config.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error('App bootstrap crashed:', err);
});
