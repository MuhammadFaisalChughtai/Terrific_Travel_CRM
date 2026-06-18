import { Router } from 'express';
import { findAll, findOne, update } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Secure all user routes
router.use(authMiddleware as any);

router.get('/', requireRoles('SUPER_ADMIN', 'ADMIN') as any, findAll);
router.get('/:id', findOne);
router.patch('/:id', update);

export default router;
