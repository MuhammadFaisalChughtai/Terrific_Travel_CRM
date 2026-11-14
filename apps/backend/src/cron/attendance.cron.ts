import cron from 'node-cron';
import { prisma, logger } from '../config';

export const startAttendanceCron = () => {
  // Run at 23:59 every day
  cron.schedule('59 23 * * *', async () => {
    logger.info('Running daily attendance check...');
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const agents = await prisma.agent.findMany({
        where: { jobStatus: 'Active' }
      });

      for (const agent of agents) {
        const record = await prisma.attendance.findUnique({
          where: {
            agentId_date: {
              agentId: agent.id,
              date: today
            }
          }
        });

        if (!record) {
          // Agent forgot to check in at all
          await prisma.attendance.create({
            data: {
              agentId: agent.id,
              date: today,
              status: 'ABSENT'
            }
          });
          logger.info(`Marked agent ${agent.id} as ABSENT (No check-in)`);
        } else if (record.checkInTime && !record.checkOutTime) {
          // Agent checked in but forgot to check out
          await prisma.attendance.update({
            where: { id: record.id },
            data: { status: 'ABSENT' }
          });
          logger.info(`Marked agent ${agent.id} as ABSENT (Forgot check-out)`);
        }
      }
      logger.info('Daily attendance check completed.');
    } catch (err) {
      logger.error('Error running daily attendance check:', err);
    }
  });

  // Run at 00:00 on the 1st of every month for monthly fine audit
  cron.schedule('0 0 1 * *', async () => {
    logger.info('Running monthly fine audit for payroll deduction rollover...');
    try {
      const now = new Date();
      const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const pendingCount = await prisma.agentFine.count({
        where: {
          status: 'PENDING',
          date: {
            gte: firstDayPrevMonth,
            lte: lastDayPrevMonth
          }
        }
      });
      logger.info(`Monthly fine audit completed: ${pendingCount} pending fine(s) found from previous month ready for payroll auto-deduction.`);
    } catch (err) {
      logger.error('Error running monthly fine audit cron:', err);
    }
  });
};
