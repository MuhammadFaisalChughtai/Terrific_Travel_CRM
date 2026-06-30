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
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Secure all vendor routes
router.use(authMiddleware as any);

// Vendor Payments specific routes
router.get('/outstanding-bookings', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getOutstandingBookings);
router.post('/payments', requireRoles('SUPER_ADMIN', 'ADMIN') as any, processVendorPayment);
router.get('/payments', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getPayments);
router.patch('/payments/:paymentId/reverse', requireRoles('SUPER_ADMIN', 'ADMIN') as any, reverseVendorPayment);

// Vendor details and ledger routes
router.get('/ledger', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getGlobalLedger);
router.get('/:id/ledger', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getLedger);
router.get('/:id/wallet-history', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getWalletHistory);
router.get('/:id/dashboard-summary', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getDashboardSummary);

// Base CRUD routes
router.get('/', findAll);
router.get('/:id', findOne);
router.post('/', requireRoles('SUPER_ADMIN', 'ADMIN') as any, create);
router.patch('/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, update);
router.delete('/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteVendor);

export default router;
