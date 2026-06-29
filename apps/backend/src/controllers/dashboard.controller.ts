import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const isAgent = user?.roles.includes('Agent') || user?.roles.includes('TRAVEL_AGENT');
  const isAdmin = user?.roles.includes('SUPER_ADMIN') || user?.roles.includes('ADMIN');

  let agentId: string | undefined = undefined;
  if (isAgent && !isAdmin && user?.agentId) {
    agentId = user.agentId;
  }

  const result = await dashboardService.getStats(agentId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTrends = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const isAgent = user?.roles.includes('Agent') || user?.roles.includes('TRAVEL_AGENT');
  const isAdmin = user?.roles.includes('SUPER_ADMIN') || user?.roles.includes('ADMIN');

  let agentId: string | undefined = undefined;
  if (isAgent && !isAdmin && user?.agentId) {
    agentId = user.agentId;
  }

  const result = await dashboardService.getTrends(agentId);
  res.status(200).json({
    success: true,
    data: result,
  });
});
