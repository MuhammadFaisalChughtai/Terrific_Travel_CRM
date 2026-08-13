import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import {
  getMyBonuses,
  getAllBonuses,
  issueBonus,
  updateBonus
} from '../controllers/bonus.controller';

const router = Router();

router.use(authMiddleware as any);

// Agent Portal route
router.get('/my-bonuses', getMyBonuses);

// Admin routes
router.get('/admin/all', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, getAllBonuses);
router.post('/admin/issue', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, issueBonus);
router.patch('/admin/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, updateBonus);

export default router;
