import { Router } from 'express';
import { getBalanceSheet } from '../controllers/reports.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware as any);
router.use(requirePermissions('reports:financials', 'reports:read_all') as any);

router.get('/balance-sheet', getBalanceSheet);

export default router;
