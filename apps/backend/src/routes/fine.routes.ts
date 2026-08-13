import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import {
  getMyFines,
  getAllFines,
  issueFine,
  waiveFine,
  updateFine
} from '../controllers/fine.controller';

const router = Router();

router.use(authMiddleware as any);

// Agent Portal route
router.get('/my-fines', getMyFines);

// Admin routes
router.get('/admin/all', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, getAllFines);
router.post('/admin/issue', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, issueFine);
router.patch('/admin/:id/waive', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, waiveFine);
router.patch('/admin/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, updateFine);

export default router;
