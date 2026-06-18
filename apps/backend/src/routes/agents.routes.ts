import { Router } from 'express';
import { findAll, findOne, create, update, deleteAgent } from '../controllers/agents.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Secure all agent routes
router.use(authMiddleware as any);

router.get('/', requireRoles('SUPER_ADMIN', 'ADMIN') as any, findAll);
router.get('/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, findOne);
router.post('/', requireRoles('SUPER_ADMIN', 'ADMIN') as any, create);
router.patch('/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, update);
router.delete('/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteAgent);

export default router;
