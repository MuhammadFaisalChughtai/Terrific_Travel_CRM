import { Request, Response } from 'express';
import { agentMarginService } from '../services/agent-margin.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const calculateAgentMargins = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { month, year } = req.body;
  
  if (!month || !year) {
    return res.status(400).json({ success: false, message: 'Month and year are required' });
  }

  const margins = await agentMarginService.calculateAgentMargins(month, year);
  
  res.status(200).json({
    success: true,
    data: margins,
    message: `Successfully calculated margins for ${margins.length} agents.`
  });
});

export const getAllAgentMargins = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const margins = await agentMarginService.getAllMargins(req.query);
  res.status(200).json({
    success: true,
    data: margins
  });
});

export const getMyMargins = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const agentId = req.user?.agentId;
  if (!agentId) {
    return res.status(403).json({ success: false, message: 'Not assigned to an agent profile' });
  }

  const margins = await agentMarginService.getAgentMargins(agentId);
  res.status(200).json({
    success: true,
    data: margins
  });
});

export const markMarginAsPaid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const adminId = req.user!.id;

  const margin = await agentMarginService.markAsPaid(id, adminId, notes);
  
  res.status(200).json({
    success: true,
    data: margin,
    message: 'Margin successfully marked as paid'
  });
});

export const resetMarginPayment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  await agentMarginService.resetPayment(id);
  
  res.status(200).json({
    success: true,
    message: 'Margin payment successfully reset'
  });
});

export const getMarginBookings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const bookings = await agentMarginService.getMarginBookings(id);
  
  res.status(200).json({
    success: true,
    data: bookings
  });
});
