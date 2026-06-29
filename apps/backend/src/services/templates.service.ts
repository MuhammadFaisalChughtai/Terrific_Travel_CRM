import { prisma } from "../config";
import { NotFoundException } from "../middleware/error.middleware";

// ──────────────────────────────────────────────────────────────────────────
// Default HTML shells for each template type.
// These are stored in DB on first request and act as the fallback if the
// admin has not yet made any custom edits.
// Each shell uses {{TOKEN}} placeholders for dynamic booking data — these
// are replaced client-side by the TypeScript renderer functions in
// invoiceTemplates.ts before printing.
// ──────────────────────────────────────────────────────────────────────────

const BRAND_LOGOS = {
  companyLogo: `
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  `,
  iataLogo: `
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="'Arial Black', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  `,
  atolLogo: `
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#D97706"/>
      <circle cx="32" cy="20" r="15" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M22 17L32 12L42 17L32 28L22 17Z" fill="#FFFFFF" opacity="0.2"/>
      <text x="32" y="19" font-family="'Arial Black', sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">ATOL</text>
      <text x="32" y="28" font-family="Arial, sans-serif" font-weight="bold" font-size="6" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PROTECTED</text>
      <text x="32" y="35" font-family="Arial, sans-serif" font-size="4" fill="#FFFFFF" text-anchor="middle" opacity="0.8">REG. NO 11492</text>
    </svg>
  `,
};

