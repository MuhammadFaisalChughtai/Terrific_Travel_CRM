import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import amqp, { AmqpConnectionManager } from 'amqp-connection-manager';
import * as Minio from 'minio';
import * as winston from 'winston';

// Configure Logger
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// App Config
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'tms_super_secret_access_key_987654321',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'tms_super_secret_refresh_key_123456789',
    accessExp: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExp: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT) || 9000,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio_admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio_password',
    // Public-facing base URL for MinIO (rewrite docker-internal URLs for browsers)
    // Dev:  http://localhost:9000
    // Prod: https://cdn.terrifictravel.co.uk
    publicUrl: process.env.MINIO_PUBLIC_URL || 'http://localhost:9000',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    exchange: 'travel.events',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'no-reply@terrifictravel.co.uk',
  },
  // Dev:  http://localhost:5173  |  Prod: https://crm.terrifictravel.co.uk
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Dev:  http://localhost:3000  |  Prod: https://api.terrifictravel.co.uk
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
};

// Database Singleton
export const prisma = new PrismaClient();

// Redis Singleton
export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  lazyConnect: true,
});

// RabbitMQ Connection Singleton
export const rabbitMQConnection = amqp.connect([config.rabbitmq.url]);
rabbitMQConnection.on('connect', () => logger.info('RabbitMQ connected!'));
rabbitMQConnection.on('disconnect', (err: any) => logger.error('RabbitMQ disconnected!', err.err));

// MinIO Singleton
export const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: false,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});
