import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

import { prisma } from '../config';

async function resolveUserFilter(user?: AuthenticatedRequest['user']) {
  if (!user) {
    return { isAdmin: false, isAgent: false, agentId: undefined, userId: undefined };
  }

  const cleanRoles = (user.roles || []).map((r: any) => {
    const raw = typeof r === 'string' ? r : r?.name || '';
    return raw.toUpperCase().replace(/[\s_-]+/g, '');
  });

  const isAdmin = cleanRoles.some((r: string) =>
    ['ADMIN', 'SUPERADMIN', 'ADMINISTRATOR', 'ROOT'].includes(r)
  );

  const isAgent = !isAdmin && cleanRoles.some((r: string) => r.includes('AGENT'));

  let agentId: string | undefined = user.agentId || undefined;

  if (isAgent) {
    if (!agentId && user.email) {
      try {
        const agent = await prisma.agent.findFirst({
          where: {
            OR: [
              { email: { equals: user.email, mode: 'insensitive' } },
              { payrollEmail: { equals: user.email, mode: 'insensitive' } },
            ],
          },
          select: { id: true },
        });
        if (agent) {
          agentId = agent.id;
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { agentId: agent.id },
            }).catch(() => {});
          }
        }
      } catch (err) {
        // Continue gracefully if lookup fails
      }
    }
  }

  return {
    isAdmin,
    isAgent,
    agentId: isAgent ? agentId : undefined,
    userId: isAgent ? user.id : undefined,
  };
}

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { isAgent, agentId, userId } = await resolveUserFilter(user);

  const result = await dashboardService.getStats({
    isAgent,
    agentId,
    userId,
  });
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTrends = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { isAgent, agentId, userId } = await resolveUserFilter(user);

  const result = await dashboardService.getTrends({
    isAgent,
    agentId,
    userId,
  });
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getStatsByPeriod = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const { isAgent, agentId, userId } = await resolveUserFilter(user);

  const rawPeriod = req.query.period as string;
  const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'all'] as const;
  type Period = typeof validPeriods[number];

  const period: Period = validPeriods.includes(rawPeriod as Period)
    ? (rawPeriod as Period)
    : 'all';

  const result = await dashboardService.getStatsByPeriod(period, {
    isAgent,
    agentId,
    userId,
  });
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getCustomerPendingBookings = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  const isAdmin = user?.roles.includes('SUPER_ADMIN') || user?.roles.includes('ADMIN');

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only administrators can view customer pending bookings.',
    });
  }

  const period = req.query.period as string | undefined;
  const search = req.query.search as string | undefined;

  const result = await dashboardService.getCustomerPendingBookings(period, search);
  res.status(200).json({
    success: true,
    data: result,
  });
});

