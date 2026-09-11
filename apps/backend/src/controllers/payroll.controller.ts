import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { payrollService } from '../services/payroll.service';

export const getPayslips = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await payrollService.getPayslips(req.query);
  res.status(200).json({ success: true, data: result });
});

export const getPayslipById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await payrollService.getPayslipById(id);
  res.status(200).json({ success: true, data: result });
});

export const createPayslip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const result = await payrollService.createPayslip(req.body, userId);
  res.status(201).json({ success: true, data: result, message: 'Salary slip created successfully' });
});

export const updatePayslip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await payrollService.updatePayslip(id, req.body);
  res.status(200).json({ success: true, data: result, message: 'Salary slip updated successfully' });
});

export const deletePayslip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await payrollService.deletePayslip(id);
  res.status(200).json({ success: true, data: result });
});

export const sendPayslipEmail = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { overrideEmail } = req.body;
  const result = await payrollService.sendPayslipEmail(id, overrideEmail);
  res.status(200).json(result);
});

export const getAgentPayslips = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { agentId } = req.params;
  const result = await payrollService.getAgentPayslips(agentId);
  res.status(200).json({ success: true, data: result });
});
