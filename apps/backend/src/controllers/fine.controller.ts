import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { fineService } from '../services/fine.service';

export const getMyFines = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await fineService.getAgentFines(userId, req.query);
  res.status(200).json({ success: true, data: result });
});

export const getAllFines = asyncHandler(async (req: Request, res: Response) => {
  const result = await fineService.getAllFines(req.query);
  res.status(200).json({ success: true, data: result });
});

export const issueFine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const data = {
    ...req.body,
    issuedById: userId
  };
  const result = await fineService.issueFine(data);
  res.status(201).json({ success: true, data: result, message: 'Fine issued successfully' });
});

export const waiveFine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const { id } = req.params;
  const { waivedReason } = req.body;
  const result = await fineService.waiveFine(id, userId, waivedReason);
  res.status(200).json({ success: true, data: result, message: 'Fine waived successfully' });
});

export const updateFine = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await fineService.updateFine(id, req.body);
  res.status(200).json({ success: true, data: result, message: 'Fine updated successfully' });
});
