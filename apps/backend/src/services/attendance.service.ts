import { prisma } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';

export class AttendanceService {
  async checkIn(userId: string) {
    let user = await prisma.user.findUnique({ where: { id: userId }, include: { agent: true } });
    if (!user) throw new BadRequestException('User not found');

    if (!user.agentId) {
      let agent = await prisma.agent.findUnique({
        where: { email: user.email }
      });
      
      if (!agent) {
        const agentName = `${user.firstName} ${user.lastName}`.trim() || 'Admin User';
        agent = await prisma.agent.create({
          data: {
            name: agentName,
            email: user.email,
            phoneNumber: 'N/A',
            gdsSystem: 'N/A',
            client: 'N/A',
            pcc: 'N/A',
            passwordHash: user.passwordHash || 'N/A',
          }
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { agentId: agent.id }
      });

      user = await prisma.user.findUnique({ where: { id: userId }, include: { agent: true } }) as any;
    }

    if (!user || !user.agentId) {
      throw new BadRequestException('User agent link failed');
    }

    const agentId = user.agentId;

    // Get today's date (start of day UTC)
    const now = new Date();
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);

    // Agent specific shift start time and grace period based on weekday vs weekend vs holiday
    const agentObj = user.agent;
    const dayOfWeek = now.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let shiftTimeStr = agentObj?.shiftStartTime || "09:00";
    let graceMins = agentObj?.gracePeriodMinutes ?? 15;
    let isOffDay = false;

    if (isWeekend) {
      if (agentObj?.isWeekendOff) {
        isOffDay = true;
      } else if (agentObj?.weekendShiftStartTime) {
        shiftTimeStr = agentObj.weekendShiftStartTime;
        graceMins = agentObj.weekendGracePeriodMinutes ?? 15;
      }
    }

    const [startHourStr, startMinStr] = shiftTimeStr.split(":");
    const startHour = parseInt(startHourStr || "9", 10);
    const startMin = parseInt(startMinStr || "0", 10);

    const shiftStart = new Date(now);
    shiftStart.setHours(startHour, startMin, 0, 0);

    const graceCutoff = new Date(shiftStart.getTime() + graceMins * 60 * 1000);

    let isLate = false;
    let lateMinutes = 0;

    if (!isOffDay && now > graceCutoff) {
      isLate = true;
      lateMinutes = Math.floor((now.getTime() - shiftStart.getTime()) / (1000 * 60));
    }

    const formattedShiftStart = shiftStart.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const existingRecord = await prisma.attendance.findUnique({
      where: {
        agentId_date: {
          agentId,
          date: today,
        }
      }
    });

    let record: any;

    if (existingRecord) {
      if (existingRecord.checkInTime) {
        throw new BadRequestException('Already checked in for today');
      }
      record = await prisma.attendance.update({
        where: { id: existingRecord.id },
        data: {
          checkInTime: now,
          status: 'PRESENT',
          isLate,
          lateMinutes
        }
      });
    } else {
      record = await prisma.attendance.create({
        data: {
          agentId,
          date: today,
          checkInTime: now,
          status: 'PRESENT',
          isLate,
          lateMinutes
        }
      });
    }

    return record;
  }

  async checkOut(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { agent: true } });
    if (!user) throw new BadRequestException('User not found');
    if (!user.agentId) throw new BadRequestException('You must check in first');

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingRecord = await prisma.attendance.findUnique({
      where: {
        agentId_date: {
          agentId: user.agentId!,
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
    const { fromDate, toDate, agentId, status, limit, offset } = filters;
    
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

    if (limit !== undefined || offset !== undefined) {
      const takeVal = Number(limit) || 10;
      const skipVal = Number(offset) || 0;

      const [total, items] = await Promise.all([
        prisma.attendance.count({ where: whereClause }),
        prisma.attendance.findMany({
          where: whereClause,
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                shiftStartTime: true,
                shiftEndTime: true,
                gracePeriodMinutes: true,
                weekendShiftStartTime: true,
                weekendShiftEndTime: true,
                weekendGracePeriodMinutes: true,
                isWeekendOff: true,
                holidayShiftStartTime: true,
                holidayShiftEndTime: true,
                holidayGracePeriodMinutes: true,
                isHolidayOff: true,
                workDays: true,
              }
            }
          },
          orderBy: { date: 'desc' },
          take: takeVal,
          skip: skipVal,
        })
      ]);

      console.log(`Found ${items.length} paginated attendance records of ${total} total`);
      return { total, limit: takeVal, offset: skipVal, items };
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            shiftStartTime: true,
            shiftEndTime: true,
            gracePeriodMinutes: true,
            weekendShiftStartTime: true,
            weekendShiftEndTime: true,
            weekendGracePeriodMinutes: true,
            isWeekendOff: true,
            holidayShiftStartTime: true,
            holidayShiftEndTime: true,
            holidayGracePeriodMinutes: true,
            isHolidayOff: true,
            workDays: true,
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    console.log(`Found ${records.length} attendance records`);
    return records;
  }
  async updateAttendance(id: string, data: any) {
    const record = await prisma.attendance.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Attendance record not found');
    
    // Parse dates if provided, allow nulling them out if explicitly passed as null
    let updateData: any = {};
    if (data.checkInTime !== undefined) {
      updateData.checkInTime = data.checkInTime ? new Date(data.checkInTime) : null;
    }
    if (data.checkOutTime !== undefined) {
      updateData.checkOutTime = data.checkOutTime ? new Date(data.checkOutTime) : null;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.isLate !== undefined) {
      updateData.isLate = Boolean(data.isLate);
    }
    if (data.lateMinutes !== undefined) {
      updateData.lateMinutes = Number(data.lateMinutes) || 0;
    }

    return prisma.attendance.update({
      where: { id },
      data: updateData
    });
  }
}

export const attendanceService = new AttendanceService();
