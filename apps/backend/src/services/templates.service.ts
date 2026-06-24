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
  `
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
`;

export const TEMPLATE_DEFAULTS: Record<string, { name: string; description: string; html: string }> = {
  BOOKING_INVOICE: {
    name: 'Booking Invoice',
    description: 'Full client-facing booking invoice with passenger list, itemized services and financial totals.',
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
  <div class="doc-header">
    <div class="brand-block">
      ${BRAND_LOGOS.companyLogo}
      <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B;">
        120 Baker Street, London, W1U 6TU, United Kingdom<br>
        Phone: +44 20 7946 0958 | Email: accounts@terrifictravel.co.uk
      </p>
    </div>
    <div class="logos-block">
      ${BRAND_LOGOS.iataLogo}
      ${BRAND_LOGOS.atolLogo}
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

  <div class="info-grid">
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
        <th>Passport Number</th>
        <th>Nationality</th>
        <th>Passport Expiry</th>
      </tr>
    </thead>
    <tbody>
      {{PASSENGERS_TABLE_ROWS}}
    </tbody>
  </table>

  <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Itemized Services &amp; Booking Elements</h3>
  <table class="data-table" style="margin-bottom: 16px;">
    <thead>
      <tr>
        <th>Service Type</th>
        <th>Description &amp; Booking Details</th>
        <th class="text-right">Price</th>
      </tr>
    </thead>
    <tbody>
      {{SERVICES_TABLE_ROWS}}
    </tbody>
  </table>

  <div class="financial-panel">
    <table class="financial-table">
      <tr><td>Subtotal Cost:</td><td class="text-right">{{SUBTOTAL}}</td></tr>
      <tr><td>Adjusted Total Price:</td><td class="text-right"><strong>{{TOTAL_PRICE}}</strong></td></tr>
      <tr><td>Amount Received:</td><td class="text-right" style="color: #16A34A; font-weight: bold;">{{PAID_AMOUNT}}</td></tr>
      <tr class="due-row"><td><strong>Outstanding Balance Due:</strong></td><td class="text-right"><strong>{{BALANCE_DUE}}</strong></td></tr>
    </table>
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
    name: 'Flight Ticket',
    description: 'E-ticket itinerary with route, PNR, baggage and passenger details — one ticket per passenger.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Flight Ticket Template</title>
<style>
${SHARED_CSS}
.ticket-wrapper { max-width: 780px; margin: 0 auto; }
.ticket-card { background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%); color: #FFFFFF; border-radius: 16px; padding: 24px 28px; margin-bottom: 16px; position: relative; overflow: hidden; }
.ticket-card::before { content: ''; position: absolute; top: -30px; right: -30px; width: 140px; height: 140px; background: rgba(255,255,255,0.04); border-radius: 50%; }
.airline-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.airline-name { font-size: 18px; font-weight: 900; letter-spacing: 0.5px; }
.pnr-badge { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 6px 14px; text-align: center; }
.pnr-label { font-size: 8px; font-weight: 700; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
.pnr-value { font-size: 16px; font-weight: 900; letter-spacing: 2px; font-family: monospace; }
.route-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.airport-code { font-size: 36px; font-weight: 900; letter-spacing: -1px; }
.airport-city { font-size: 10px; opacity: 0.7; margin-top: 2px; }
.route-line { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.route-dashes { width: 100%; height: 1px; border-top: 2px dashed rgba(255,255,255,0.25); }
.flight-details-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; background: rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 16px; }
.detail-item label { font-size: 8px; font-weight: 700; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px; }
.detail-item span { font-size: 12px; font-weight: 700; }
.passenger-section { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 18px; margin-top: 14px; }
.passenger-section h3 { font-size: 10px; font-weight: 800; color: #0EA5E9; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px; }
.passenger-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #F1F5F9; font-size: 10px; }
.baggage-strip { display: flex; gap: 12px; margin-top: 12px; }
.baggage-item { background: rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; font-size: 10px; text-align: center; }
.baggage-item span { display: block; font-size: 8px; opacity: 0.7; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
.footer-bar { font-size: 9px; color: #94A3B8; text-align: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
</style>
</head>
<body>
<div class="document-container ticket-wrapper">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
    ${BRAND_LOGOS.companyLogo}
    <div style="text-align:right;">
      <div style="font-size:9px;color:#64748B;">Booking Reference</div>
      <div style="font-size:14px;font-weight:900;color:#0F172A;">{{BOOKING_REF}}</div>
      <div style="font-size:9px;color:#94A3B8;margin-top:2px;">Issued: {{DATE}}</div>
    </div>
  </div>

  <div class="ticket-card">
    <div class="airline-row">
      <div>
        <div class="airline-name">✈ Terrific Travel — Flight Itinerary</div>
        <div style="font-size:10px;opacity:0.7;margin-top:2px;">Economy Class · {{FLIGHT_NO}}</div>
      </div>
      <div class="pnr-badge">
        <div class="pnr-label">PNR</div>
        <div class="pnr-value">{{PNR}}</div>
      </div>
    </div>

    <div class="route-row">
      <div style="text-align:center;">
        <div class="airport-code">{{DEPART_CODE}}</div>
        <div class="airport-city">{{DEPART_CITY}}</div>
        <div style="font-size:12px;font-weight:700;margin-top:6px;">{{DEPART_TIME}}</div>
      </div>
      <div class="route-line">
        <div style="font-size:9px;opacity:0.6;text-transform:uppercase;letter-spacing:1px;">Direct</div>
        <div class="route-dashes"></div>
        <div style="font-size:11px;opacity:0.7;">→</div>
      </div>
      <div style="text-align:center;">
        <div class="airport-code">{{ARRIVE_CODE}}</div>
        <div class="airport-city">{{ARRIVE_CITY}}</div>
        <div style="font-size:12px;font-weight:700;margin-top:6px;">{{ARRIVE_TIME}}</div>
      </div>
    </div>

    <div class="flight-details-grid">
      <div class="detail-item"><label>Date</label><span>{{FLIGHT_DATE}}</span></div>
      <div class="detail-item"><label>Flight Class</label><span>{{FLIGHT_CLASS}}</span></div>
      <div class="detail-item"><label>Baggage</label><span>{{BAGGAGE}}</span></div>
      <div class="detail-item"><label>Carry-On</label><span>{{CARRY_ON}}</span></div>
    </div>
  </div>

  <div class="passenger-section">
    <h3>Passenger Details</h3>
    <div class="passenger-row">
      <span><strong>{{PASSENGER_NAME}}</strong></span>
      <span>{{PASSENGER_DETAILS}}</span>
      <span>Seat: {{SEAT}}</span>
    </div>
  </div>

  <div class="footer-bar">
    Terrific Travel &amp; Tours Ltd | ATOL No: 11492 | accounts@terrifictravel.co.uk | +44 20 7946 0958<br>
    This is an e-ticket. Please present this document along with a valid passport at check-in.
  </div>
</div>
</body>
</html>`,
  },

  HOTEL_VOUCHER: {
    name: 'Hotel Voucher',
    description: 'Hotel accommodation voucher with check-in/out, room type, and guest list.',
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
<div class="document-container" style="padding:0;overflow:hidden;">
  <div class="voucher-header">
    <div>
      <div style="font-size: 10px; font-weight: 700; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Hotel Accommodation Voucher</div>
      <div class="hotel-name">{{HOTEL_NAME}}</div>
      <span class="badge">Confirmed · Ref: {{BOOKING_REF}}</span>
    </div>
    <div style="text-align: right;">
      ${BRAND_LOGOS.companyLogo.replace('height: 60px', 'height: 40px')}
      <div style="font-size: 8px; opacity: 0.7; margin-top: 4px;">accounts@terrifictravel.co.uk</div>
    </div>
  </div>

  <div class="voucher-body">
    <div class="checkin-row">
      {{HOTEL_STAY_ROW}}
    </div>

    <div class="info-row">
      <div class="info-cell"><label>Hotel Confirmation #</label><span>{{HOTEL_CONFIRMATION_NO}}</span></div>
      <div class="info-cell"><label>GDS Reservation Code</label><span>{{GDS_CODE}}</span></div>
      <div class="info-cell"><label>Guest / Lead Client Details</label><span>{{LEAD_PASSENGER_BLOCK}}</span></div>
      <div class="info-cell"><label>Total Guests</label><span>{{TOTAL_GUESTS}} Guest(s)</span></div>
      <div class="info-cell" style="grid-column: span 2;"><label>Property Information</label><span>City/Region: {{HOTEL_CITY}}<br>Address: {{HOTEL_ADDRESS}}</span></div>
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
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · accounts@terrifictravel.co.uk<br>
      Please present this voucher at check-in. All special requests are subject to availability.
    </div>
  </div>
</div>
</body>
</html>`,
  },

  TRANSPORT_VOUCHER: {
    name: 'Transfer Voucher',
    description: 'Ground transport voucher with route, pickup time, vehicle and driver details.',
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
<div class="document-container" style="padding:0;overflow:hidden;">
  <div class="transport-header">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:10px;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Transport / Transfer Voucher</div>
        <div style="font-size:20px;font-weight:900;">Transfer Service</div>
        <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Confirmed · Ref: {{BOOKING_REF}}</span>
      </div>
      <div style="text-align:right;font-size:9px;opacity:0.8;">
        Terrific Travel &amp; Tours Ltd<br>
        accounts@terrifictravel.co.uk
      </div>
    </div>
  </div>

  <div class="transport-body">
    <div class="info-grid">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Booking Summary</h3>
        <p>Total Scheduled Transfers: <strong>{{TOTAL_TRANSFERS}} Leg(s)</strong></p>
        <p>Ground Status: <strong>Confirmed &amp; Secured</strong></p>
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
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        {{TRANSFERS_TABLE_ROWS}}
      </tbody>
    </table>

    <div class="financial-panel">
      <table class="financial-table">
        <tr class="total-row">
          <td><strong>Total Ground Cost:</strong></td>
          <td class="text-right"><strong>{{TOTAL_GROUND_COST}}</strong></td>
        </tr>
      </table>
    </div>

    <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
      <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Transfer Notices</p>
      <p style="margin: 0;">1. Driver will hold a sign with the lead passenger's name at the designated arrivals exit or hotel lobby.</p>
      <p style="margin: 0;">2. Maximum waiting time for flight arrivals is 60 minutes after actual landing. Contact support if delayed in customs.</p>
      <p style="margin: 0;">3. For departure transfers, please be present at the hotel lobby 10 minutes prior to scheduled pickup time.</p>
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
    name: 'Visa Services Invoice',
    description: 'Per-passenger visa processing invoice with consular details and fees.',
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
<div class="document-container" style="padding:0;overflow:hidden;">
  <div class="visa-header">
    <div>
      <div style="font-size:10px;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Visa Processing Invoice</div>
      <div style="font-size:20px;font-weight:900;">MOFA / Embassy Services</div>
      <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Ref: {{BOOKING_REF}}</span>
    </div>
    <div style="text-align:right;font-size:9px;opacity:0.8;">
      Terrific Travel &amp; Tours Ltd<br>
      accounts@terrifictravel.co.uk<br>
      Date: {{ISSUE_DATE}}
    </div>
  </div>

  <div class="visa-body">
    <div class="info-grid">
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
    </div>

    <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Consular &amp; Processing Services Summary</h3>
    <table class="data-table" style="margin-bottom: 24px;">
      <thead>
        <tr>
          <th>Consular Visa Category</th>
          <th>Passport Number</th>
          <th>Visa Processing Number</th>
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
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · accounts@terrifictravel.co.uk
    </div>
  </div>
</div>
</body>
</html>`,
  },

  SPECIAL_SERVICES: {
    name: 'Special Services Invoice',
    description: 'Invoice for additional/ancillary services like extra baggage, meals, and special requests.',
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
<div class="document-container" style="padding:0;overflow:hidden;">
  <div class="special-header">
    <div>
      <div style="font-size:10px;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Additional / Special Services Invoice</div>
      <div style="font-size:20px;font-weight:900;">Ancillary Services</div>
      <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Ref: {{BOOKING_REF}}</span>
    </div>
    <div style="text-align:right;font-size:9px;opacity:0.8;">
      Terrific Travel &amp; Tours Ltd<br>
      accounts@terrifictravel.co.uk<br>
      Date: {{TODAY}}
    </div>
  </div>

  <div class="special-body">
    <div class="info-grid">
      <div class="info-box">
        <h3>Lead Passenger / Guest</h3>
        {{LEAD_PASSENGER_BLOCK}}
      </div>
      <div class="info-box">
        <h3>Fulfillment Details</h3>
        <p>Special Service Type: Additional / Custom Element</p>
        <p>Total Items: <strong>{{TOTAL_SERVICES}}</strong></p>
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
      Terrific Travel &amp; Tours Ltd · accounts@terrifictravel.co.uk<br>
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
