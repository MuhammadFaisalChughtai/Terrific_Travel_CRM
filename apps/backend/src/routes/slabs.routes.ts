import { Router } from 'express';
import { findAll, findOne, create, update, deleteSlab } from '../controllers/slabs.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all slab routes
router.use(authMiddleware as any);

router.get('/', requirePermissions('settings:manage', 'margins:view') as any, findAll);
router.get('/:id', requirePermissions('settings:manage', 'margins:view') as any, findOne);
router.post('/', requirePermissions('settings:manage') as any, create);
router.patch('/:id', requirePermissions('settings:manage') as any, update);
router.delete('/:id', requirePermissions('settings:manage') as any, deleteSlab);

export default router;
