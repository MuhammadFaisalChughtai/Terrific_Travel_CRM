import { Router } from 'express';
import { getBalanceSheet } from '../controllers/reports.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN'));

router.get('/balance-sheet', getBalanceSheet);

export default router;
