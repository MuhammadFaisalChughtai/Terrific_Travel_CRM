import { Router } from 'express';
import { checkout, webhook, findAll, recordTransaction } from '../controllers/payments.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Webhook is public (emulating payment gateway access)
router.post('/webhook', webhook);

// Protected routes
router.post('/checkout', authMiddleware as any, checkout);
router.post('/transactions', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, recordTransaction);
router.get('/', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, findAll);

router.delete('/:id', (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Hard deletion of payment records is disabled system-wide to preserve audit logs.'
  });
});

export default router;
