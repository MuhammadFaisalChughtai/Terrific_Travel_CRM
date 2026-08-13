import { prisma, logger } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import { emailService } from './email.service';

export class FineService {
  /**
   * Get fines for a specific agent (for Agent Portal view)
   */
  async getAgentFines(userId: string, queryParams: any) {
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
        fines: [],
        summary: { totalPending: 0, totalDeducted: 0, totalWaived: 0, count: 0 }
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

    const [total, items, allFines] = await Promise.all([
      prisma.agentFine.count({ where: whereClause }),
      prisma.agentFine.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          attendance: true,
          issuedBy: { select: { firstName: true, lastName: true, email: true } },
          waivedBy: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      prisma.agentFine.findMany({
        where: { agentId },
        select: { amount: true, status: true }
      })
    ]);

    const summary = allFines.reduce(
      (acc, f) => {
        if (f.status === 'PENDING') acc.totalPending += f.amount;
        else if (f.status === 'DEDUCTED') acc.totalDeducted += f.amount;
        else if (f.status === 'WAIVED') acc.totalWaived += f.amount;
        acc.count += 1;
        return acc;
      },
      { totalPending: 0, totalDeducted: 0, totalWaived: 0, count: 0 }
    );

    return { total, items, summary };
  }

  /**
   * Admin: Get all staff fines across all agents
   */
  async getAllFines(queryParams: any) {
    const { agentId, status, fineType, fromDate, toDate, limit = 20, offset = 0 } = queryParams;

    const whereClause: any = {};
    if (agentId && agentId !== 'all') whereClause.agentId = agentId;
    if (status && status !== 'all') whereClause.status = status;
    if (fineType && fineType !== 'all') whereClause.fineType = fineType;

    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date.gte = new Date(fromDate);
      if (toDate) whereClause.date.lte = new Date(toDate);
    }

    const [total, items, summaryList] = await Promise.all([
      prisma.agentFine.count({ where: whereClause }),
      prisma.agentFine.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          agent: { select: { id: true, name: true, email: true } },
          attendance: true,
          issuedBy: { select: { firstName: true, lastName: true, email: true } },
          waivedBy: { select: { firstName: true, lastName: true, email: true } }
        }
      }),
      prisma.agentFine.findMany({
        where: whereClause,
        select: { amount: true, status: true }
      })
    ]);

    const summary = summaryList.reduce(
      (acc, f) => {
        if (f.status === 'PENDING') acc.totalPending += f.amount;
        else if (f.status === 'DEDUCTED') acc.totalDeducted += f.amount;
        else if (f.status === 'WAIVED') acc.totalWaived += f.amount;
        acc.totalAmount += f.amount;
        return acc;
      },
      { totalPending: 0, totalDeducted: 0, totalWaived: 0, totalAmount: 0 }
    );

    return { total, items, summary };
  }

  /**
   * Issue a fine manually or via service call
   */
  async issueFine(data: {
    agentId: string;
    fineType: 'LATE_ARRIVAL' | 'ABSENCE' | 'MANUAL';
    amount: number;
    currency?: string;
    reason: string;
    date: Date | string;
    attendanceId?: string;
    issuedById?: string;
  }) {
    const { agentId, fineType, amount, currency = 'GBP', reason, date, attendanceId, issuedById } = data;

    if (!agentId) throw new BadRequestException('Agent ID is required');
    if (!amount || amount <= 0) throw new BadRequestException('Fine amount must be greater than 0');
    if (!reason || !reason.trim()) throw new BadRequestException('Reason for fine is required');

    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const fineDate = new Date(date);
    fineDate.setUTCHours(0, 0, 0, 0);

    const fine = await prisma.agentFine.create({
      data: {
        agentId,
        fineType,
        amount: Number(amount),
        currency: (currency || 'GBP').toUpperCase(),
        reason: reason.trim(),
        date: fineDate,
        attendanceId: attendanceId || undefined,
        issuedById: issuedById || undefined,
        status: 'PENDING'
      },
      include: {
        agent: true,
        issuedBy: { select: { firstName: true, lastName: true } }
      }
    });

    const dateStr = fineDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Dispatch SMTP Email Notification asynchronously
    emailService
      .sendAgentFineNotification(agent.email, agent.name, {
        fineType,
        amount: Number(amount),
        currency: (currency || 'GBP').toUpperCase(),
        dateStr,
        reason: reason.trim(),
        status: 'PENDING'
      })
      .catch((err) => logger.error('Error dispatching fine email notification:', err));

    return fine;
  }

  /**
   * Waive a fine
   */
  async waiveFine(fineId: string, adminId: string, waivedReason: string) {
    const fine = await prisma.agentFine.findUnique({
      where: { id: fineId },
      include: { agent: true }
    });

    if (!fine) throw new NotFoundException('Fine record not found');
    if (fine.status === 'WAIVED') throw new BadRequestException('Fine is already waived');

    const updated = await prisma.agentFine.update({
      where: { id: fineId },
      data: {
        status: 'WAIVED',
        waivedById: adminId,
        waivedReason: waivedReason ? waivedReason.trim() : 'Waived by management'
      },
      include: {
        agent: true,
        waivedBy: { select: { firstName: true, lastName: true } }
      }
    });

    const dateStr = new Date(fine.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Dispatch SMTP Email Notification asynchronously
    if (fine.agent?.email) {
      emailService
        .sendAgentFineWaivedNotification(fine.agent.email, fine.agent.name, {
          fineType: fine.fineType,
          amount: fine.amount,
          currency: fine.currency || 'GBP',
          dateStr,
          waivedReason: waivedReason ? waivedReason.trim() : undefined
        })
        .catch((err) => logger.error('Error dispatching fine waiver email notification:', err));
    }

    return updated;
  }

  /**
   * Update fine status or amount
   */
  async updateFine(fineId: string, data: any) {
    const fine = await prisma.agentFine.findUnique({ where: { id: fineId } });
    if (!fine) throw new NotFoundException('Fine record not found');

    return prisma.agentFine.update({
      where: { id: fineId },
      data: {
        amount: data.amount ? Number(data.amount) : undefined,
        reason: data.reason ? data.reason.trim() : undefined,
        status: data.status || undefined,
        deductedAt: data.status === 'DEDUCTED' ? new Date() : undefined
      }
    });
  }
}

export const fineService = new FineService();
