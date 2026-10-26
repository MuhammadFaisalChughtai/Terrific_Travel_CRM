import { Router } from 'express';
import { findAll, findOne, create, update, deleteAgent } from '../controllers/agents.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all agent routes
router.use(authMiddleware as any);

router.get('/', requirePermissions('agents:read', 'agents:manage', 'leads:manage', 'leads:read', 'attendance:read') as any, findAll);
router.get('/:id', requirePermissions('agents:read', 'agents:manage', 'attendance:read') as any, findOne);
router.post('/', requirePermissions('agents:manage') as any, create);
router.patch('/:id', requirePermissions('agents:manage') as any, update);
router.put('/:id', requirePermissions('agents:manage') as any, update);
router.delete('/:id', requirePermissions('agents:delete', 'agents:manage') as any, deleteAgent);

export default router;
