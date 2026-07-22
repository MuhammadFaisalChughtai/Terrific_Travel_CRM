import { Response } from 'express';
import { leadsService } from '../services/leads.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await leadsService.getLeads(req.query);
  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getLeadById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await leadsService.getLeadById(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const createLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.id;
  const result = await leadsService.createLead(req.body, currentUserId);
  res.status(201).json({
    success: true,
    data: result,
    message: 'Lead created successfully.',
  });
});

export const updateLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?.id;
  const result = await leadsService.updateLead(id, req.body, currentUserId);
  res.status(200).json({
    success: true,
    data: result,
    message: 'Lead updated successfully.',
  });
});

export const deleteLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userRoles = req.user?.roles || [];
  const result = await leadsService.deleteLead(id, userRoles);
  res.status(200).json({
    success: true,
    message: result.message,
  });
});
