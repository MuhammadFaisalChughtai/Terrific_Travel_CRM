import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import flightsRoutes from './flights.routes';
import hotelsRoutes from './hotels.routes';
import toursRoutes from './tours.routes';
import bookingsRoutes from './bookings.routes';
import paymentsRoutes from './payments.routes';
import uploadsRoutes from './uploads.routes';
import dashboardRoutes from './dashboard.routes';
import agentsRoutes from './agents.routes';
import slabsRoutes from './slabs.routes';
import vendorsRoutes from './vendors.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/flights', flightsRoutes);
router.use('/hotels', hotelsRoutes);
router.use('/tours', toursRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/agents', agentsRoutes);
router.use('/slabs', slabsRoutes);
router.use('/vendors', vendorsRoutes);

export default router;
