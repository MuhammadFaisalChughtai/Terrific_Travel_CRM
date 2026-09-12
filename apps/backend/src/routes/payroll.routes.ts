import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import {
  getPayslips,
  getPayslipById,
  createPayslip,
  updatePayslip,
  deletePayslip,
  sendPayslipEmail,
  getAgentPayslips,
} from '../controllers/payroll.controller';

const router = Router();

// Secure all payroll routes
router.use(authMiddleware as any);

// List payslips — Admin only
router.get('/', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, getPayslips);

// Get single payslip — Admin only
router.get('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, getPayslipById);

// Create payslip — Admin only
router.post('/', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, createPayslip);

// Update payslip — Admin only
router.put('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, updatePayslip);
router.patch('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, updatePayslip);

// Delete payslip — Admin only
router.delete('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, deletePayslip);

// Send salary slip via SMTP email — Admin only
router.post('/:id/send-email', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, sendPayslipEmail);

// Get agent specific payslips — Admin only
router.get('/agent/:agentId', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, getAgentPayslips);

export default router;
