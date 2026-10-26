import { Router } from 'express';
import { checkout, webhook, findAll, recordTransaction, submitPaymentRequest, getPaymentRequests, approvePaymentRequest, rejectPaymentRequest } from '../controllers/payments.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Webhook is public (emulating payment gateway access)
router.post('/webhook', webhook);

// Payment Requests routes
router.post('/requests', authMiddleware as any, submitPaymentRequest);
router.get('/requests', authMiddleware as any, requirePermissions('payments:read', 'invoices:read', 'bookings:read', 'ledger:read') as any, getPaymentRequests);
router.post('/requests/:id/approve', authMiddleware as any, requirePermissions('payments:approve', 'invoices:edit', 'bookings:edit_any') as any, approvePaymentRequest);
router.post('/requests/:id/reject', authMiddleware as any, requirePermissions('payments:approve', 'invoices:edit', 'bookings:edit_any') as any, rejectPaymentRequest);

// Protected routes (Old transaction flow kept for fallback if needed, but UI uses /requests now)
router.post('/checkout', authMiddleware as any, checkout);
router.post('/transactions', authMiddleware as any, requirePermissions('bookings:create', 'bookings:edit_own', 'bookings:edit_any') as any, recordTransaction);
router.get('/', authMiddleware as any, requirePermissions('bookings:read', 'bookings:read_own', 'invoices:read') as any, findAll);

router.delete('/:id', (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Hard deletion of payment records is disabled system-wide to preserve audit logs.'
  });
});

export default router;
