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
}

export const emailService = new EmailService();
