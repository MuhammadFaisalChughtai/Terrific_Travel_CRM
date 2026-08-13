import cron from "node-cron";
import { prisma, logger } from "../config";
import { emailService } from "../services/email.service";

export const runMissingDetailsCheck = async () => {
  logger.info("[CRON] Starting missing details check for upcoming bookings...");

  try {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0,
    );
    const fiveDaysFromNow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 5,
      23,
      59,
      59,
      999,
    );

    // Fetch active bookings that are NOT CANCELLED or COMPLETED
    const bookings: any[] = await prisma.booking.findMany({
      where: {
        status: {
          notIn: ["CANCELLED", "COMPLETED"] as any,
        },
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
            vendor: true,
          },
        },
        accommodations: {
          select: {
            id: true,
            hotelName: true,
            checkInDate: true,
            checkOutDate: true,
            reservationNumber: true,
            hotelConfirmationNumber: true,
            vendor: true,
          },
        },
        passengers: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            title: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      } as any,
    });

    const isMissing = (val: string | null | undefined): boolean => {
      if (!val) return true;
      const trimmed = val.trim().toLowerCase();
      return (
        trimmed === "" ||
        trimmed === "pending" ||
        trimmed === "n/a" ||
        trimmed === "null" ||
        trimmed === "-"
      );
    };

    const formatDateStr = (d: Date) => {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    let countRemindersSent = 0;

    for (const booking of bookings) {
      const activeFlights: any[] = (booking.flightServices || []).filter(
        (f: any) => f.status !== "CANCELLED",
      );
      const activeHotels: any[] = booking.accommodations || [];

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

      const earliestTravelDate = new Date(
        Math.min(...dates.map((d) => d.getTime())),
      );

      // Check if earliest travel date is within 5 days from today
      if (earliestTravelDate < today || earliestTravelDate > fiveDaysFromNow) {
        continue;
      }

      const missingItems: string[] = [];

      // 1. Check Flight PNR
      const missingPnrFlights = activeFlights.filter((f: any) =>
        isMissing(f.pnr),
      );
      if (missingPnrFlights.length > 0) {
        missingItems.push("Flight PNR is missing");
      }

      // 2. Check Hotel Confirmation / Reservation Number
      const missingConfirmationHotels = activeHotels.filter(
        (h: any) => isMissing(h.hotelConfirmationNumber) && isMissing(h.reservationNumber)
      );
      if (missingConfirmationHotels.length > 0) {
        missingItems.push("Hotel Confirmation Number is missing");
      }

      // If nothing is missing, skip this booking!
      if (missingItems.length === 0) continue;

      const getAirlineName = (flightNo: string): string => {
        if (!flightNo) return "";
        const code = flightNo.trim().substring(0, 2).toUpperCase();
        const airlines: Record<string, string> = {
          TK: "Turkish Airlines",
          SV: "Saudi Arabian Airlines",
          EK: "Emirates",
          QR: "Qatar Airways",
          EY: "Etihad Airways",
          WY: "Oman Air",
          GF: "Gulf Air",
          BA: "British Airways",
          KU: "Kuwait Airways",
          MS: "EgyptAir",
          PK: "Pakistan International Airlines",
          AI: "Air India",
          FZ: "Flydubai",
          G9: "Air Arabia",
          XY: "Flynas",
          PA: "Airblue",
          ER: "Serene Air",
          NL: "Shaheen Air",
          PC: "Pegasus Airlines",
          BG: "Biman Bangladesh Airlines",
          J9: "Jazeera Airways",
        };
        return airlines[code] || `${code} Air`;
      };

      const getVendorName = (v: any): string => {
        if (!v) return "N/A";
        if (typeof v === "string") {
          if (v === "[object Object]" || v.trim() === "" || v.trim() === "null") return "N/A";
          try {
            const parsed = JSON.parse(v);
            if (parsed && typeof parsed === "object") {
              return parsed.name || parsed.companyName || parsed.title || "N/A";
            }
          } catch (e) {}
          return v;
        }
        if (typeof v === "object") {
          return v.name || v.companyName || v.title || "N/A";
        }
        return String(v);
      };

      const hotelSummaries = activeHotels.map((h: any) => ({
        hotelName: h.hotelName || "Hotel",
        vendor: getVendorName(h.vendor),
        checkInDate: formatDateStr(h.checkInDate),
        checkOutDate: h.checkOutDate ? formatDateStr(h.checkOutDate) : undefined,
        reservationNumber: h.reservationNumber || undefined,
        hotelConfirmationNumber: h.hotelConfirmationNumber || undefined,
        isMissingConfirmation: isMissing(h.hotelConfirmationNumber),
        isMissingReservation: isMissing(h.reservationNumber),
      }));

      const flightSummaries = activeFlights.map((f: any) => ({
        flightNo: f.flightNo || "Flight",
        airlineName: getAirlineName(f.flightNo),
        vendor: getVendorName(f.vendor),
        route: `${f.departedFrom || "—"} → ${f.arrivedAt || "—"}`,
        date: formatDateStr(f.date),
        pnr: f.pnr || undefined,
        isMissingPnr: isMissing(f.pnr),
      }));

      // Determine recipients: admin@terrifictravel.co.uk + agent email
      const recipientEmails: string[] = ["hotels@terrifictravel.co.uk"];

      const agentEmail = booking.agent?.email || booking.user?.email;
      if (agentEmail && !recipientEmails.includes(agentEmail)) {
        recipientEmails.push(agentEmail);
      }

      const leadPax =
        booking.passengers?.find((p: any) => p.role === "Leader") ||
        booking.passengers?.[0];
      const leadPaxName = leadPax
        ? `${leadPax.title || ""} ${leadPax.firstName} ${leadPax.lastName}`.trim()
        : "Valued Client";
      const agentName =
        booking.agent?.name ||
        (booking.user
          ? `${booking.user.firstName} ${booking.user.lastName}`
          : "");

      // Send Reminder Email
      const res = await emailService.sendMissingBookingDetailsReminder({
        recipients: recipientEmails,
        bookingRef: booking.bookingReference,
        travelDateStr: formatDateStr(earliestTravelDate),
        leadPassengerName: leadPaxName,
        agentName,
        missingItems,
        hotelSummaries,
        flightSummaries,
      });

      if (res.success) {
        countRemindersSent++;
      }
    }

    logger.info(
      `[CRON] Completed missing details check. Sent ${countRemindersSent} reminder emails.`,
    );
    return { countRemindersSent };
  } catch (error) {
    logger.error("[CRON] Error during missing details check:", error);
    throw error;
  }
};

export const startMissingDetailsReminderCron = () => {
  // Cron schedule: Every 3 hours (At minute 0 past every 3rd hour)
  cron.schedule("0 */3 * * *", async () => {
    await runMissingDetailsCheck();
  });
  logger.info(
    "Registered missing booking details reminder cron (every 3 hours)",
  );
};
