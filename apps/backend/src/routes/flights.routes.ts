import { Router } from 'express';
import { create, search, findOne, update, deleteFlight, getAirportByCode } from '../controllers/flights.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/airports/:code', authMiddleware as any, getAirportByCode);
router.get('/', search);
router.get('/:id', findOne);

// Protected routes
router.post('/', authMiddleware as any, requirePermissions('catalog:manage', 'flights:manage') as any, create);
router.patch('/:id', authMiddleware as any, requirePermissions('catalog:manage', 'flights:manage') as any, update);
router.delete('/:id', authMiddleware as any, requirePermissions('catalog:manage') as any, deleteFlight);

export default router;
