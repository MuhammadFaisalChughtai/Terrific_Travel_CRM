import { Router } from 'express';
import { getAll, getByType, updateTemplate, resetTemplate } from '../controllers/templates.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// All template routes require authentication
router.use(authMiddleware as any);

// Any authenticated user can READ templates (needed for printing in Booking section)
router.get('/', getAll);
router.get('/:type', getByType);

// Only authorized users can modify templates
router.put('/:type', requirePermissions('settings:manage') as any, updateTemplate);
router.post('/:type/reset', requirePermissions('settings:manage') as any, resetTemplate);

export default router;
