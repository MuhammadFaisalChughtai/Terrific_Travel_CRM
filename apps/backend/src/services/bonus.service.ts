import { prisma, logger } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import { emailService } from './email.service';

export class BonusService {
  /**
   * Get bonuses for a specific agent (for Agent Portal view)
   */
  async getAgentBonuses(userId: string, queryParams: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { agent: true }
    });

    if (!user) throw new BadRequestException('User not found');
    let agentId = user.agentId;

    if (!agentId) {
      const agent = await prisma.agent.findUnique({
        where: { email: user.email }
      });
      if (agent) agentId = agent.id;
    }

    if (!agentId) {
      return {
        bonuses: [],
        summary: { totalPending: 0, totalPaid: 0, count: 0 }
      };
    }

    const { status, fromDate, toDate, limit = 20, offset = 0 } = queryParams;

    const whereClause: any = { agentId };
    if (status && status !== 'all') whereClause.status = status;

    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date.gte = new Date(fromDate);
      if (toDate) whereClause.date.lte = new Date(toDate);
    }

    const [total, items, allBonuses] = await Promise.all([
      prisma.agentBonus.count({ where: whereClause }),
      prisma.agentBonus.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          attendance: true,
          issuedBy: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      prisma.agentBonus.findMany({
        where: { agentId },
        select: { amount: true, status: true }
      })
    ]);

    const summary = allBonuses.reduce(
      (acc, b) => {
        if (b.status === 'PENDING') acc.totalPending += b.amount;
        else if (b.status === 'PAID') acc.totalPaid += b.amount;
        acc.count += 1;
        return acc;
      },
      { totalPending: 0, totalPaid: 0, count: 0 }
    );

    return { total, items, summary };
  }

  /**
   * Admin: Get all staff bonuses across all agents
   */
  async getAllBonuses(queryParams: any) {
    const { agentId, status, bonusType, fromDate, toDate, limit = 20, offset = 0 } = queryParams;

    const whereClause: any = {};
    if (agentId && agentId !== 'all') whereClause.agentId = agentId;
    if (status && status !== 'all') whereClause.status = status;
    if (bonusType && bonusType !== 'all') whereClause.bonusType = bonusType;

    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date.gte = new Date(fromDate);
      if (toDate) whereClause.date.lte = new Date(toDate);
    }

    const [total, items, summaryList] = await Promise.all([
      prisma.agentBonus.count({ where: whereClause }),
      prisma.agentBonus.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          agent: { select: { id: true, name: true, email: true } },
          attendance: true,
          issuedBy: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      prisma.agentBonus.findMany({
        where: whereClause,
        select: { amount: true, status: true }
      })
    ]);

    const summary = summaryList.reduce(
      (acc, b) => {
        if (b.status === 'PENDING') acc.totalPending += b.amount;
        else if (b.status === 'PAID') acc.totalPaid += b.amount;
        acc.totalAmount += b.amount;
        return acc;
      },
      { totalPending: 0, totalPaid: 0, totalAmount: 0 }
    );

    return { total, items, summary };
  }

  /**
   * Issue a bonus manually or automatically
   */
  async issueBonus(data: {
    agentId: string;
    bonusType: 'EARLY_CHECKIN' | 'ON_TIME' | 'PERFORMANCE' | 'MANUAL';
    amount: number;
    currency?: string;
    reason: string;
    date: Date | string;
    attendanceId?: string;
    issuedById?: string;
  }) {
    const { agentId, bonusType, amount, currency = 'GBP', reason, date, attendanceId, issuedById } = data;

    if (!agentId) throw new BadRequestException('Agent ID is required');
    if (!amount || amount <= 0) throw new BadRequestException('Bonus amount must be greater than 0');
    if (!reason || !reason.trim()) throw new BadRequestException('Reason for bonus is required');

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const bonusDate = new Date(date);
    bonusDate.setUTCHours(0, 0, 0, 0);

    const bonus = await prisma.agentBonus.create({
      data: {
        agentId,
        bonusType,
        amount: Number(amount),
        currency: (currency || 'GBP').toUpperCase(),
        reason: reason.trim(),
        date: bonusDate,
        attendanceId: attendanceId || undefined,
        issuedById: issuedById || undefined,
        status: 'PENDING'
      },
      include: {
        agent: true,
        issuedBy: { select: { firstName: true, lastName: true } }
      }
    });

    const dateStr = bonusDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Dispatch SMTP Email Notification asynchronously
    emailService
      .sendAgentBonusNotification(agent.email, agent.name, {
        bonusType,
        amount: Number(amount),
        currency: (currency || 'GBP').toUpperCase(),
        dateStr,
        reason: reason.trim(),
        status: 'PENDING'
      })
      .catch((err) => logger.error('Error dispatching bonus email notification:', err));

    return bonus;
  }

  /**
   * Update bonus status (e.g. mark as PAID)
   */
  async updateBonus(bonusId: string, data: any) {
    const bonus = await prisma.agentBonus.findUnique({ where: { id: bonusId } });
    if (!bonus) throw new NotFoundException('Bonus record not found');

    return prisma.agentBonus.update({
      where: { id: bonusId },
      data: {
        amount: data.amount ? Number(data.amount) : undefined,
        currency: data.currency ? data.currency.toUpperCase() : undefined,
        reason: data.reason ? data.reason.trim() : undefined,
        status: data.status || undefined,
        paidAt: data.status === 'PAID' ? new Date() : undefined
      }
    });
  }
}

export const bonusService = new BonusService();
