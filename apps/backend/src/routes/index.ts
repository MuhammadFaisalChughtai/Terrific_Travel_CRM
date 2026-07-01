import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import bookingsRoutes from './bookings.routes';
import flightsRoutes from './flights.routes';
import hotelsRoutes from './hotels.routes';
import toursRoutes from './tours.routes';
import vendorsRoutes from './vendors.routes';
import invoicesRoutes from './invoices.routes';
import paymentsRoutes from './payments.routes';
import templatesRoutes from './templates.routes';
import agentsRoutes from './agents.routes';
import dashboardRoutes from './dashboard.routes';
import uploadsRoutes from './uploads.routes';
import slabsRoutes from './slabs.routes';
import attendanceRoutes from './attendance.routes';
import notificationsRoutes from './notifications.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/agents', agentsRoutes);
router.use('/slabs', slabsRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/flights', flightsRoutes);
router.use('/hotels', hotelsRoutes);
router.use('/tours', toursRoutes);
router.use('/vendors', vendorsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/payments', paymentsRoutes);
router.use('/templates', templatesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
