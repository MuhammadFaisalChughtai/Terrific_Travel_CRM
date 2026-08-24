import cron from "node-cron";
import { prisma, logger } from "../config";
import { emailService } from "../services/email.service";

export const runLeadFollowUpCheck = async () => {
  try {
    const now = new Date();

    // Fetch leads where status is FOLLOW_UP or CALL_BACK, nextFollowUpAt <= now, and reminder has NOT been sent
    const dueLeads = await prisma.lead.findMany({
      where: {
        status: { in: ["FOLLOW_UP", "CALL_BACK"] },
        nextFollowUpAt: { lte: now },
        followUpReminderSent: false,
      },
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (dueLeads.length === 0) return;

    logger.info(`[CRON] Found ${dueLeads.length} lead follow-up reminders due for dispatch.`);

    for (const lead of dueLeads) {
      const recipient = lead.assignedAgent || lead.createdBy;
      if (!recipient || !recipient.email) {
        // Mark as sent so we don't repeatedly process invalid recipients
        await prisma.lead.update({
          where: { id: lead.id },
          data: { followUpReminderSent: true },
        });
        continue;
      }

      const agentName = `${recipient.firstName} ${recipient.lastName}`.trim();
      await emailService.sendLeadFollowUpReminderEmail({
        agentEmail: recipient.email,
        agentName: agentName || "Agent",
        leadName: lead.fullName,
        phoneNumber: lead.phoneNumber,
        scheduledAt: lead.nextFollowUpAt || now,
        notes: lead.notes,
        leadId: lead.id,
      });

      // Mark followUpReminderSent = true ONLY ONCE so no duplicate emails are sent!
      await prisma.lead.update({
        where: { id: lead.id },
        data: { followUpReminderSent: true },
      });

      logger.info(`[CRON] Sent single follow-up reminder email for Lead "${lead.fullName}" to ${recipient.email}`);
    }
  } catch (err) {
    logger.error("[CRON] Error during lead follow-up check:", err);
  }
};

export const startLeadFollowUpReminderCron = () => {
  // Check every minute for due follow-up reminders
  cron.schedule("* * * * *", async () => {
    await runLeadFollowUpCheck();
  });
  logger.info("Registered Lead follow-up reminder cron job (runs every minute)");
};
