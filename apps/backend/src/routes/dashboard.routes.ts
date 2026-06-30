import { Router } from 'express';
import { getStats, getTrends } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Secure all dashboard routes
router.use(authMiddleware as any);
router.use(requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT', 'Agent') as any);

router.get('/stats', getStats);
router.get('/trends', getTrends);

export default router;
