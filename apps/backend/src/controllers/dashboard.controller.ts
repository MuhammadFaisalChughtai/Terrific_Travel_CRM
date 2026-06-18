import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../middleware/async.middleware';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getStats();
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTrends = asyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getTrends();
  res.status(200).json({
    success: true,
    data: result,
  });
});
