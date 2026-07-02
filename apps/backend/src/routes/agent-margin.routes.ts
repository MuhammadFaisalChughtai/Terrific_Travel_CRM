import { Router } from 'express';
import { 
  calculateAgentMargins, 
  getAllAgentMargins, 
  getMyMargins, 
  markMarginAsPaid, 
  resetMarginPayment, 
  getMarginBookings,
  getEligibleBookings
} from '../controllers/agent-margin.controller';
import { authMiddleware as authenticate } from '../middleware/auth.middleware';
import { requireRoles as authorize } from '../middleware/rbac.middleware';

const router = Router();

// Protect all routes
router.use(authenticate);

// Agent specific route
router.get('/my-margins', authorize('AGENT'), getMyMargins);

// Admin specific routes
router.get('/eligible-bookings', authorize('SUPER_ADMIN', 'ADMIN'), getEligibleBookings);
router.post('/calculate', authorize('SUPER_ADMIN', 'ADMIN'), calculateAgentMargins);
router.get('/', authorize('SUPER_ADMIN', 'ADMIN'), getAllAgentMargins);
router.get('/:id/bookings', authorize('SUPER_ADMIN', 'ADMIN', 'AGENT'), getMarginBookings);
router.put('/:id/pay', authorize('SUPER_ADMIN', 'ADMIN'), markMarginAsPaid);
router.put('/:id/reset', authorize('SUPER_ADMIN', 'ADMIN'), resetMarginPayment);

export default router;
