import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { bonusService } from '../services/bonus.service';

export const getMyBonuses = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await bonusService.getAgentBonuses(userId, req.query);
  res.status(200).json({ success: true, data: result });
});

export const getAllBonuses = asyncHandler(async (req: Request, res: Response) => {
  const result = await bonusService.getAllBonuses(req.query);
  res.status(200).json({ success: true, data: result });
});

export const issueBonus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const data = {
    ...req.body,
    issuedById: userId
  };
  const result = await bonusService.issueBonus(data);
  res.status(201).json({ success: true, data: result, message: 'Bonus issued successfully' });
});

export const updateBonus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bonusService.updateBonus(id, req.body);
  res.status(200).json({ success: true, data: result, message: 'Bonus updated successfully' });
});
