import { Router } from 'express';
import { create, findAll, findOne, update, deleteTour } from '../controllers/tours.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', findAll);
router.get('/:id', findOne);

// Protected routes
router.post('/', authMiddleware as any, requirePermissions('catalog:manage') as any, create);
router.patch('/:id', authMiddleware as any, requirePermissions('catalog:manage') as any, update);
router.delete('/:id', authMiddleware as any, requirePermissions('catalog:manage') as any, deleteTour);

export default router;
