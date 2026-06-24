import { Router } from 'express';
import { getAll, getByType, updateTemplate, resetTemplate } from '../controllers/templates.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// All template routes require authentication
router.use(authMiddleware as any);

// Any authenticated user can READ templates (needed for printing in Booking section)
router.get('/', getAll);
router.get('/:type', getByType);

// Only ADMIN / SUPER_ADMIN can modify templates
router.put('/:type', requireRoles('SUPER_ADMIN', 'ADMIN') as any, updateTemplate);
router.post('/:type/reset', requireRoles('SUPER_ADMIN', 'ADMIN') as any, resetTemplate);

export default router;
