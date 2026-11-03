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
import { isCustomerTransaction } from './utils/booking-financials';

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

  // Root & API welcome/status endpoint
  app.get(['/', '/api'], (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Terrific Travel API',
      version: '1.0.0',
      status: 'online',
      health: '/api/health',
      docs: '/swagger',
    });
  });

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

    // Ensure invoiceName column exists on Agent table
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "Agent" ADD COLUMN IF NOT EXISTS "invoiceName" TEXT;`);
    } catch (colErr) {
      logger.warn('Could not ensure invoiceName column on Agent table:', colErr);
    }

    // Sync dynamic permission registry
    try {
      const { syncPermissionsRegistry } = await import('./services/permissions-sync.service');
      await syncPermissionsRegistry(prisma);
    } catch (syncErr) {
      logger.error('Failed to sync permissions registry on server bootstrap:', syncErr);
    }

    // Seed and verify transport rate sheet & service catalog on system start/restart
    try {
      const { seedCatalogData } = await import('../prisma/seed-catalog');
      await seedCatalogData(prisma);
      logger.info('Service catalog & special transport rates (1448H) seeded successfully.');
    } catch (seedErr) {
      logger.error('Failed to seed catalog on server bootstrap:', seedErr);
    }

    // Ensure credit card charges do not remain deducted from booking totalPrice
    try {
      const bookingsWithCcCharges = await prisma.booking.findMany({
        where: { cardPaymentCharges: { gt: 0 } },
        include: { installments: true, transactions: true },
      });
      for (const b of bookingsWithCcCharges) {
        const negativeCcTx = b.transactions.filter(
          (t: any) =>
            t.amount < 0 &&
            (t.notes || '').toLowerCase().includes('credit card charge'),
        );
        const totalNegativeCc = negativeCcTx.reduce(
          (sum: number, t: any) => sum + Math.abs(t.amount),
          0,
        );

        let restoreAmount = 0;
        const installmentSum = b.installments.reduce(
          (sum: number, inst: any) => sum + (Number(inst.amount) || 0),
          0,
        );
        if (
          installmentSum > 0 &&
          Math.abs(installmentSum - (b.totalPrice + b.cardPaymentCharges)) < 0.05
        ) {
          restoreAmount = b.cardPaymentCharges;
        } else if (
          totalNegativeCc > 0 &&
          installmentSum > 0 &&
          Math.abs(installmentSum - (b.totalPrice + totalNegativeCc)) < 0.05
        ) {
          restoreAmount = totalNegativeCc;
        }

        if (restoreAmount > 0) {
          await prisma.booking.update({
            where: { id: b.id },
            data: {
              totalPrice: { increment: restoreAmount },
            },
          });
          logger.info(
            `Restored totalPrice for booking ${b.bookingReference} (+${restoreAmount}) so credit card fee is not deducted from Total Payment`,
          );
        }
      }
    } catch (fixErr) {
      logger.error('Failed to run credit card charges totalPrice verification:', fixErr);
    }

    // Clean up orphaned cardPaymentCharges where transactions were removed
    try {
      const bookingsWithCharges = await prisma.booking.findMany({
        where: { cardPaymentCharges: { gt: 0 } },
        include: { transactions: true },
      });
      for (const b of bookingsWithCharges) {
        if (!b.transactions || b.transactions.length === 0) {
          await prisma.booking.update({
            where: { id: b.id },
            data: { cardPaymentCharges: 0 },
          });
          logger.info(
            `Cleaned up orphaned cardPaymentCharges for booking ${b.bookingReference} (no transactions recorded)`,
          );
        } else {
          const hasCcTx = b.transactions.some((tx: any) => {
            const method = (tx.paymentMethod || '').toLowerCase();
            const notes = (tx.notes || '').toLowerCase();
            return (
              method.includes('credit card') ||
              method.includes('cc') ||
              notes.includes('credit card') ||
              notes.includes('card payment')
            );
          });
          if (!hasCcTx) {
            await prisma.booking.update({
              where: { id: b.id },
              data: { cardPaymentCharges: 0 },
            });
            logger.info(
              `Cleaned up orphaned cardPaymentCharges for booking ${b.bookingReference} (no credit card transactions found)`,
            );
          }
        }
      }
    } catch (cleanCcErr) {
      logger.warn('Failed to clean up orphaned cardPaymentCharges:', cleanCcErr);
    }

    // Reconcile and fix installments where Deposit / Received Payment was inflated by credit card fees
    try {
      const bookingsWithInstallments = await prisma.booking.findMany({
        where: { hasInstallments: true },
        include: {
          installments: { orderBy: { installmentNumber: 'asc' } },
          transactions: true,
        },
      });

      for (const b of bookingsWithInstallments) {
        if (!b.installments || b.installments.length <= 1) continue;
        const depositInst = b.installments.find(
          (i: any) =>
            i.installmentNumber === 1 &&
            ((i.title || '').toLowerCase().includes('deposit') || (i.title || '').toLowerCase().includes('received'))
        );
        if (!depositInst) continue;

        const custTxs = (b.transactions || []).filter(isCustomerTransaction);
        if (custTxs.length === 0) continue;

        const feeTxs = (b.transactions || []).filter((tx: any) => {
          const method = (tx.paymentMethod || '').toLowerCase();
          const notes = (tx.notes || '').toLowerCase();
          return (
            method.includes('fee') ||
            notes.includes('credit card charge') ||
            notes.includes('card payment charge') ||
            notes.includes('cc charge')
          );
        });

        for (const feeTx of feeTxs) {
          const feeAmt = Math.abs(Number(feeTx.amount) || 0);
          if (feeAmt <= 0) continue;

          const matchingCust = custTxs.find(
            (c: any) => Math.abs(Number(c.amount) - (depositInst.amount - feeAmt)) < 0.05
          );

          if (matchingCust) {
            const correctDeposit = Math.round(Number(matchingCust.amount) * 100) / 100;
            const remainingInsts = b.installments.filter((i: any) => i.id !== depositInst.id);
            const rawTotal = Number(b.totalPrice) || 0;
            const totalRemaining = Math.max(0, Math.round((rawTotal - correctDeposit) * 100) / 100);
            const n = remainingInsts.length;
            const each = Math.round((totalRemaining / n) * 100) / 100;
            const finalAmt = Math.round((totalRemaining - each * (n - 1)) * 100) / 100;

            await prisma.bookingInstallment.update({
              where: { id: depositInst.id },
              data: { amount: correctDeposit },
            });

            for (let idx = 0; idx < n; idx++) {
              await prisma.bookingInstallment.update({
                where: { id: remainingInsts[idx].id },
                data: { amount: idx === n - 1 ? finalAmt : each },
              });
            }

            logger.info(
              `Reconciled installments for booking ${b.bookingReference}: corrected deposit from ${depositInst.amount} to ${correctDeposit} (removed ${feeAmt} fee inflation)`
            );
            break;
          }
        }
      }
    } catch (instReconcileErr) {
      logger.warn('Failed to reconcile installments with credit card charges:', instReconcileErr);
    }
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
