import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { config, logger } from '../config';
import { TERRIFIC_LOGO_BASE64 } from '../assets/logo.constant';

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

  async sendSalarySlipEmail(params: {
    toEmail: string;
    employeeName: string;
    payslipNumber: string;
    monthYear: string;
    payDate: string | Date;
    paymentMethod: string;
    designation?: string | null;
    department?: string | null;
    currency: string;
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    currencySymbol: string;
    basicSalary: number;
    houseRentAllowance: number;
    travelAllowance: number;
    otherAllowances: number;
    earningsJson?: Array<{ label: string; amount: number }> | null;
    taxDeduction: number;
    fineDeduction: number;
    otherDeductions: number;
    deductionsJson?: Array<{ label: string; amount: number }> | null;
    totalEarnings: number;
    totalDeductions: number;
    netSalary: number;
    notes?: string | null;
    pdfBase64?: string | null;
  }) {
    const {
      toEmail,
      employeeName,
      payslipNumber,
      monthYear,
      payDate,
      paymentMethod,
      designation,
      department,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      currencySymbol,
      basicSalary,
      houseRentAllowance,
      travelAllowance,
      otherAllowances,
      earningsJson,
      taxDeduction,
      fineDeduction,
      otherDeductions,
      deductionsJson,
      totalEarnings,
      totalDeductions,
      netSalary,
      notes,
      pdfBase64,
    } = params;

    const finalCompanyName = companyName || 'Terrific Travel (Private) Limited';
    const finalCompanyAddress = companyAddress || 'Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan';
    const finalCompanyPhone = companyPhone || '+441215291630';
    const finalCompanyEmail = companyEmail || 'office@terrifictravel.co.uk';

    const formattedPayDate = payDate
      ? new Date(payDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB');

    const formatAmt = (val: number) => `${currencySymbol} ${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Build custom earnings rows if any
    let extraEarningsRows = '';
    if (earningsJson && Array.isArray(earningsJson)) {
      extraEarningsRows = earningsJson
        .filter((e) => e && Number(e.amount || 0) > 0)
        .map((e) => `<tr><td style="padding: 7px 12px; color: #334155; font-size: 13px;">${e.label}</td><td style="padding: 7px 12px; text-align: right; font-weight: 600; color: #0f172a; font-size: 13px;">${formatAmt(e.amount)}</td></tr>`)
        .join('');
    }

    // Build custom deductions rows if any
    let extraDeductionsRows = '';
    if (deductionsJson && Array.isArray(deductionsJson)) {
      extraDeductionsRows = deductionsJson
        .filter((d) => d && Number(d.amount || 0) > 0)
        .map((d) => `<tr><td style="padding: 7px 12px; color: #334155; font-size: 13px;">${d.label}</td><td style="padding: 7px 12px; text-align: right; font-weight: 600; color: #b91c1c; font-size: 13px;">${formatAmt(d.amount)}</td></tr>`)
        .join('');
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Salary Slip - ${monthYear} - ${employeeName}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 10px; color: #0f172a; }
        .wrapper { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .header { background: #0f172a; color: #ffffff; padding: 24px 28px; border-bottom: 3px solid #ea580c; }
        .company-name { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; margin: 6px 0 2px 0; color: #ffffff; }
        .company-sub { font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.4; }
        .doc-badge { background: #1e293b; border: 1px solid #334155; color: #ea580c; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 6px; }
        .content { padding: 24px 28px; }
        .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; }
        .meta-grid { width: 100%; border-collapse: collapse; }
        .meta-grid td { padding: 4px 0; font-size: 12px; vertical-align: top; }
        .meta-label { color: #64748b; font-weight: 500; width: 32%; }
        .meta-val { color: #0f172a; font-weight: 700; }
        .section-header { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 7px 12px; border-radius: 4px 4px 0 0; }
        .earn-hdr { color: #065f46; background: #ecfdf5; border-bottom: 2px solid #a7f3d0; }
        .ded-hdr { color: #991b1b; background: #fef2f2; border-bottom: 2px solid #fecaca; }
        .item-table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-top: none; }
        .item-table tr:nth-child(even) { background-color: #fafafa; }
        .item-table td { padding: 7px 12px; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
        .item-table tr.total-row td { background: #f8fafc; font-weight: 700; border-top: 2px solid #cbd5e1; border-bottom: none; font-size: 13px; }
        .net-card { background: #0f172a; color: #ffffff; border-radius: 6px; padding: 18px 24px; text-align: center; margin-top: 20px; border-left: 5px solid #ea580c; }
        .net-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; margin: 0 0 4px 0; }
        .net-amount { font-size: 26px; font-weight: 800; margin: 0; color: #ffffff; font-family: monospace; }
        .net-words { font-size: 11px; color: #fb923c; margin-top: 4px; font-style: italic; }
        .pdf-notice { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 14px; margin-top: 18px; font-size: 12px; color: #1e40af; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <img src="${config.frontendUrl}/Logo.svg" alt="Terrific Travel" style="height: 48px; max-height: 48px; width: auto; max-width: 200px; display: block;" />
                <div class="company-name">${finalCompanyName}</div>
                <div class="company-sub">${finalCompanyAddress}</div>
                <div class="company-sub" style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">Phone: ${finalCompanyPhone} | Email: ${finalCompanyEmail}</div>
                <div class="doc-badge">Official Salary Slip &bull; ${monthYear}</div>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Reference Number</div>
                <div style="font-size: 14px; font-weight: 800; color: #ffffff; font-family: monospace; margin-top: 2px;">${payslipNumber}</div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">Pay Date: <strong style="color:#ffffff;">${formattedPayDate}</strong></div>
              </td>
            </tr>
          </table>
        </div>

        <div class="content">
          <!-- Employee Details Card -->
          <div class="meta-box">
            <table class="meta-grid">
              <tr>
                <td class="meta-label">Employee Name:</td>
                <td class="meta-val">${employeeName}</td>
                <td class="meta-label">Designation:</td>
                <td class="meta-val">${designation || 'Operations Manager'}</td>
              </tr>
              <tr>
                <td class="meta-label">Department:</td>
                <td class="meta-val">${department || 'Operations'}</td>
                <td class="meta-label">Pay Period:</td>
                <td class="meta-val">${monthYear}</td>
              </tr>
              <tr>
                <td class="meta-label">Payment Mode:</td>
                <td class="meta-val">${paymentMethod || 'Bank Transfer'}</td>
                <td class="meta-label">Currency:</td>
                <td class="meta-val">${params.currency || 'PKR'} (${currencySymbol})</td>
              </tr>
              <tr>
                <td class="meta-label">Payroll Email:</td>
                <td class="meta-val" colspan="3" style="font-family: monospace; font-size: 11px;">${toEmail}</td>
              </tr>
            </table>
          </div>

          <!-- Earnings Breakdown -->
          <div style="margin-bottom: 16px;">
            <div class="section-header earn-hdr">
              <span>Gross Earnings Breakdown</span>
            </div>
            <table class="item-table">
              <tr>
                <td style="color: #334155;">Basic Salary</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${formatAmt(basicSalary)}</td>
              </tr>
              ${houseRentAllowance > 0 ? `
              <tr>
                <td style="color: #334155;">House Rent Allowance (HRA)</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${formatAmt(houseRentAllowance)}</td>
              </tr>
              ` : ''}
              ${travelAllowance > 0 ? `
              <tr>
                <td style="color: #334155;">Travel / Commute Allowance</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${formatAmt(travelAllowance)}</td>
              </tr>
              ` : ''}
              ${otherAllowances > 0 ? `
              <tr>
                <td style="color: #334155;">Other Allowances / Bonus</td>
                <td style="text-align: right; font-weight: 600; color: #0f172a;">${formatAmt(otherAllowances)}</td>
              </tr>
              ` : ''}
              ${extraEarningsRows}
              <tr class="total-row">
                <td style="color: #0f172a;">Total Gross Earnings</td>
                <td style="text-align: right; color: #065f46;">${formatAmt(totalEarnings)}</td>
              </tr>
            </table>
          </div>

          <!-- Deductions Breakdown -->
          <div style="margin-bottom: 16px;">
            <div class="section-header ded-hdr">
              <span>Deductions Breakdown</span>
            </div>
            <table class="item-table">
              ${taxDeduction > 0 ? `
              <tr>
                <td style="color: #334155;">Income Tax (PAYE)</td>
                <td style="text-align: right; font-weight: 600; color: #b91c1c;">${formatAmt(taxDeduction)}</td>
              </tr>
              ` : ''}
              ${fineDeduction > 0 ? `
              <tr>
                <td style="color: #334155;">Fines & Penalties</td>
                <td style="text-align: right; font-weight: 600; color: #b91c1c;">${formatAmt(fineDeduction)}</td>
              </tr>
              ` : ''}
              ${otherDeductions > 0 ? `
              <tr>
                <td style="color: #334155;">Other Deductions</td>
                <td style="text-align: right; font-weight: 600; color: #b91c1c;">${formatAmt(otherDeductions)}</td>
              </tr>
              ` : ''}
              ${extraDeductionsRows}
              ${totalDeductions === 0 ? `
              <tr>
                <td style="color: #64748b; font-style: italic;">No deductions applied</td>
                <td style="text-align: right; font-weight: 600; color: #64748b;">${formatAmt(0)}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td style="color: #0f172a;">Total Deductions</td>
                <td style="text-align: right; color: #b91c1c;">${formatAmt(totalDeductions)}</td>
              </tr>
            </table>
          </div>

          <!-- Net Salary Box -->
          <div class="net-card">
            <div class="net-title">Net Take-Home Payable Amount (${monthYear})</div>
            <div class="net-amount">${formatAmt(netSalary)}</div>
          </div>

          ${pdfBase64 ? `
          <div class="pdf-notice">
            <strong>PDF Attachment Included:</strong> A formal PDF document of this salary slip is attached to this email for your official records.
          </div>
          ` : ''}

          ${notes ? `
          <div style="margin-top: 16px; background: #f8fafc; border-left: 3px solid #0f172a; padding: 10px 14px; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2px;">Remarks:</div>
            <div style="font-size: 12px; color: #334155;">${notes}</div>
          </div>
          ` : ''}

          <!-- Authorized Signature -->
          <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: table; width: 100%;">
            <div style="display: table-cell; vertical-align: bottom; font-size: 11px; color: #64748b;">
              Electronically verified payroll document
            </div>
            <div style="display: table-cell; text-align: right; vertical-align: bottom;">
              <div style="display: inline-block; min-width: 180px; border-bottom: 2px solid #0f172a; padding-bottom: 2px; margin-bottom: 4px; text-align: center;">
                <span style="font-family: 'Brush Script MT', 'Segoe Script', 'Great Vibes', cursive, serif; font-size: 22px; font-weight: bold; color: #0f172a; letter-spacing: 0.5px;">
                  Terrific Travel Ltd
                </span>
              </div>
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">Authorized Signatory</div>
              <div style="font-size: 9px; font-weight: 600; text-transform: uppercase; color: #64748b;">Terrific Travel HR Dept.</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 4px 0;">This is an electronically generated salary slip from Terrific Travel TMS. No signature is required.</p>
          <p style="margin: 0; font-weight: 600; color: #475569;">${finalCompanyName} &bull; Confidential Payroll Document</p>
        </div>
      </div>
    </body>
    </html>
    `;

    try {
      if (!toEmail || !toEmail.includes('@')) {
        return { success: false, reason: 'Invalid recipient email' };
      }

      const attachments: any[] = [];
      if (pdfBase64) {
        const cleanBase64 = pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64;
        attachments.push({
          filename: `Salary-Slip-${payslipNumber}.pdf`,
          content: Buffer.from(cleanBase64, 'base64'),
          contentType: 'application/pdf',
        });
      }

      await this.transporter.sendMail({
        from: `"${config.smtp.from.split('@')[0].replace('-', ' ')}" <${config.smtp.from}>`,
        to: toEmail,
        subject: `Salary Slip for ${monthYear} - Terrific Travel (${employeeName})`,
        html: htmlContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      logger.info(`Sent Salary Slip email for ${monthYear} to ${toEmail}${attachments.length > 0 ? ' (with PDF attachment)' : ''}`);
      return { success: true };
    } catch (error) {
      logger.error(`Failed to send salary slip email to ${toEmail}`, error);
      return { success: false, error };
    }
  }

  async sendTicketOrderEmail(params: {
    bookingRef: string;
    bookingDate?: Date | string | null;
    departureDate?: Date | string | null;
    agentName: string;
    agentEmail?: string | null;
    agentPhone?: string | null;
    agentDesignation?: string | null;
    totalAmount: number;
    paidAmount: number;
    amountLeft: number;
    paymentStatus: string;
    currencySymbol?: string;
    passengers: Array<{
      role?: string;
      title?: string;
      firstName?: string;
      lastName?: string;
      dateOfBirth?: Date | string | null;
      age?: string;
      nationality?: string | null;
      passportNumber?: string | null;
      passportExpiryDate?: Date | string | null;
      passportIssuingCountry?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
      eticket?: string | null;
    }>;
    flights: Array<{
      pnr?: string;
      flightNo?: string;
      departedFrom?: string;
      arrivedAt?: string;
      departTime?: string;
      arrivalTime?: string;
      date?: Date | string;
      flightClass?: string | null;
      baggage?: string | null;
      checkedBaggage?: string | null;
      carryOnBaggage?: string | null;
      personalItem?: string | null;
      vendorName?: string | null;
      status?: string | null;
    }>;
    customNotes?: string | null;
    pdfBase64?: string | null;
    passportAttachments?: Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }>;
    pnrScope?: string;
    targetPnr: string;
    gdsText?: string;
    actorDetails: {
      name: string;
      role: string;
      email?: string | null;
      phone?: string | null;
    };
    bookingAgentDetails: {
      name: string;
      designation?: string | null;
      email?: string | null;
      phone?: string | null;
    };
  }) {
    const {
      bookingRef,
      targetPnr,
      customNotes,
      pdfBase64,
      passportAttachments = [],
      actorDetails,
      bookingAgentDetails,
      passengers = [],
      flights = [],
    } = params;

    const fromAddress = `"Terrific Travel Ltd" <terrifictravelltd@gmail.com>`;
    const recipients = ['office@terrifictravel.co.uk', 'ticketing@terrifictravel.co.uk'];

    // Extract distinct PNRs
    const pnrsFromFlights = Array.from(
      new Set(
        (flights || [])
          .map((f: any) => String(f.pnr || '').trim().toUpperCase())
          .filter(Boolean)
      )
    );
    let activePnrs: string[] = [];
    if (targetPnr && targetPnr !== 'ALL' && targetPnr !== 'GROUP') {
      if (targetPnr.includes(',')) {
        activePnrs = targetPnr.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
      } else {
        activePnrs = [targetPnr.trim().toUpperCase()];
      }
    } else if (pnrsFromFlights.length > 0) {
      activePnrs = pnrsFromFlights;
    } else {
      activePnrs = [targetPnr ? targetPnr.trim().toUpperCase() : 'PENDING'];
    }

    const pnrHeaderLine = activePnrs.join('          '); // Multiple PNRs in the same line with 10 spaces
    const subjectPnr = activePnrs.join(', ');

    // Construct or format the GDS block
    let pnrBlock = (params.gdsText || '').trim();
    if (!pnrBlock) {
      const lines: string[] = [];
      lines.push(pnrHeaderLine);

      // Passenger lines
      const paxFormatted: string[] = [];
      (passengers || []).forEach((p: any, idx: number) => {
        const lastName = (p.lastName || '').trim().toUpperCase().replace(/\s+/g, '');
        const firstName = (p.firstName || '').trim().toUpperCase().replace(/\s+/g, '');
        const title = (p.title || '').trim().toUpperCase();
        const age = (p.age || '').trim().toUpperCase();
        const numPrefix = `${idx + 1}.1`;

        if (age.includes('INFANT') || p.role === 'Infant') {
          let dobStr = '';
          if (p.dateOfBirth) {
            try {
              const d = new Date(p.dateOfBirth);
              const day = String(d.getDate()).padStart(2, '0');
              const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              const yr = String(d.getFullYear()).slice(-2);
              dobStr = `*${day}${month}${yr}`;
            } catch {}
          }
          paxFormatted.push(`${idx + 1}.I/1${lastName}/${firstName} ${title || 'MSTR'}${dobStr}`);
        } else if (age.includes('CHILD') || p.role === 'Child') {
          const match = age.match(/\d+/);
          const childAge = match ? match[0].padStart(2, '0') : '';
          paxFormatted.push(`${numPrefix}${lastName}/${firstName} ${title || 'MSTR'}${childAge ? `*P-C${childAge}` : '*CHD'}`);
        } else {
          paxFormatted.push(`${numPrefix}${lastName}/${firstName} ${title || 'MR'}`);
        }
      });

      for (let i = 0; i < paxFormatted.length; i += 2) {
        if (i + 1 < paxFormatted.length) {
          lines.push(`${paxFormatted[i]} ${paxFormatted[i + 1]}`);
        } else {
          lines.push(paxFormatted[i]);
        }
      }

      // Flight lines
      const extractAirportCode = (str: string) => {
        if (!str) return 'XXX';
        const match = str.match(/\(([^)]+)\)/);
        if (match) return match[1].toUpperCase();
        const clean = str.trim().toUpperCase();
        return clean.length === 3 ? clean : clean.substring(0, 3);
      };

      const formatGdsDate = (d: any) => {
        if (!d) return 'TBA';
        try {
          const dateObj = new Date(d);
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          return `${day}${month}`;
        } catch {
          return 'TBA';
        }
      };

      const formatDayOfWeek = (d: any) => {
        if (!d) return '';
        try {
          const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
          return days[new Date(d).getDay()] || '';
        } catch {
          return '';
        }
      };

      const formatGdsTime = (timeStr?: string) => {
        if (!timeStr) return 'TBA';
        const raw = timeStr.trim().toUpperCase();
        const isPM = raw.includes('PM');
        const isAM = raw.includes('AM');
        const digits = raw.replace(/[^0-9]/g, '');
        if (digits.length === 4) {
          let hours = parseInt(digits.substring(0, 2), 10);
          const mins = digits.substring(2, 4);
          if (isPM && hours < 12) hours += 12;
          if (isAM && hours === 12) hours = 0;
          return `${String(hours).padStart(2, '0')}${mins}`;
        }
        if (digits.length === 3) {
          let hours = parseInt(digits.substring(0, 1), 10);
          const mins = digits.substring(1, 3);
          if (isPM && hours < 12) hours += 12;
          if (isAM && hours === 12) hours = 0;
          return `${String(hours).padStart(2, '0')}${mins}`;
        }
        return timeStr.replace(':', '').trim();
      };

      const paxCount = passengers.length || 1;
      flights.forEach((f: any, idx: number) => {
        const segNum = String(idx + 1).padStart(2, ' ');
        const flightNo = (f.flightNo || 'PC 1184').trim().toUpperCase();
        const flightClass = (f.flightClass || 'Y').trim().toUpperCase().charAt(0) || 'Y';
        const dateStr = formatGdsDate(f.date);
        const depCode = extractAirportCode(f.departedFrom || '');
        const arrCode = extractAirportCode(f.arrivedAt || '');
        const depTime = formatGdsTime(f.departTime);
        const arrTime = formatGdsTime(f.arrivalTime);
        const dow = formatDayOfWeek(f.date);
        lines.push(`${segNum} . ${flightNo.padEnd(8, ' ')} ${flightClass}  ${dateStr.padEnd(5, ' ')} ${depCode}${arrCode} HK${paxCount}  ${depTime.padEnd(5, ' ')} ${arrTime.padEnd(5, ' ')} O*      ${dow}`);
      });

      pnrBlock = lines.join('\n');
    }

    const subject = `Kindly issue the PNR: ${subjectPnr} Folder: ${bookingRef}`;

    const formatDateStr = (d?: Date | string | null) => {
      if (!d) return 'N/A';
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return 'N/A';
        const day = String(dt.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mon = months[dt.getMonth()];
        const year = dt.getFullYear();
        return `${day}-${mon}-${year}`;
      } catch {
        return 'N/A';
      }
    };

    const passportTextLines: string[] = [];
    if (passengers && passengers.length > 0) {
      passportTextLines.push('Passenger Passport Details:');
      passengers.forEach((p, idx) => {
        const fullName = `${(p.title || '').trim()} ${(p.firstName || '').trim()} ${(p.lastName || '').trim()}`.trim();
        const dob = formatDateStr(p.dateOfBirth);
        const exp = formatDateStr(p.passportExpiryDate);
        const passNo = p.passportNumber || 'N/A';
        const nat = p.nationality || 'N/A';
        const issue = p.passportIssuingCountry || nat || 'N/A';
        const type = p.age || 'Adult';
        passportTextLines.push(
          `${idx + 1}. ${fullName} (${type}) | DOB: ${dob} | Nat: ${nat} | Passport No: ${passNo} | Expiry: ${exp} | Issue: ${issue}`
        );
      });
      if (passportAttachments && passportAttachments.length > 0) {
        passportTextLines.push(`* Passenger passport scan files (${passportAttachments.length}) are attached directly to this email.`);
      }
    }

    const passportHtmlRows = (passengers || []).map((p, idx) => {
      const fullName = `${(p.title || '').trim()} ${(p.firstName || '').trim()} ${(p.lastName || '').trim()}`.trim();
      const dob = formatDateStr(p.dateOfBirth);
      const exp = formatDateStr(p.passportExpiryDate);
      const passNo = p.passportNumber || 'N/A';
      const nat = p.nationality || 'N/A';
      const issue = p.passportIssuingCountry || nat || 'N/A';
      const type = p.age || 'Adult';

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #64748b;">${idx + 1}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; font-weight: 700; color: #0f172a;">${fullName}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; color: #475569;">${type}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; color: #334155;">${dob}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; color: #334155;">${nat}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; font-family: monospace; font-weight: 700; color: #0369a1;">${passNo}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; color: #334155;">${exp}</td>
          <td style="padding: 7px 9px; border: 1px solid #e5e7eb; color: #334155;">${issue}</td>
        </tr>
      `;
    }).join('');

    const actor = actorDetails || { name: 'Faisal Chughtai', role: 'Admin' };
    const owner = bookingAgentDetails;
    const isDifferentAgent = owner && owner.name && owner.name.trim().toLowerCase() !== actor.name.trim().toLowerCase();

    // Prepare company logo buffer from embedded asset (guaranteed to be present in all environments)
    const logoBuffer = Buffer.from(TERRIFIC_LOGO_BASE64, 'base64');

    const plainText = [
      'Dear Team,',
      '',
      'Kindly issue the below PNR:',
      '',
      pnrBlock,
      '',
      ...(passportTextLines.length > 0 ? [...passportTextLines, ''] : []),
      ...(customNotes ? ['Special Instructions / Notes:', customNotes, ''] : []),
      'Kind Regards,',
      `${actor.name} (${actor.role})`,
      ...(actor.email ? [`Email: ${actor.email}${actor.phone ? ` | Phone: ${actor.phone}` : ''}`] : []),
      ...(isDifferentAgent ? [
        '',
        `Booking Owner Agent: ${owner.name}${owner.designation ? ` (${owner.designation})` : ''}`,
        ...(owner.email ? [`Email: ${owner.email}${owner.phone ? ` | Phone: ${owner.phone}` : ''}`] : []),
      ] : []),
      '',
      '----------------------------------------',
      'Terrific Travel Ltd (ATOL Protected)',
      'Direct: 01215 291 670 | Office: office@terrifictravel.co.uk',
      'Web: https://terrifictravel.co.uk',
      'Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, United Kingdom',
      '----------------------------------------',
      'CONFIDENTIALITY NOTICE: This email and any attachments are confidential and intended solely for the use of the recipient.',
    ].join('\n');

    // Split pnrBlock lines and wrap with explicit <br/> inside <pre> for bulletproof Outlook Desktop rendering
    const formattedPnrHtml = pnrBlock
      .split('\n')
      .map((line) => (line ? line.replace(/ /g, '&nbsp;') : '&nbsp;'))
      .join('<br/>');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Calibri, 'Segoe UI', Aptos, Arial, sans-serif; font-size: 14.5px; color: #111827; line-height: 1.5; background-color: #ffffff; margin: 0; padding: 24px;">
  <p style="margin: 0 0 16px 0; font-size: 15px;">Dear Team,</p>
  <p style="margin: 0 0 16px 0; font-size: 15px;">Kindly issue the below PNR:</p>

  <div style="background-color: #fbfbfb; border: 1px solid #e5e7eb; border-left: 4px solid #0284c7; padding: 14px 18px; margin: 18px 0;">
    <pre style="font-family: 'Consolas', 'Courier New', Courier, monospace; font-size: 13.5px; line-height: 1.5; color: #000000; font-weight: 500; letter-spacing: 0.3px; margin: 0; white-space: pre-wrap; word-break: break-word;">${formattedPnrHtml}</pre>
  </div>

  ${(passengers && passengers.length > 0) ? `
  <div style="margin: 22px 0 16px 0;">
    <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
      Passenger Passport Details:
    </div>
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #e2e8f0;">
      <thead>
        <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px;">
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0; width: 28px; text-align: center;">#</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Passenger Name</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Type</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Date of Birth</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Nationality</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Passport Number</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Expiry Date</th>
          <th style="padding: 7px 9px; border: 1px solid #e2e8f0;">Country of Issue</th>
        </tr>
      </thead>
      <tbody>
        ${passportHtmlRows}
      </tbody>
    </table>
    ${passportAttachments && passportAttachments.length > 0 ? `
    <div style="font-size: 11px; color: #059669; font-weight: 600; margin-top: 6px;">
      &bull; Passenger passport scan copies (${passportAttachments.length}) are attached directly to this email.
    </div>
    ` : ''}
  </div>
  ` : ''}

  ${customNotes ? `
  <div style="margin: 18px 0; padding: 12px 16px; background-color: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; font-size: 13.5px; color: #78350f;">
    <strong style="color: #92400e; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Special Instructions / Notes:</strong>
    ${customNotes.replace(/\n/g, '<br/>')}
  </div>
  ` : ''}

  <!-- Professional Corporate Signature with Company Logo -->
  <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; border-top: 2px solid #ea580c; padding-top: 18px; font-family: Calibri, 'Segoe UI', Aptos, Arial, sans-serif; width: 100%; max-width: 680px;">
    <tr>
      <td style="vertical-align: middle; width: 180px; padding-right: 22px; border-right: 2px solid #fed7aa; text-align: center;">
        <img src="cid:company_logo" alt="Terrific Travel" width="155" height="100" style="display: block; width: 155px; max-width: 155px; height: 100px; margin: 0 auto 12px auto; border: 0; outline: none; text-decoration: none;" />
        <div style="display: inline-block; padding: 4px 10px; background-color: #fff7ed; border: 1px solid #fdba74; border-radius: 4px; font-size: 10px; font-weight: 800; color: #ea580c; letter-spacing: 0.8px; text-transform: uppercase;">
          ATOL PROTECTED
        </div>
        <div style="font-size: 9.5px; color: #64748b; margin-top: 5px; font-weight: 600;">
          Certified Agency
        </div>
      </td>
      <td style="vertical-align: top; padding-left: 22px;">
        <div style="font-size: 12.5px; color: #64748b; margin-bottom: 4px;">Kind Regards,</div>
        <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
          ${actor.name} <span style="font-size: 13px; font-weight: 600; color: #ea580c;">| ${actor.role}</span>
        </div>
        ${actor.email ? `
        <div style="font-size: 12.5px; color: #334155; margin-bottom: 3px;">
          <strong style="color: #475569;">Email:</strong> <a href="mailto:${actor.email}" style="color: #0284c7; text-decoration: none;">${actor.email}</a>
          ${actor.phone ? ` &bull; <strong style="color: #475569;">Phone:</strong> ${actor.phone}` : ''}
        </div>` : ''}

        ${isDifferentAgent ? `
        <div style="margin: 8px 0; padding: 8px 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #ea580c; border-radius: 4px; font-size: 12px; color: #475569;">
          <strong style="color: #1e293b;">Booking Owner Agent:</strong> ${owner.name}${owner.designation ? ` (${owner.designation})` : ''}
          ${owner.email ? `<br/><strong style="color: #475569;">Email:</strong> <a href="mailto:${owner.email}" style="color: #0284c7; text-decoration: none;">${owner.email}</a>` : ''}
          ${owner.phone ? ` &bull; <strong style="color: #475569;">Phone:</strong> ${owner.phone}` : ''}
        </div>` : ''}

        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; font-size: 12px; line-height: 1.55; color: #475569;">
          <div style="font-weight: 800; color: #0f172a; font-size: 13px; margin-bottom: 2px;">
            Terrific Travel Ltd
          </div>
          <div><strong style="color: #334155;">Direct:</strong> 01215 291 670 &bull; <strong style="color: #334155;">Office:</strong> <a href="mailto:office@terrifictravel.co.uk" style="color: #0284c7; text-decoration: none;">office@terrifictravel.co.uk</a></div>
          <div><strong style="color: #334155;">Web:</strong> <a href="https://terrifictravel.co.uk" target="_blank" style="color: #ea580c; text-decoration: none; font-weight: 600;">www.terrifictravel.co.uk</a></div>
          <div><strong style="color: #334155;">Office:</strong> Office 1, 11 Walford Road, Birmingham, B11 1NP, United Kingdom</div>
        </div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding-top: 14px; font-size: 10px; color: #94a3b8; line-height: 1.4; border-top: 1px dashed #e2e8f0; margin-top: 12px;">
        CONFIDENTIALITY NOTICE: This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this communication in error, please notify the sender immediately and delete the original message. Terrific Travel Ltd is registered in England and Wales.
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const attachments: any[] = [];
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64;
      attachments.push({
        filename: `Ticket-Order-${bookingRef}.pdf`,
        content: Buffer.from(cleanBase64, 'base64'),
        contentType: 'application/pdf',
      });
    }

    // Attach company logo for inline display in Outlook and Webmail
    attachments.push({
      filename: 'terrific_logo_full.png',
      content: logoBuffer,
      cid: 'company_logo',
      contentType: 'image/png',
      contentDisposition: 'inline',
      headers: {
        'Content-ID': '<company_logo>',
        'X-Attachment-Id': 'company_logo',
      },
    });

    // Attach all passenger passport scans
    if (passportAttachments && passportAttachments.length > 0) {
      for (const pa of passportAttachments) {
        attachments.push({
          filename: pa.filename,
          content: pa.content,
          contentType: pa.contentType || 'image/jpeg',
        });
      }
    }

    try {
      await this.transporter.sendMail({
        from: fromAddress,
        to: recipients,
        replyTo: actor.email ? `${actor.email}, terrifictravelltd@gmail.com` : 'terrifictravelltd@gmail.com',
        subject,
        text: plainText,
        html: htmlContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      logger.info(`Successfully sent Ticket Order email for booking ${bookingRef} (PNR: ${subjectPnr}) to ${recipients.join(', ')}`);
      return { success: true, recipients, subject };
    } catch (error) {
      logger.error(`Failed to send ticket order email for booking ${bookingRef}`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();


