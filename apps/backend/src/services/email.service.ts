import * as nodemailer from 'nodemailer';
import { config, logger } from '../config';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    // Verify transporter connection configuration
    this.transporter.verify((error) => {
      if (error) {
        logger.error('SMTP Connection Error:', error);
      } else {
        logger.info('SMTP Server is ready to take messages');
      }
    });
  }

  async sendPassengerFormLink(
    toEmail: string,
    passengerName: string,
    bookingRef: string,
    formToken: string,
    otherPassengers: { title: string; firstName: string; lastName: string }[] = []
  ) {
    const fillUrl = `${config.frontendUrl}/passenger-form/${formToken}`;
    
    let multipleNoticeHtml = '';
    if (otherPassengers.length > 0) {
      const namesList = otherPassengers
        .map((p) => `<li><strong>${p.title} ${p.firstName} ${p.lastName}</strong></li>`)
        .join('');
      multipleNoticeHtml = `
        <div style="background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #dd6b20; font-weight: bold; font-size: 14px;">
            ?? Multiple Passengers Booking
          </p>
          <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 13px;">
            This link allows you to fill out the travel details for all passengers on this booking:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #2d3748; font-size: 13px;">
            ${namesList}
          </ul>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Provide Travel Documents</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; margin: 0; padding: 40px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px;">Terrific Travel</h1>
              <p style="color: rgba(255, 255, 255, 0.85); margin: 5px 0 0 0; font-size: 13px; font-weight: 500;">Travel Details Request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; color: #2d3748; line-height: 1.6;">
              <p style="font-size: 16px; margin-top: 0;">Hello <strong>${passengerName}</strong>,</p>
              <p style="font-size: 14px; color: #4a5568;">
                We hope you are excited for your upcoming trip! We require details from your travel documents (such as passport number, passport expiry date, nationality, and date of birth) to complete booking reference <strong>${bookingRef}</strong>.
              </p>
              
              ${multipleNoticeHtml}
              
              <p style="font-size: 14px; color: #4a5568; margin-bottom: 25px;">
                Please click the button below to safely submit your information directly to our system:
              </p>
              
              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${fillUrl}" target="_blank" style="background-color: #f97316; color: #ffffff; padding: 12px 30px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: background-color 0.2s;">
                      Provide Details
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 12px; color: #a0aec0; word-break: break-all; margin: 25px 0 0 0; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <a href="${fillUrl}" style="color: #f97316; text-decoration: underline;">${fillUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 20px; border-top: 1px solid #edf2f7; text-align: center; color: #718096; font-size: 12px;">
              <p style="margin: 0 0 5px 0;">This is an automated notification, please do not reply directly to this email.</p>
              <p style="margin: 0; font-weight: bold; color: #4a5568;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: toEmail,
        subject: `Action Required: Provide Travel Documents for Booking ${bookingRef}`,
        html: htmlContent,
      });
      logger.info(`Successfully sent passenger form link email to ${toEmail}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send email to ${toEmail}`, error);
      throw error;
    }
  }

  async sendTemporaryPassword(toEmail: string, operatorName: string, tempPassword: string) {
    const loginUrl = config.frontendUrl;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Temporary Password Generated</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; margin: 0; padding: 40px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px;">Terrific Travel</h1>
              <p style="color: rgba(255, 255, 255, 0.85); margin: 5px 0 0 0; font-size: 13px; font-weight: 500;">Operator Credentials</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; color: #2d3748; line-height: 1.6;">
              <p style="font-size: 16px; margin-top: 0;">Hello <strong>${operatorName}</strong>,</p>
              <p style="font-size: 14px; color: #4a5568;">
                An operator account has been created or updated for you. You have been configured with the following temporary credentials to log in:
              </p>
              
              <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; font-weight: bold; text-transform: uppercase;">Your Username / Email</p>
                <p style="margin: 0 0 15px 0; color: #2d3748; font-size: 15px; font-weight: bold;">${toEmail}</p>
                
                <p style="margin: 0 0 5px 0; color: #718096; font-size: 12px; font-weight: bold; text-transform: uppercase;">Temporary Password</p>
                <p style="margin: 0; color: #e53e3e; font-size: 18px; font-weight: bold; font-family: monospace; letter-spacing: 1px;">${tempPassword}</p>
              </div>
              
              <p style="font-size: 14px; color: #4a5568; margin-bottom: 25px;">
                Please log in using the link below and update your password in the Settings section:
              </p>
              
              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${loginUrl}" target="_blank" style="background-color: #f97316; color: #ffffff; padding: 12px 30px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.2); transition: background-color 0.2s;">
                      Go to CRM Login
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 20px; border-top: 1px solid #edf2f7; text-align: center; color: #718096; font-size: 12px;">
              <p style="margin: 0 0 5px 0;">This is an automated notification, please do not reply directly to this email.</p>
              <p style="margin: 0; font-weight: bold; color: #4a5568;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: toEmail,
        subject: 'Your Temporary Password for Terrific Travel CRM',
        html: htmlContent,
      });
      logger.info(`Successfully sent temporary password email to ${toEmail}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send temporary password email to ${toEmail}`, error);
      throw error;
    }
  }

  async sendMissingBookingDetailsReminder(params: {
    recipients: string[];
    bookingRef: string;
    travelDateStr: string;
    leadPassengerName: string;
    agentName: string;
    missingItems: string[];
    flightDetails?: string;
    hotelDetails?: string;
    hotelSummaries?: {
      hotelName: string;
      vendor: string;
      checkInDate: string;
      checkOutDate?: string;
      reservationNumber?: string;
      hotelConfirmationNumber?: string;
      isMissingConfirmation?: boolean;
      isMissingReservation?: boolean;
    }[];
    flightSummaries?: {
      flightNo: string;
      airlineName?: string;
      vendor: string;
      route: string;
      pnr?: string;
      date: string;
      isMissingPnr?: boolean;
    }[];
  }) {
    const { recipients, bookingRef, travelDateStr, leadPassengerName, agentName, missingItems, flightDetails, hotelDetails, hotelSummaries, flightSummaries } = params;
    const loginUrl = `${config.frontendUrl}/bookings?ref=${encodeURIComponent(bookingRef)}`;

    const missingListHtml = missingItems
      .map(
        (item) => `
        <li style="margin-bottom: 8px; color: #dc2626; font-weight: bold; font-size: 14px;">
          ❌ ${item}
        </li>`
      )
      .join('');

    const formatVendorStr = (v: any): string => {
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

    const hotelsHtml = hotelSummaries && hotelSummaries.length > 0
      ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0; font-weight: 800; font-size: 12px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px;">
            🏨 Accommodation &amp; Vendor Details
          </p>
          ${hotelSummaries
            .map(
              (h) => `
            <div style="font-size: 13px; color: #334155; padding: 8px 0; border-bottom: 1px dashed #cbd5e1;">
              <p style="margin: 0 0 4px 0;"><strong>Hotel Name:</strong> ${h.hotelName}</p>
              <p style="margin: 0 0 4px 0;"><strong>Vendor / Supplier:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${formatVendorStr(h.vendor)}</span></p>
              <p style="margin: 0 0 4px 0;"><strong>Check-in:</strong> ${h.checkInDate}${h.checkOutDate ? ` | <strong>Check-out:</strong> ${h.checkOutDate}` : ''}</p>
              ${
                h.isMissingConfirmation
                  ? `<p style="margin: 0; color: #dc2626; font-weight: bold;"><strong>Hotel Confirmation #:</strong> ❌ Missing</p>`
                  : `<p style="margin: 0; color: #059669; font-weight: bold;"><strong>Hotel Confirmation #:</strong> ${h.hotelConfirmationNumber}</p>`
              }
              ${
                h.reservationNumber
                  ? `<p style="margin: 3px 0 0 0;"><strong>Reservation / GDS #:</strong> ${h.reservationNumber}</p>`
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      `
      : '';

    const flightsHtml = flightSummaries && flightSummaries.length > 0
      ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0; font-weight: 800; font-size: 12px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px;">
            ✈️ Flight, Airline &amp; Vendor Details
          </p>
          ${flightSummaries
            .map(
              (f) => `
            <div style="font-size: 13px; color: #334155; padding: 8px 0; border-bottom: 1px dashed #cbd5e1;">
              <p style="margin: 0 0 4px 0;"><strong>Flight / Airline:</strong> ${f.flightNo}${f.airlineName ? ` (${f.airlineName})` : ''}</p>
              <p style="margin: 0 0 4px 0;"><strong>Vendor / Supplier:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${formatVendorStr(f.vendor)}</span></p>
              <p style="margin: 0 0 4px 0;"><strong>Route &amp; Date:</strong> ${f.route} (${f.date})</p>
              ${
                f.isMissingPnr
                  ? `<p style="margin: 0; color: #dc2626; font-weight: bold;"><strong>Flight PNR:</strong> ❌ Missing</p>`
                  : `<p style="margin: 0; color: #0284c7; font-weight: bold; font-family: monospace;"><strong>Flight PNR:</strong> ${f.pnr}</p>`
              }
            </div>
          `
            )
            .join('')}
        </div>
      `
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>REMINDER: Missing Booking Details (${bookingRef})</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7fafc; margin: 0; padding: 30px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #e11d48 0%, #f43f5e 100%); padding: 25px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">Terrific Travel</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 4px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ⚠️ Action Required: Missing Booking Details
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px; color: #2d3748; line-height: 1.6;">
              <p style="font-size: 15px; margin-top: 0;">Attention <strong>${agentName || 'Agent'} / Operations Team</strong>,</p>
              
              <p style="font-size: 14px; color: #4a5568;">
                The upcoming booking <strong>${bookingRef}</strong> scheduled for travel on <strong style="color: #0284c7;">${travelDateStr}</strong> (within 5 days) is currently missing required confirmation details:
              </p>

              <!-- Booking Details Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px;">
                <p style="margin: 0 0 6px 0;"><strong>Booking Reference:</strong> ${bookingRef}</p>
                <p style="margin: 0 0 6px 0;"><strong>Lead Passenger:</strong> ${leadPassengerName}</p>
                <p style="margin: 0 0 6px 0;"><strong>Travel Date:</strong> ${travelDateStr}</p>
                ${agentName ? `<p style="margin: 0;"><strong>Assigned Agent:</strong> ${agentName}</p>` : ''}
              </div>

              <!-- Missing Items Warning Box -->
              <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Missing Required Information:
                </p>
                <ul style="margin: 0; padding-left: 20px;">
                  ${missingListHtml}
                </ul>
              </div>

              ${hotelsHtml}
              ${flightsHtml}

              ${
                !hotelsHtml && hotelDetails
                  ? `<div style="font-size: 12px; color: #475569; margin-bottom: 12px;"><strong>Hotel Info:</strong> ${hotelDetails}</div>`
                  : ''
              }
              ${
                !flightsHtml && flightDetails
                  ? `<div style="font-size: 12px; color: #475569; margin-bottom: 12px;"><strong>Flight Route:</strong> ${flightDetails}</div>`
                  : ''
              }     }

              <p style="font-size: 13px; color: #4a5568; margin: 20px 0;">
                Please update the missing information in the CRM immediately. Reminders will continue every 3 hours until all required details are updated in the system.
              </p>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${loginUrl}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
                      Update Booking Details in CRM
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 16px; border-top: 1px solid #edf2f7; text-align: center; color: #718096; font-size: 11px;">
              <p style="margin: 0 0 4px 0;">This automated reminder is sent to admin@terrifictravel.co.uk and the assigned agent email.</p>
              <p style="margin: 0; font-weight: bold; color: #4a5568;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      const validRecipients = recipients.filter((r) => r && r.includes('@'));
      if (validRecipients.length === 0) return { success: false, reason: 'No valid recipient emails' };

      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: validRecipients.join(', '),
        subject: `[REMINDER] Missing Booking Details: ${bookingRef} - Travel Date: ${travelDateStr}`,
        html: htmlContent,
      });
      logger.info(`Successfully sent missing details reminder for booking ${bookingRef} to ${validRecipients.join(', ')}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send missing details reminder for booking ${bookingRef}`, error);
      return { success: false, error };
    }
  }

  async sendAgentFineNotification(
    agentEmail: string,
    agentName: string,
    fineDetails: {
      fineType: string;
      amount: number;
      currency?: string;
      dateStr: string;
      reason: string;
      status: string;
    }
  ) {
    const portalUrl = `${config.frontendUrl}/attendance`;
    const currCode = (fineDetails.currency || 'GBP').toUpperCase();
    const currSymbols: Record<string, string> = {
      GBP: '£',
      USD: '$',
      EUR: '€',
      PKR: 'Rs ',
      SAR: 'SAR ',
      AED: 'AED ',
    };
    const formattedAmount = `${currSymbols[currCode] || `${currCode} `}${fineDetails.amount.toFixed(2)}`;

    const typeLabel =
      fineDetails.fineType === 'LATE_ARRIVAL'
        ? 'Late Arrival Fine'
        : fineDetails.fineType === 'ABSENCE'
        ? 'Unexcused Absence Fine'
        : 'Disciplinary / Manual Fine';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notice of Fine Issued</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #991b1b; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                ⚠️ NOTICE OF FINE ISSUED
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 15px;">Dear <strong>${agentName}</strong>,</p>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                This email is an official notification that a fine has been applied to your staff account in accordance with company attendance and operational policies.
              </p>

              <!-- Fine Summary Box -->
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold; width: 140px;">Fine Type:</td>
                    <td style="padding: 4px 0; color: #991b1b; font-weight: 800;">${typeLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Amount:</td>
                    <td style="padding: 4px 0; color: #dc2626; font-weight: 800; font-size: 16px;">${formattedAmount} (${currCode})</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Violation Date:</td>
                    <td style="padding: 4px 0;">${fineDetails.dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Reason / Details:</td>
                    <td style="padding: 4px 0; font-style: italic;">${fineDetails.reason}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Status:</td>
                    <td style="padding: 4px 0;"><span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${fineDetails.status}</span></td>
                  </tr>
                </table>
              </div>

              <p style="margin: 20px 0 10px 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                You can review your complete attendance and fines ledger at any time via your Agent Portal.
              </p>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${portalUrl}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
                      View Fines in Agent Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 11px;">
              <p style="margin: 0; font-weight: bold; color: #475569;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd — Staff Operations</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      if (!agentEmail || !agentEmail.includes('@')) return { success: false, reason: 'Invalid agent email' };
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: agentEmail,
        subject: `[NOTICE] Fine Issued: ${formattedAmount} - ${typeLabel}`,
        html: htmlContent,
      });
      logger.info(`Sent fine notification email to ${agentEmail}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send fine notification to ${agentEmail}`, error);
      return { success: false, error };
    }
  }

  async sendAgentFineWaivedNotification(
    agentEmail: string,
    agentName: string,
    fineDetails: {
      fineType: string;
      amount: number;
      currency?: string;
      dateStr: string;
      waivedReason?: string;
    }
  ) {
    const portalUrl = `${config.frontendUrl}/attendance`;
    const currCode = (fineDetails.currency || 'GBP').toUpperCase();
    const currSymbols: Record<string, string> = {
      GBP: '£',
      USD: '$',
      EUR: '€',
      PKR: 'Rs ',
      SAR: 'SAR ',
      AED: 'AED ',
    };
    const formattedAmount = `${currSymbols[currCode] || `${currCode} `}${fineDetails.amount.toFixed(2)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notice of Fine Waived</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #059669; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                ✅ NOTICE OF FINE WAIVED
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 15px;">Dear <strong>${agentName}</strong>,</p>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                We are pleased to inform you that your fine of <strong>${formattedAmount}</strong> for the violation on <strong>${fineDetails.dateStr}</strong> has been officially <strong style="color: #059669;">WAIVED</strong> by management.
              </p>

              ${
                fineDetails.waivedReason
                  ? `<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 15px 0; color: #166534; font-size: 13px;">
                      <strong>Waiver Note:</strong> ${fineDetails.waivedReason}
                    </div>`
                  : ''
              }

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${portalUrl}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
                      View Updated Ledger in Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 11px;">
              <p style="margin: 0; font-weight: bold; color: #475569;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd — Staff Operations</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      if (!agentEmail || !agentEmail.includes('@')) return { success: false, reason: 'Invalid agent email' };
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: agentEmail,
        subject: `[CONFIRMATION] Fine of ${formattedAmount} Has Been Waived`,
        html: htmlContent,
      });
      logger.info(`Sent fine waiver notification email to ${agentEmail}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send fine waiver notification to ${agentEmail}`, error);
      return { success: false, error };
    }
  }

  async sendAgentBonusNotification(
    agentEmail: string,
    agentName: string,
    bonusDetails: {
      bonusType: string;
      amount: number;
      currency?: string;
      dateStr: string;
      reason: string;
      status: string;
    }
  ) {
    const portalUrl = `${config.frontendUrl}/attendance`;
    const currCode = (bonusDetails.currency || 'GBP').toUpperCase();
    const currSymbols: Record<string, string> = {
      GBP: '£',
      USD: '$',
      EUR: '€',
      PKR: 'Rs ',
      SAR: 'SAR ',
      AED: 'AED ',
    };
    const formattedAmount = `${currSymbols[currCode] || `${currCode} `}${bonusDetails.amount.toFixed(2)}`;

    const typeLabel =
      bonusDetails.bonusType === 'EARLY_CHECKIN'
        ? 'Early Check-in Bonus'
        : bonusDetails.bonusType === 'ON_TIME'
        ? 'Punctuality Bonus'
        : bonusDetails.bonusType === 'PERFORMANCE'
        ? 'Performance Award'
        : 'Special Bonus';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Congratulations! Bonus Awarded</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #059669; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                🎉 CONGRATULATIONS! BONUS AWARDED
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 16px 0; color: #1e293b; font-size: 15px;">Dear <strong>${agentName}</strong>,</p>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.5;">
                We are excited to inform you that a staff bonus has been awarded to your account for your outstanding punctuality or performance.
              </p>

              <!-- Bonus Summary Box -->
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 18px; margin: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #065f46;">
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold; width: 140px;">Bonus Type:</td>
                    <td style="padding: 4px 0; font-weight: 800;">${typeLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Bonus Amount:</td>
                    <td style="padding: 4px 0; font-weight: 800; font-size: 18px; color: #047857;">${formattedAmount} (${currCode})</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Date Awarded:</td>
                    <td style="padding: 4px 0;">${bonusDetails.dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: bold;">Reason / Details:</td>
                    <td style="padding: 4px 0; font-style: italic;">${bonusDetails.reason}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; text-align: center;">
                <tr>
                  <td>
                    <a href="${portalUrl}" target="_blank" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
                      View Bonus Ledger in Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 11px;">
              <p style="margin: 0; font-weight: bold; color: #475569;">&copy; ${new Date().getFullYear()} Terrific Travel Ltd — Staff Operations</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      if (!agentEmail || !agentEmail.includes('@')) return { success: false, reason: 'Invalid agent email' };
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: agentEmail,
        subject: `[BONUS] Awarded: ${formattedAmount} - ${typeLabel}`,
        html: htmlContent,
      });
      logger.info(`Sent bonus notification email to ${agentEmail}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send bonus notification to ${agentEmail}`, error);
      return { success: false, error };
    }
  }

  async sendLeadFollowUpReminderEmail(params: {
    agentEmail: string;
    agentName: string;
    leadName: string;
    phoneNumber: string;
    scheduledAt: Date;
    notes?: string | null;
    leadId: string;
  }) {
    const { agentEmail, agentName, leadName, phoneNumber, scheduledAt, notes } = params;

    const formattedTime = scheduledAt.toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 28px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 30px; }
        .badge { display: inline-block; background-color: #ffedd5; color: #c2410c; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; }
        .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px; }
        .field { margin-bottom: 12px; }
        .field:last-child { margin-bottom: 0; }
        .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 2px; }
        .value { font-size: 15px; color: #0f172a; font-weight: 600; }
        .btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pending Lead Follow-Up Reminder</h1>
          <p>Terrific Travel CRM Notification</p>
        </div>
        <div class="body">
          <div class="badge">⏰ Follow-up Due Now</div>
          <p>Hi <strong>${agentName}</strong>,</p>
          <p>This is a single reminder for your scheduled lead follow-up action due at <strong>${formattedTime}</strong>.</p>
          
          <div class="card">
            <div class="field">
              <div class="label">Lead Name</div>
              <div class="value">${leadName}</div>
            </div>
            <div class="field">
              <div class="label">Phone Number</div>
              <div class="value">${phoneNumber}</div>
            </div>
            <div class="field">
              <div class="label">Scheduled Date & Time</div>
              <div class="value">${formattedTime}</div>
            </div>
            ${notes ? `
            <div class="field">
              <div class="label">Activity / Follow-up Notes</div>
              <div class="value" style="font-size:13px; font-weight:400; color:#334155;">${notes}</div>
            </div>
            ` : ''}
          </div>

          <p style="font-size:13px; color:#475569;">Please contact the client and update their lead status in the CRM.</p>
          <div style="text-align: center;">
            <a href="${config.frontendUrl}/leads" class="btn">Open Leads Console</a>
          </div>
        </div>
        <div class="footer">
          Terrific Travel TMS &copy; ${new Date().getFullYear()} • Automated Notification System
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      if (!agentEmail || !agentEmail.includes('@')) return { success: false, reason: 'Invalid agent email' };
      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: agentEmail,
        subject: `[Follow-Up Reminder] Pending Lead: ${leadName}`,
        html: htmlContent,
      });
      logger.info(`Sent lead follow-up reminder email to ${agentEmail} for lead ${leadName}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send follow-up reminder email for lead ${leadName} to ${agentEmail}`, error);
      return { success: false, error };
    }
  }
}

export const emailService = new EmailService();
