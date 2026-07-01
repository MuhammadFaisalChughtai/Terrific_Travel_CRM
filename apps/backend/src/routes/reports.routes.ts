import { Router } from 'express';
import { getBalanceSheet } from '../controllers/reports.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware as any);
router.use(requireRoles('SUPER_ADMIN', 'ADMIN') as any);

router.get('/balance-sheet', getBalanceSheet);

export default router;
