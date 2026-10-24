import { Router } from 'express';
import {
  findAll,
  findOne,
  create,
  update,
  deleteVendor,
  getOutstandingBookings,
  processVendorPayment,
  reverseVendorPayment,
  getLedger,
  getWalletHistory,
  getDashboardSummary,
  getPayments,
  getGlobalLedger,
} from '../controllers/vendors.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all vendor routes
router.use(authMiddleware as any);

// Vendor Payments specific routes
router.get('/outstanding-bookings', requirePermissions('vendors:read', 'vendors:pay') as any, getOutstandingBookings);
router.post('/payments', requirePermissions('vendors:pay') as any, processVendorPayment);
router.get('/payments', requirePermissions('vendors:read', 'vendors:pay') as any, getPayments);
router.patch('/payments/:paymentId/reverse', requirePermissions('vendors:reverse', 'vendors:pay') as any, reverseVendorPayment);

// Vendor details and ledger routes
router.get('/ledger', requirePermissions('ledger:read', 'vendors:read') as any, getGlobalLedger);
router.get('/:id/ledger', requirePermissions('ledger:read', 'vendors:read') as any, getLedger);
router.get('/:id/wallet-history', requirePermissions('vendors:read') as any, getWalletHistory);
router.get('/:id/dashboard-summary', requirePermissions('vendors:read') as any, getDashboardSummary);

// Base CRUD routes
router.get('/', requirePermissions('vendors:read') as any, findAll);
router.get('/:id', requirePermissions('vendors:read') as any, findOne);
router.post('/', requirePermissions('vendors:create') as any, create);
router.patch('/:id', requirePermissions('vendors:edit') as any, update);
router.delete('/:id', requirePermissions('vendors:delete') as any, deleteVendor);

export default router;
