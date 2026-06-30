import { prisma } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';

export class AttendanceService {
  async checkIn(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { agent: true } });
    if (!user || !user.agentId) throw new BadRequestException('User is not an agent');

    // Get today's date (start of day UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingRecord = await prisma.attendance.findUnique({
      where: {
        agentId_date: {
          agentId: user.agentId,
          date: today,
        }
      }
    });

    if (existingRecord) {
      if (existingRecord.checkInTime) {
        throw new BadRequestException('Already checked in for today');
      }
      // If record exists (maybe pre-created absent or something, though unlikely), update it
      return prisma.attendance.update({
        where: { id: existingRecord.id },
        data: { checkInTime: new Date(), status: 'PRESENT' }
      });
    }

    return prisma.attendance.create({
      data: {
        agentId: user.agentId,
        date: today,
        checkInTime: new Date(),
        status: 'PRESENT'
      }
    });
  }

  async checkOut(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { agent: true } });
    if (!user || !user.agentId) throw new BadRequestException('User is not an agent');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingRecord = await prisma.attendance.findUnique({
      where: {
        agentId_date: {
          agentId: user.agentId,
          date: today,
        }
      }
    });

    if (!existingRecord || !existingRecord.checkInTime) {
      throw new BadRequestException('You must check in first');
    }

    if (existingRecord.checkOutTime) {
      throw new BadRequestException('Already checked out for today');
    }

    return prisma.attendance.update({
      where: { id: existingRecord.id },
      data: { checkOutTime: new Date(), status: 'PRESENT' }
    });
  }

  async getTodayStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.agentId) return null;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const record = await prisma.attendance.findUnique({
      where: {
        agentId_date: {
          agentId: user.agentId,
          date: today,
        }
      }
    });

    return record;
  }

  async getAllAttendance(filters: any) {
    const { fromDate, toDate, agentId, status } = filters;
    
    let whereClause: any = {};
    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) {
        const from = new Date(fromDate);
        from.setUTCHours(0, 0, 0, 0);
        whereClause.date.gte = from;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setUTCHours(0, 0, 0, 0);
        whereClause.date.lte = to;
      }
    }
    if (agentId && agentId !== 'all') {
      whereClause.agentId = agentId;
    }
    if (status && status !== 'all') {
      if (status === 'ON_LEAVE') {
        whereClause.status = 'ON_LEAVE'; // Fallback if added to enum later
      } else {
        whereClause.status = status.toUpperCase();
      }
    }

    console.log("getAllAttendance filters:", filters);
    console.log("getAllAttendance whereClause:", JSON.stringify(whereClause, null, 2));

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        agent: {
          select: { name: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    console.log(`Found ${records.length} attendance records`);
    return records;
  }
}

export const attendanceService = new AttendanceService();