const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  
  @media print {
    body {
      background: #FFFFFF !important;
      color: #000000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
  }

  * { box-sizing: border-box; }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1E293B;
    background: #F8FAFC;
    margin: 0;
    padding: 20px;
    font-size: 11px;
    line-height: 1.5;
  }

  .document-container {
    max-width: 800px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  /* Header grid */
  .doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #F1F5F9;
    padding-bottom: 20px;
    margin-bottom: 24px;
  }

  .brand-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .logos-block {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* Title & Reference */
  .doc-title-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .doc-title {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 900;
    color: #0F172A;
    text-transform: uppercase;
    margin: 0;
  }

  .doc-meta {
    text-align: right;
  }

  .doc-meta p {
    margin: 2px 0;
    color: #475569;
  }

  .doc-meta strong {
    color: #0F172A;
  }

  /* Customer/Vendor Blocks */
  .info-grid {
    display: grid;
    grid-template-cols: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
    background: #F8FAFC;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #F1F5F9;
  }

  .info-box h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    color: #0EA5E9;
    margin-top: 0;
    margin-bottom: 8px;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .info-box p {
    margin: 3px 0;
    color: #334155;
  }

  /* Detail Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  table.data-table th {
    background: #0F172A;
    color: #FFFFFF;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    letter-spacing: 0.5px;
    padding: 8px 12px;
    text-align: left;
    border: 1px solid #0F172A;
  }

  table.data-table td {
    padding: 8px 12px;
    border: 1px solid #E2E8F0;
    vertical-align: top;
  }

  table.data-table tr:nth-child(even) {
    background: #F8FAFC;
  }

  .text-right { text-align: right !important; }
  .text-center { text-align: center !important; }

  /* Financial Breakdown Panel */
  .financial-panel {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 24px;
  }

  .financial-table {
    width: 300px;
    border-collapse: collapse;
  }

  .financial-table td {
    padding: 6px 12px;
    border-bottom: 1px solid #E2E8F0;
  }

  .financial-table tr.total-row td {
    font-size: 13px;
    font-weight: 700;
    color: #0F172A;
    border-bottom: 2px double #0F172A;
    background: #F8FAFC;
  }

  .financial-table tr.due-row td {
    font-size: 14px;
    font-weight: 900;
    color: #E11D48;
    background: #FFF1F2;
    border: 1px solid #FFE4E6;
  }

  /* Footer Details */
  .doc-footer {
    border-top: 2px dashed #E2E8F0;
    padding-top: 20px;
    margin-top: 30px;
    text-align: center;
    color: #64748B;
    font-size: 9px;
  }

  .doc-footer p {
    margin: 4px 0;
  }

  /* Section Title badge style */
  .section-badge {
    display: inline-block;
    padding: 2px 6px;
    background: #E0F2FE;
    color: #0369A1;
    font-weight: 700;
    border-radius: 4px;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
  }

  /* E-ticket / Voucher Specifics */
  .ticket-card {
    border: 1.5px solid #0F172A;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  /* Timeline component styles */
  .timeline-container {
    position: relative;
    padding-left: 28px;
    margin: 20px 0 20px 8px;
    border-left: 2px solid #E2E8F0;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 20px;
  }
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  .timeline-badge {
    position: absolute;
    left: -40px;
    top: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #FFFFFF;
    border: 2px solid #64748B;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 10;
  }
  .timeline-badge.flight { border-color: #0284C7; color: #0284C7; }
  .timeline-badge.hotel { border-color: #10B981; color: #10B981; }
  .timeline-badge.transfer { border-color: #F59E0B; color: #F59E0B; }
  .timeline-badge.visa { border-color: #8B5CF6; color: #8B5CF6; }
  .timeline-badge.special { border-color: #EC4899; color: #EC4899; }
  
  .timeline-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: left;
  }
  .timeline-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    border-bottom: 1px dashed #E2E8F0;
    padding-bottom: 6px;
  }
  .timeline-title {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #0F172A;
  }
  .timeline-date {
    font-size: 9.5px;
    color: #64748B;
    font-weight: 600;
  }
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
    font-size: 10px;
  }
  .timeline-detail-item {
    color: #475569;
  }
  .timeline-detail-item strong {
    color: #0F172A;
  }
  .timeline-badge-status {
    font-size: 8px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 99px;
    text-transform: uppercase;
  }
  .timeline-badge-status.confirmed { background: #DCFCE7; color: #15803D; }
  .timeline-badge-status.pending { background: #FEF3C7; color: #D97706; }
  .timeline-badge-status.cancelled { background: #FEE2E2; color: #991B1B; }

  /* Terms Grid styling */
  .terms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 24px;
    font-size: 8.5px;
    color: #64748B;
    text-align: left;
  }
  .terms-card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 12px;
  }
  .terms-card h4 {
    margin: 0 0 6px 0;
    color: #0F172A;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .terms-card p {
    margin: 0;
    line-height: 1.4;
  }
`;

export const TEMPLATE_DEFAULTS: Record<
  string,
  { name: string; description: string; html: string }
> = {
  BOOKING_INVOICE: {
    name: "Booking Invoice",
    description:
      "Full client-facing booking invoice with passenger list, itemized services and financial totals.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Booking Invoice Template</title>
<style>
${SHARED_CSS}
/* ── Extra Template-Specific Styles ── */
.doc-title { font-size: 22px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px; }
.doc-meta p { margin: 2px 0; font-size: 10px; text-align: right; }
.doc-meta strong { font-weight: 700; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.info-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; }
.info-box h3 { font-size: 10px; font-weight: 800; color: #0EA5E9; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px; }
.info-box p { margin: 3px 0; font-size: 10.5px; }
.section-badge { display: inline-block; font-size: 9px; font-weight: 800; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; }
.doc-title-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
table { width: 100%; border-collapse: collapse; font-size: 10px; }
thead tr { background: #1E293B; color: #fff; }
th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }
td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
tbody tr:nth-child(even) { background: #F8FAFC; }
.total-row td { font-weight: 800; background: #EFF6FF; }
.grand-total td { font-weight: 900; font-size: 12px; background: #DBEAFE; color: #1D4ED8; }
.footer-bar { margin-top: 28px; padding-top: 14px; border-top: 2px solid #F1F5F9; font-size: 9px; color: #94A3B8; text-align: center; }
.logos-block { display: flex; gap: 8px; align-items: flex-start; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        IATA: 91206076  
      </p>
    </div>
    <div style="display: flex; align-items: center; height: 60px;">
      <div class="logos-block">
        ${BRAND_LOGOS.iataLogo}
        ${BRAND_LOGOS.atolLogo}
      </div>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Booking Invoice</h1>
      <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: {{PAYMENT_STATUS}}</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p>
      <p>Date: <strong>{{TODAY}}</strong></p>
      <p>Booking Ref: <strong>{{BOOKING_REF}}</strong></p>
      <p>Departure Date: <strong>{{DEPARTURE_DATE}}</strong></p>
    </div>
  </div>

  <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
    <div class="info-box">
      <h3>Lead Passenger / Client</h3>
      {{LEAD_PASSENGER_BLOCK}}
    </div>
    <div class="info-box">
      <h3>Agent / Account Executive</h3>
      {{AGENT_BLOCK}}
    </div>
  </div>

  <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Booking Passenger List</h3>
  <table class="data-table" style="margin-bottom: 24px;">
    <thead>
      <tr>
        <th>Passenger Name</th>
        <th>Type/Age</th>
        <th>Nationality</th>
      </tr>
    </thead>
    <tbody>
      {{PASSENGERS_TABLE_ROWS}}
    </tbody>
  </table>

  <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 16px;">Dynamic Trip Itinerary &amp; Timeline</h3>
  {{SERVICES_TIMELINE}}

  <div class="financial-panel">
    <table class="financial-table">
      <tr><td>Total Invoice Amount:</td><td class="text-right"><strong>{{TOTAL_PRICE}}</strong></td></tr>
      <tr><td>Total Amount Received:</td><td class="text-right" style="color: #16A34A; font-weight: bold;">{{PAID_AMOUNT}}</td></tr>
      <tr class="due-row"><td><strong>Remaining Balance Due:</strong></td><td class="text-right"><strong>{{BALANCE_DUE}}</strong></td></tr>
    </table>
  </div>

  <div class="terms-grid">
    <div class="terms-card">
      <h4>💼 General Booking Terms</h4>
      <p>All bookings are subject to availability at the time of reservation. The client must ensure that all passenger names match their passport details exactly. Terrific Travel acts as an agent for respective service providers.</p>
    </div>
    <div class="terms-card">
      <h4>💳 Payment Terms</h4>
      <p>Deposits must be paid immediately to secure reservations. Final balances are due in full no later than 7 days prior to departure. Failure to complete payment may result in automated release of GDS bookings.</p>
    </div>
    <div class="terms-card">
      <h4>⚠️ Cancellation Policy</h4>
      <p>Cancellations must be requested in writing. All deposits are non-refundable. Additional airline, hotel, or GDS cancellation charges apply dynamically depending on supplier terms and time remaining before travel.</p>
    </div>
    <div class="terms-card">
      <h4>✈️ Flight Conditions</h4>
      <p>Flight times and schedules are subject to change by airlines. Baggage allowances are subject to carrier rules. Passengers should check in online 24 hours prior to departure and arrive at terminals 3 hours early.</p>
    </div>
    <div class="terms-card">
      <h4>🏨 Hotel Conditions</h4>
      <p>Hotel ratings are based on local standards. Check-in/check-out times must be respected. Special requests (bed type, high floors, views) are subject to availability and cannot be guaranteed by Terrific Travel.</p>
    </div>
    <div class="terms-card">
      <h4>🛂 Visa Conditions</h4>
      <p>It is the sole responsibility of the customer to obtain valid visa clearances. Visa approval remains at the absolute discretion of border authorities and national consulates. Visa fees are strictly non-refundable.</p>
    </div>
    <div class="terms-card">
      <h4>🚗 Transportation Conditions</h4>
      <p>Transfers are scheduled according to booking details. Drivers will wait up to 60 minutes after flight arrival. Customers must contact the emergency helpline immediately if they cannot locate their driver.</p>
    </div>
    <div class="terms-card">
      <h4>🕋 Hajj &amp; Umrah Conditions</h4>
      <p>Pilgrimage packages are subject to Saudi Ministry of Hajj &amp; Umrah regulations. E-visas and transportation booking are fully subject to local rules. Accommodation and transportation upgrades are subject to availability.</p>
    </div>
    <div class="terms-card">
      <h4>ℹ️ Important Travel Information</h4>
      <p>Flight bookings are protected under the UK Civil Aviation Authority ATOL scheme (Reg 11492) and fully backed by our IATA credentials. Travel insurance is highly recommended for all overseas bookings.</p>
    </div>
    <div class="terms-card">
      <h4>⚖️ Disclaimer</h4>
      <p>Terrific Travel acts as an intermediary agent and shall not be held liable for personal injury, property loss, delays, cancellations, or defaults caused by airlines, hotels, or other service providers.</p>
    </div>
  </div>

  <div class="doc-footer">
    <p>Terrific Travel &amp; Tours Ltd | Registered in England &amp; Wales: #09384812 | VAT Number: GB 129 3847 21</p>
    <p>Thank you for choosing Terrific Travel. We wish you an amazing journey!</p>
  </div>
</div>
</body>
</html>`,
  },

  FLIGHT_TICKET: {
    name: "Flight Ticket",
    description:
      "E-ticket itinerary with route, PNR, baggage and passenger details — one ticket per passenger.",
    html: "{{FLIGHT_TICKET_PAGES}}",
  },

  HOTEL_VOUCHER: {
    name: "Hotel Voucher",
    description:
      "Hotel accommodation voucher with check-in/out, room type, and guest list.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Hotel Voucher Template</title>
<style>
${SHARED_CSS}
.voucher-header { background: linear-gradient(135deg, #0F172A, #1E3A5F); color: white; border-radius: 12px 12px 0 0; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
.voucher-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
.hotel-name { font-size: 20px; font-weight: 900; margin: 0 0 4px; }
.badge { display: inline-block; font-size: 8px; font-weight: 800; padding: 3px 10px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(255,255,255,0.15); color: white; }
.checkin-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; margin: 16px 0; text-align: center; }
.date-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; }
.date-label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.date-value { font-size: 16px; font-weight: 900; color: #0F172A; }
.nights-badge { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0EA5E9; color: white; border-radius: 50%; width: 48px; height: 48px; font-weight: 900; font-size: 18px; margin: auto; }
.nights-label { font-size: 8px; font-weight: 700; margin-top: -2px; }
.info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.info-cell { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; }
.info-cell label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px; }
.info-cell span { font-size: 12px; font-weight: 700; color: #0F172A; }
.passenger-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 10px; }
.passenger-table th { background: #1E293B; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
.passenger-table td { padding: 7px 10px; border-bottom: 1px solid #F1F5F9; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        IATA: 91263712
      </p>
    </div>
    <div style="display: flex; align-items: center; height: 60px;">
      <div class="logos-block">
        ${BRAND_LOGOS.iataLogo}
        ${BRAND_LOGOS.atolLogo}
      </div>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Hotel Booking Voucher</h1>
      <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Confirmed</span>
    </div>
    <div class="doc-meta">
      <p>Voucher No: <strong>{{VOUCHER_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
      <p>Hotel Confirmation #: <strong style="font-size: 12px; color: #10B981;">{{HOTEL_CONFIRMATION_NO}}</strong></p>
      <p>Reservation Code: <strong>{{GDS_CODE}}</strong></p>
    </div>
  </div>

  <div class="voucher-body" style="border:none; padding:0;">
    <div class="checkin-row">
      {{HOTEL_STAY_ROW}}
    </div>

    <div class="info-row">
      <div class="info-cell"><label>Hotel Confirmation #</label><span>{{HOTEL_CONFIRMATION_NO}}</span></div>
      <div class="info-cell"><label>Reservation Code</label><span>{{GDS_CODE}}</span></div>
      <div class="info-cell"><label>Guest / Lead Client Details</label><span>{{LEAD_PASSENGER_BLOCK}}</span></div>
      <div class="info-cell"><label>Total Guests</label><span>{{TOTAL_GUESTS}} Guest(s)</span></div>
      <div class="info-cell" style="grid-column: span 2;">
        <label>Property &amp; Vendor Information</label>
        <span>City/Region: {{HOTEL_CITY}}<br>Address: {{HOTEL_ADDRESS}}</span>
        <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 8px 0;" />
        <label>Fulfillment Vendor</label>
        <span><strong>{{VENDOR_NAME}}</strong><br>Phone: {{VENDOR_PHONE}}<br>Email: {{VENDOR_EMAIL}}</span>
      </div>
    </div>

    <h3 style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 6px;">Guest List</h3>
    <table class="passenger-table">
      <thead><tr><th>No.</th><th>Guest Name</th><th>Age Category</th><th>Nationality</th></tr></thead>
      <tbody>
        {{GUESTS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px; margin-top: 16px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Check-In Information</p>
      <p style="margin: 0;">1. Present this printable voucher at the hotel reception desk along with a valid photo ID of all adult guests for verification.</p>
      <p style="margin: 0;">2. A security deposit via credit card or cash may be requested by the hotel reception at check-in for incidental charges.</p>
      <p style="margin: 0;">3. Early check-in and late check-out requests are subject to availability and hotel convenience.</p>
      <p style="margin: 0;">4. Cancellation and modifications are strictly governed by hotel policies. Pre-paid booking voucher cannot be refunded directly.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · office@terrifictravel.co.uk<br>
      Please present this voucher at check-in. All special requests are subject to availability.
    </div>
  </div>
</div>
</body>
</html>`,
  },

  TRANSPORT_VOUCHER: {
    name: "Transfer Voucher",
    description:
      "Ground transport voucher with route, pickup time, vehicle and driver details.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Transport Voucher Template</title>
<style>
${SHARED_CSS}
.transport-header { background: linear-gradient(135deg, #064E3B, #065F46); color: white; border-radius: 12px 12px 0 0; padding: 20px 24px; }
.transport-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
.route-visual { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.route-point { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 16px; }
.route-point label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px; }
.route-point span { font-size: 13px; font-weight: 800; color: #0F172A; }
.route-arrow { font-size: 20px; color: #10B981; font-weight: 900; flex-shrink: 0; }
.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
.detail-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; }
.detail-box label { font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px; }
.detail-box span { font-size: 12px; font-weight: 700; }
.passenger-table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 10px; }
.passenger-table th { background: #064E3B; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; }
.passenger-table td { padding: 7px 10px; border-bottom: 1px solid #F1F5F9; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        IATA: 91263712  
      </p>
    </div>
    <div style="display: flex; align-items: center; height: 60px;">
      <div class="logos-block">
        ${BRAND_LOGOS.iataLogo}
        ${BRAND_LOGOS.atolLogo}
      </div>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Transfer Voucher</h1>
      <span class="section-badge" style="background: #FEF3C7; color: #D97706;">Service: Scheduled</span>
    </div>
    <div class="doc-meta">
      <p>Voucher No: <strong>{{VOUCHER_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="transport-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Booking Summary</h3>
        <p>Total Scheduled Transfers: <strong>{{TOTAL_TRANSFERS}} Leg(s)</strong></p>
        <p>Ground Status: <strong>Confirmed &amp; Secured</strong></p>
      </div>
      <div class="info-box">
        <h3>Fulfillment Vendor Details</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Route &amp; Service Details</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Date &amp; Time</th>
          <th>Pick-up Location</th>
          <th>Drop-off Destination</th>
          <th>Vehicle &amp; Transfer Details</th>
        </tr>
      </thead>
      <tbody>
        {{TRANSFERS_TABLE_ROWS}}
      </tbody>
    </table>


    <div class="info-box" style="font-size: 9.5px; line-height: 1.6; color: #1E293B; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 6px 0; font-weight: 900; color: #0F172A; font-size: 10px;">NOTE:</p>
      <p style="margin: 0;">1. Please print a copy of this Voucher &amp; carry with you throughout your Journey.</p>
      <p style="margin: 0;">2. Please send the copy of this Voucher to {{VENDOR_NAME}} Transport contact no within 24 hours before departure for further confirmation.</p>
      <p style="margin: 0;">3. On arrival at Makkah / Madinah Airport, immediately contact to {{VENDOR_NAME}} Transport at given contact details.</p>
      <p style="margin: 0;">4. If you will not reach to Vehicle/Transport on time, it will cost you more for extra waiting time. Company will not be responsible for anything.</p>
      <p style="margin: 0;">5. Please coordinate with Driver or {{VENDOR_NAME}} Transport one day before, for your Pick-Up time.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd | Ground Operations and VIP Client Transfers<br>
      We wish you a pleasant and comfortable ride!
    </div>
  </div>
</div>
</body>
</html>`,
  },

  VISA_INVOICE: {
    name: "Visa Services Invoice",
    description:
      "Per-passenger visa processing invoice with consular details and fees.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Visa Invoice Template</title>
<style>
${SHARED_CSS}
.visa-header { background: linear-gradient(135deg, #4C1D95, #5B21B6); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; }
.visa-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 14px; }
thead tr { background: #4C1D95; color: white; }
th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
tbody tr:nth-child(even) { background: #F8FAFC; }
.total-row td { font-weight: 800; background: #EDE9FE; color: #5B21B6; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        IATA: 91263712  
      </p>
    </div>
    <div style="display: flex; align-items: center; height: 60px;">
      <div class="logos-block">
        ${BRAND_LOGOS.iataLogo}
        ${BRAND_LOGOS.atolLogo}
      </div>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Visa Services Invoice</h1>
      <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Completed</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p>
      <p>Issue Date: <strong>{{ISSUE_DATE}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="visa-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Applicant / Client Info</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Services Desk</h3>
        <p><strong>Terrific Travel Visas &amp; Consular Services</strong></p>
        <p>Consular Desk Support</p>
        <p>Total Visa Applications: <strong>{{TOTAL_VISAS}}</strong></p>
      </div>
      <div class="info-box">
        <h3>Consular Fulfillment Vendor</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Consular &amp; Processing Services Summary</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Consular Visa Category</th>
          <th>Issue Date</th>
          <th class="text-right">Visa Fee</th>
        </tr>
      </thead>
      <tbody>
        {{VISAS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Visa Charges:</strong></td>
          <td class="text-right"><strong>{{TOTAL_VISA_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Visa Consular Notice</p>
      <p style="margin: 0;">1. Travelers must verify that all details on their visa match their passport data precisely. Inform consular desk of errors immediately.</p>
      <p style="margin: 0;">2. Possession of a valid visa does not guarantee entry into sovereign territory. Final decision remains with border authorities.</p>
      <p style="margin: 0;">3. Visa fees are completely non-refundable once the application is registered with consulate departments.</p>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · office@terrifictravel.co.uk
    </div>
  </div>
</div>
</body>
</html>`,
  },

  SPECIAL_SERVICES: {
    name: "Special Services Invoice",
    description:
      "Invoice for additional/ancillary services like extra baggage, meals, and special requests.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Special Services Invoice Template</title>
<style>
\${SHARED_CSS}
.special-header { background: linear-gradient(135deg, #7C2D12, #9A3412); color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; }
.special-body { border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px; }
table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 14px; }
thead tr { background: #7C2D12; color: white; }
th { padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; }
tbody tr:nth-child(even) { background: #FFF7F0; }
.total-row td { font-weight: 800; background: #FEE2E2; color: #991B1B; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container">
  <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
        <strong>Terrific Travel &amp; Tours Ltd</strong><br>
        Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
        Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
        Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
        IATA: 91263712  
      </p>
    </div>
    <div style="display: flex; align-items: center; height: 60px;">
      <div class="logos-block">
        ${BRAND_LOGOS.iataLogo}
        ${BRAND_LOGOS.atolLogo}
      </div>
    </div>
  </div>

  <div class="doc-title-section">
    <div>
      <h1 class="doc-title">Special Service Invoice</h1>
      <span class="section-badge" style="background: #FCE7F3; color: #BE185D;">Status: Confirmed</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>{{INVOICE_NO}}</strong></p>
      <p>Date: <strong>{{TODAY}}</strong></p>
      <p>Booking Reference: <strong>{{BOOKING_REF}}</strong></p>
    </div>
  </div>

  <div class="special-body" style="border:none; padding:0;">
    <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Fulfillment Details</h3>
        <p>Special Service Type: Additional / Custom Element</p>
        <p>Total Items: <strong>{{TOTAL_SERVICES}}</strong></p>
      </div>
      <div class="info-box">
        <h3>Fulfillment Vendor Details</h3>
        <p><strong>Vendor Name:</strong> {{VENDOR_NAME}}</p>
        <p><strong>Phone:</strong> {{VENDOR_PHONE}}</p>
        <p><strong>Email:</strong> {{VENDOR_EMAIL}}</p>
      </div>
    </div>

    <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Special Request &amp; Service Details</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Service Name</th>
          <th>Fulfillment Vendor</th>
          <th>Service Description</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {{SERVICES_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Special Service Price:</strong></td>
          <td class="text-right"><strong>{{TOTAL_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · office@terrifictravel.co.uk<br>
      All special service requests are subject to vendor availability and confirmation.
    </div>
  </div>
</div>
</body>
</html>`,
  },
};

export class TemplatesService {
  /**
   * Get all document templates. Auto-seeds defaults if none exist in DB.
   */
  async findAll() {
    const count = await prisma.documentTemplate.count();
    if (count === 0) {
      await this.seedDefaults();
    }
    return prisma.documentTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Get a single template by type. Auto-seeds defaults if not found.
   */
  async findByType(templateType: string) {
    let template = await prisma.documentTemplate.findUnique({
      where: { templateType },
    });
    if (!template) {
      // Seed this specific template if it's a known default
      const def = TEMPLATE_DEFAULTS[templateType];
      if (!def)
        throw new NotFoundException(
          `Template type "${templateType}" not found`,
        );
      template = await prisma.documentTemplate.create({
        data: {
          templateType,
          name: def.name,
          description: def.description,
          htmlContent: def.html,
        },
      });
    }
    return template;
  }

  /**
   * Create or update a template. Admin only (enforced in route).
   */
  async upsert(templateType: string, htmlContent: string, updatedBy?: string) {
    const def = TEMPLATE_DEFAULTS[templateType];
    const name = def?.name ?? templateType;
    const description = def?.description ?? null;

    return prisma.documentTemplate.upsert({
      where: { templateType },
      update: {
        htmlContent,
        updatedBy: updatedBy ?? null,
        updatedAt: new Date(),
      },
      create: {
        templateType,
        name,
        description,
        htmlContent,
        updatedBy: updatedBy ?? null,
      },
    });
  }

  /**
   * Reset a template to factory default.
   */
  async resetToDefault(templateType: string, resetBy?: string) {
    const def = TEMPLATE_DEFAULTS[templateType];
    if (!def)
      throw new NotFoundException(`Template type "${templateType}" not found`);
    return this.upsert(templateType, def.html, resetBy);
  }

  /**
   * Seed all default templates into the database.
   */
  async seedDefaults() {
    const types = Object.keys(TEMPLATE_DEFAULTS);
    for (const templateType of types) {
      const def = TEMPLATE_DEFAULTS[templateType];
      await prisma.documentTemplate.upsert({
        where: { templateType },
        update: {}, // Don't overwrite existing custom edits
        create: {
          templateType,
          name: def.name,
          description: def.description,
          htmlContent: def.html,
        },
      });
    }
  }
}

export const templatesService = new TemplatesService();
