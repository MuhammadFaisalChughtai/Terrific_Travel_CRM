import cron from 'node-cron';
import { prisma, logger } from '../config';
import { emailService } from '../services/email.service';

export const runMissingDetailsCheck = async () => {
  logger.info('[CRON] Starting missing details check for upcoming bookings...');

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const fiveDaysFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 23, 59, 59, 999);

    // Fetch active bookings that are NOT CANCELLED or COMPLETED
    const bookings: any[] = await prisma.booking.findMany({
      where: {
        status: {
          notIn: ['CANCELLED', 'COMPLETED'] as any
        }
      },
      include: {
        flightServices: {
          select: {
            id: true,
            flightNo: true,
            pnr: true,
            date: true,
            departedFrom: true,
            arrivedAt: true,
            status: true,
          }
        },
        accommodations: {
          select: {
            id: true,
            hotelName: true,
            checkInDate: true,
            reservationNumber: true,
            hotelConfirmationNumber: true,
          }
        },
        passengers: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            title: true,
          }
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      } as any
    });

    const isMissing = (val: string | null | undefined): boolean => {
      if (!val) return true;
      const trimmed = val.trim().toLowerCase();
      return trimmed === '' || trimmed === 'pending' || trimmed === 'n/a' || trimmed === 'null' || trimmed === '-';
    };

    const formatDateStr = (d: Date) => {
      return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    let countRemindersSent = 0;

    for (const booking of bookings) {
      const activeFlights: any[] = (booking.flightServices || []).filter((f: any) => f.status !== 'CANCELLED');
      const activeHotels: any[] = (booking.accommodations || []);

      if (activeFlights.length === 0 && activeHotels.length === 0) continue;

      // Find earliest travel date among flights or hotels
      const dates: Date[] = [];
      activeFlights.forEach((f: any) => {
        if (f.date) dates.push(new Date(f.date));
      });
      activeHotels.forEach((h: any) => {
        if (h.checkInDate) dates.push(new Date(h.checkInDate));
      });

      if (dates.length === 0) continue;

      const earliestTravelDate = new Date(Math.min(...dates.map(d => d.getTime())));

      // Check if earliest travel date is within 5 days from today
      if (earliestTravelDate < today || earliestTravelDate > fiveDaysFromNow) {
        continue;
      }

      const missingItems: string[] = [];
      let flightDetailsStr = '';
      let hotelDetailsStr = '';

      // 1. Check Flight PNR
      const missingPnrFlights = activeFlights.filter((f: any) => isMissing(f.pnr));
      if (missingPnrFlights.length > 0) {
        missingItems.push('Flight PNR is missing');
        flightDetailsStr = missingPnrFlights.map((f: any) => `${f.flightNo || 'Flight'} (${f.departedFrom || ''} → ${f.arrivedAt || ''})`).join(', ');
      }

      // 2. Check Hotel Reservation Number
      const missingReservationHotels = activeHotels.filter((h: any) => isMissing(h.reservationNumber));
      if (missingReservationHotels.length > 0) {
        missingItems.push('Hotel Reservation Number is missing');
        hotelDetailsStr = missingReservationHotels.map((h: any) => `${h.hotelName} (Check-in: ${formatDateStr(h.checkInDate)})`).join(', ');
      }

      // 3. Check Hotel Confirmation Number
      const missingConfirmationHotels = activeHotels.filter((h: any) => isMissing(h.hotelConfirmationNumber));
      if (missingConfirmationHotels.length > 0) {
        missingItems.push('Hotel Confirmation Number is missing');
        if (!hotelDetailsStr) {
          hotelDetailsStr = missingConfirmationHotels.map((h: any) => `${h.hotelName} (Check-in: ${formatDateStr(h.checkInDate)})`).join(', ');
        }
      }

      // If nothing is missing, skip this booking!
      if (missingItems.length === 0) continue;

      // Determine recipients: admin@terrifictravel.co.uk + agent email
      const recipientEmails: string[] = ['admin@terrifictravel.co.uk'];

      const agentEmail = booking.agent?.email || booking.user?.email;
      if (agentEmail && !recipientEmails.includes(agentEmail)) {
        recipientEmails.push(agentEmail);
      }

      const leadPax = booking.passengers?.find((p: any) => p.role === 'Leader') || booking.passengers?.[0];
      const leadPaxName = leadPax ? `${leadPax.title || ''} ${leadPax.firstName} ${leadPax.lastName}`.trim() : 'Valued Client';
      const agentName = booking.agent?.name || (booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : '');

      // Send Reminder Email
      const res = await emailService.sendMissingBookingDetailsReminder({
        recipients: recipientEmails,
        bookingRef: booking.bookingReference,
        travelDateStr: formatDateStr(earliestTravelDate),
        leadPassengerName: leadPaxName,
        agentName,
        missingItems,
        flightDetails: flightDetailsStr,
        hotelDetails: hotelDetailsStr
      });

      if (res.success) {
        countRemindersSent++;
      }
    }

    logger.info(`[CRON] Completed missing details check. Sent ${countRemindersSent} reminder emails.`);
    return { countRemindersSent };
  } catch (error) {
    logger.error('[CRON] Error during missing details check:', error);
    throw error;
  }
};

export const startMissingDetailsReminderCron = () => {
  // Cron schedule: Every 3 hours (At minute 0 past every 3rd hour)
  cron.schedule('0 */3 * * *', async () => {
    await runMissingDetailsCheck();
  });
  logger.info('Registered missing booking details reminder cron (every 3 hours)');
};
