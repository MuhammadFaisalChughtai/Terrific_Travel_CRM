import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';
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

// List payslips
router.get('/', requirePermissions('payroll:read', 'payroll:manage') as any, getPayslips);

// Get single payslip
router.get('/:id', requirePermissions('payroll:read', 'payroll:manage') as any, getPayslipById);

// Create payslip
router.post('/', requirePermissions('payroll:manage') as any, createPayslip);

// Update payslip
router.put('/:id', requirePermissions('payroll:manage') as any, updatePayslip);
router.patch('/:id', requirePermissions('payroll:manage') as any, updatePayslip);

// Delete payslip
router.delete('/:id', requirePermissions('payroll:manage') as any, deletePayslip);

// Send salary slip via SMTP email
router.post('/:id/send-email', requirePermissions('payroll:manage') as any, sendPayslipEmail);

// Get agent specific payslips
router.get('/agent/:agentId', requirePermissions('payroll:read', 'payroll:manage') as any, getAgentPayslips);

export default router;
