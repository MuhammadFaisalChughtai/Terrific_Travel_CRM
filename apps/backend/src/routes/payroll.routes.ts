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

// List payslips
router.get('/', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager') as any, getPayslips);

// Get single payslip
router.get('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager', 'AGENT', 'Agent') as any, getPayslipById);

// Create payslip
router.post('/', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager') as any, createPayslip);

// Update payslip
router.put('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager') as any, updatePayslip);
router.patch('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager') as any, updatePayslip);

// Delete payslip
router.delete('/:id', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin') as any, deletePayslip);

// Send salary slip via SMTP email
router.post('/:id/send-email', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager') as any, sendPayslipEmail);

// Get agent specific payslips
router.get('/agent/:agentId', requireRoles('SUPER_ADMIN', 'ADMIN', 'Admin', 'MANAGER', 'Manager', 'AGENT', 'Agent') as any, getAgentPayslips);

export default router;
