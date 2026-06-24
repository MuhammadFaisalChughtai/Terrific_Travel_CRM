import { formatCurrency } from "@tms/shared-utils";

// Embedded Vector SVGs for branding
export const BRAND_LOGOS = {
  // Premium Terrific Travel & Tours Logo
  companyLogo: `
    <img src="/Logo.svg" alt="Terrific Travel Logo" style="height: 60px; width: auto; max-width: 250px; display: block;" />
  `,

  // Official-looking IATA Member Badge
  iataLogo: `
    <svg width="65" height="40" viewBox="0 0 65 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="65" height="40" rx="4" fill="#0054A6"/>
      <circle cx="32" cy="20" r="14" stroke="#FFFFFF" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>
      <path d="M15 12H21M18 12V28M15 28H21" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <text x="21" y="26" font-family="'Arial Black', sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="-0.5">IATA</text>
      <text x="18" y="34" font-family="Arial, sans-serif" font-size="5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">MEMBER AGENT</text>
    </svg>
  `,

  // ATOL Protected Emblem
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

// Common CSS rules for invoices and vouchers
export const SHARED_CSS = `
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

  .ticket-card-header {
    background: #0F172A;
    color: #FFFFFF;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ticket-card-body {
    padding: 16px;
    display: grid;
    grid-template-cols: 2fr 1fr 2fr;
    align-items: center;
    gap: 15px;
  }

  .airport-code {
    font-size: 24px;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    color: #0F172A;
    margin: 0;
  }

  .airport-name {
    font-size: 9px;
    color: #64748B;
    margin: 0;
    text-transform: uppercase;
  }

  .flight-arrow {
    text-align: center;
    font-size: 18px;
    color: #0EA5E9;
  }

  .flight-meta-grid {
    display: grid;
    grid-template-cols: repeat(4, 1fr);
    gap: 10px;
    background: #F8FAFC;
    padding: 12px;
    border-top: 1px solid #E2E8F0;
  }

  .meta-item h5 {
    margin: 0 0 2px 0;
    font-size: 8px;
    color: #64748B;
    text-transform: uppercase;
  }

  .meta-item p {
    margin: 0;
    font-weight: 700;
    color: #1E293B;
  }

  .layover-divider {
    background: #FFFBEB;
    border: 1px dashed #F59E0B;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 12px 0 6px 0;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    color: #B45309;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    clear: both;
  }
`;

// Helper to open popup window and print
export function printDocument(htmlContent: string, title: string) {
  const win = window.open("", "_blank", "width=850,height=800");
  if (!win) {
    alert("Could not open print window. Please disable pop-up blocker.");
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>${SHARED_CSS}</style>
      </head>
      <body>
        <div class="no-print" style="max-width: 800px; margin: 0 auto 15px auto; padding: 10px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #0EA5E9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: sans-serif; font-size: 12px;">Print to PDF</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #E2E8F0; color: #1E293B; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: sans-serif; font-size: 12px;">Close</button>
        </div>
        ${htmlContent}
      </body>
    </html>
  `);
  win.document.close();
  // Allow time for styles to load, then trigger print
  setTimeout(() => {
    win.focus();
    win.print();
  }, 350);
}

// Format date securely
function formatDate(d: any) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// 1. GENERATE BOOKING INVOICE
export function generateBookingInvoiceHtml(booking: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const formattedDeparture = formatDate(booking.departureDate);
  const invoiceNo = `INV-${booking.bookingReference || booking.id.substring(0, 8)}`;

  // Calculate item summaries
  const flightsCost =
    booking.flightServices?.reduce(
      (sum: number, f: any) => sum + (f.price || 0),
      0,
    ) || 0;
  const hotelsCost =
    booking.accommodations?.reduce(
      (sum: number, h: any) => sum + (h.price || 0),
      0,
    ) || 0;
  const transportCost =
    booking.transportServices?.reduce(
      (sum: number, t: any) => sum + (t.price || 0),
      0,
    ) || 0;
  const visaCost =
    booking.visaServices?.reduce(
      (sum: number, v: any) => sum + (v.price || 0),
      0,
    ) || 0;
  const additionalCost =
    booking.additionalServices?.reduce(
      (sum: number, a: any) => sum + (a.servicePrice || 0),
      0,
    ) || 0;

  const totalCalculated =
    flightsCost + hotelsCost + transportCost + visaCost + additionalCost;
  const totalPrice = booking.totalPrice || totalCalculated;
  const paidAmount = booking.paidAmount || 0;
  const balanceDue = totalPrice - paidAmount;

  return `
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
          <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: ${booking.paymentStatus || "UNPAID"}</span>
        </div>
        <div class="doc-meta">
          <p>Invoice No: <strong>${invoiceNo}</strong></p>
          <p>Date: <strong>${formatDate(new Date())}</strong></p>
          <p>Booking Ref: <strong>${booking.bookingReference}</strong></p>
          <p>Departure Date: <strong>${formattedDeparture}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Lead Passenger / Client</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Customer"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
          ${leader && leader.passportNumber ? `<p>Passport No: ${leader.passportNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Agent / Account Executive</h3>
          <p><strong>${booking.agent?.name || "Terrific Travel Direct Office"}</strong></p>
          <p>GDS System: ${booking.agent?.gdsSystem || "Amadeus/Sabre"}</p>
          <p>Assigned PCC: ${booking.agent?.pcc || "Direct Customer Support"}</p>
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
          ${
            booking.passengers && booking.passengers.length > 0
              ? booking.passengers
                  .map(
                    (p: any) => `
            <tr>
              <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
              <td>${p.age || "Adult"} (${p.role || "Passenger"})</td>
              <td>${p.passportNumber || "—"}</td>
              <td>${p.nationality || "—"}</td>
              <td>${p.passportExpiryDate ? formatDate(p.passportExpiryDate) : "—"}</td>
            </tr>
          `,
                  )
                  .join("")
              : `
            <tr>
              <td colspan="5" class="text-center" style="color: #64748B;">No passenger info added.</td>
            </tr>
          `
          }
        </tbody>
      </table>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Itemized Services & Booking Elements</h3>
      <table class="data-table" style="margin-bottom: 16px;">
        <thead>
          <tr>
            <th>Service Type</th>
            <th>Description & Booking Details</th>
            <th class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${
            booking.flightServices
              ?.map(
                (f: any) => `
            <tr>
              <td><span style="font-weight: 700; color: #0284C7;">FLIGHT</span></td>
              <td>Flight No: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"}) - ${f.departedFrom} to ${f.arrivedAt} on ${formatDate(f.date)}</td>
              <td class="text-right">${formatCurrency(f.price)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          ${
            booking.accommodations
              ?.map(
                (h: any) => `
            <tr>
              <td><span style="font-weight: 700; color: #10B981;">HOTEL</span></td>
              <td><strong>${h.hotelName}</strong> (${h.city || "—"}) - Room: ${h.roomType} x${h.qty} (${h.mealType || "Room Only"}), Confirmation #: ${h.hotelConfirmationNumber || "—"}</td>
              <td class="text-right">${formatCurrency(h.price)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          ${
            booking.transportServices
              ?.map(
                (t: any) => `
            <tr>
              <td><span style="font-weight: 700; color: #F59E0B;">TRANSFER</span></td>
              <td>${t.vehicleType} - From: ${t.departureDestination} to ${t.arrivalDestination} on ${formatDate(t.date)}</td>
              <td class="text-right">${formatCurrency(t.price)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          ${
            booking.visaServices
              ?.map(
                (v: any) => `
            <tr>
              <td><span style="font-weight: 700; color: #8B5CF6;">VISA</span></td>
              <td>Visa Type: ${v.visaType} (Passport: ${v.passportNumber}) - Visa Number: ${v.visaNumber || "—"}</td>
              <td class="text-right">${formatCurrency(v.price)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          ${
            booking.additionalServices
              ?.map(
                (a: any) => `
            <tr>
              <td><span style="font-weight: 700; color: #EC4899;">SPECIAL SERVICE</span></td>
              <td><strong>${a.serviceName}</strong> ${a.serviceDescription ? ` - ${a.serviceDescription}` : ""} ${a.customVendorName ? `(Vendor: ${a.customVendorName})` : ""}</td>
              <td class="text-right">${formatCurrency(a.servicePrice)}</td>
            </tr>
          `,
              )
              .join("") || ""
          }

          ${
            !booking.flightServices?.length &&
            !booking.accommodations?.length &&
            !booking.transportServices?.length &&
            !booking.visaServices?.length &&
            !booking.additionalServices?.length
              ? `
            <tr>
              <td colspan="3" class="text-center" style="color: #64748B;">No service components registered.</td>
            </tr>
          `
              : ""
          }
        </tbody>
      </table>

      <div class="financial-panel">
        <table class="financial-table">
          <tr>
            <td>Subtotal Cost:</td>
            <td class="text-right">${formatCurrency(totalCalculated)}</td>
          </tr>
          <tr>
            <td>Adjusted Total Price:</td>
            <td class="text-right"><strong>${formatCurrency(totalPrice)}</strong></td>
          </tr>
          <tr>
            <td>Amount Received:</td>
            <td class="text-right" style="color: #16A34A; font-weight: bold;">${formatCurrency(paidAmount)}</td>
          </tr>
          <tr class="due-row">
            <td><strong>Outstanding Balance Due:</strong></td>
            <td class="text-right"><strong>${formatCurrency(balanceDue)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="info-box" style="margin-top: 20px; font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Travel Information & Booking Conditions</p>
        <p style="margin: 0;">1. All flight ticket reservations are subject to GDS and airline rules. Cancellation charges or re-issue charges will be applied dynamically.</p>
        <p style="margin: 0;">2. Your hotel booking status is secured. Present this document along with your check-in hotel vouchers and valid passenger identifications at the hotel desk.</p>
        <p style="margin: 0;">3. Outstanding balances must be settled at least 7 days prior to departure. Unpaid bookings are subject to automatic release by GDS systems.</p>
        <p style="margin: 0;">4. All flight ticket bookings are protected under the UK Civil Aviation Authority ATOL scheme (Reg 11492) and fully backed by our IATA credentials.</p>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel & Tours Ltd | Registered in England & Wales: #09384812 | VAT Number: GB 129 3847 21</p>
        <p>Thank you for choosing Terrific Travel. We wish you an amazing journey!</p>
      </div>
    </div>
  `;
}

// Helper to generate deterministic realistic e-ticket number
function getTicketNumber(passenger: any, flight: any): string {
  const nameCode =
    ((passenger.firstName || "").length * 7 +
      (passenger.lastName || "").length * 3) %
    1000000;
  const passIdCode = passenger.id
    ? parseInt(passenger.id.replace(/[^0-9]/g, "").substring(0, 7)) || 1234567
    : 1234567;
  const num = String((nameCode * passIdCode) % 1000000000).padStart(9, "0");

  const flightCarrier = (flight.flightNo || "").substring(0, 2).toUpperCase();
  let prefix = "157"; // Qatar Airways
  if (flightCarrier === "EK") prefix = "176";
  else if (flightCarrier === "BA") prefix = "125";
  else if (flightCarrier === "SV") prefix = "065";
  else if (flightCarrier === "WY") prefix = "910";

  return `${prefix}${num}`;
}

function getIsConnecting(segment: any): boolean {
  if (!segment.notes) return false;
  try {
    const parsed = JSON.parse(segment.notes);
    return !!parsed.isConnecting;
  } catch (e) {
    return false;
  }
}

function calculateLayover(arrivalSeg: any, departSeg: any): string {
  try {
    const arrDate = new Date(arrivalSeg.date);
    const depDate = new Date(departSeg.date);

    const [arrH, arrM] = (arrivalSeg.arrivalTime || "00:00")
      .split(":")
      .map(Number);
    const [depH, depM] = (departSeg.departTime || "00:00")
      .split(":")
      .map(Number);

    const arrTime = new Date(
      arrDate.getFullYear(),
      arrDate.getMonth(),
      arrDate.getDate(),
      arrH,
      arrM,
      0,
      0,
    );
    const depTime = new Date(
      depDate.getFullYear(),
      depDate.getMonth(),
      depDate.getDate(),
      depH,
      depM,
      0,
      0,
    );

    const diffMs = depTime.getTime() - arrTime.getTime();
    if (diffMs <= 0) return "";

    const totalMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    return `${hrs} hr ${mins} min`;
  } catch (e) {
    return "";
  }
}

function deriveAgeCategory(dob: string): string {
  if (!dob) return "ADULT";
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return "ADULT";
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
  if (years < 2) return "INFANT";
  if (years < 12) return "CHILD";
  return "ADULT";
}

function generateIndividualTicketHtml(
  booking: any,
  passenger: any,
  flights: any[],
) {
  const ticketNo = passenger
    ? getTicketNumber(passenger, flights[0] || {})
    : "—";
  const pnr = flights[0]?.pnr || booking.bookingReference || "—";
  const issueDate = flights[0]?.issueDate
    ? formatDate(flights[0].issueDate)
    : formatDate(booking.createdAt || new Date());

  // SVG Barcode
  const barcode = `
    <svg width="150" height="30" viewBox="0 0 150 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="30" fill="transparent"/>
      <rect x="5" y="2" width="2" height="26" fill="#000000"/>
      <rect x="9" y="2" width="1" height="26" fill="#000000"/>
      <rect x="12" y="2" width="3" height="26" fill="#000000"/>
      <rect x="17" y="2" width="1" height="26" fill="#000000"/>
      <rect x="20" y="2" width="2" height="26" fill="#000000"/>
      <rect x="24" y="2" width="4" height="26" fill="#000000"/>
      <rect x="30" y="2" width="1" height="26" fill="#000000"/>
      <rect x="33" y="2" width="2" height="26" fill="#000000"/>
      <rect x="37" y="2" width="3" height="26" fill="#000000"/>
      <rect x="42" y="2" width="1" height="26" fill="#000000"/>
      <rect x="45" y="2" width="4" height="26" fill="#000000"/>
      <rect x="51" y="2" width="2" height="26" fill="#000000"/>
      <rect x="55" y="2" width="1" height="26" fill="#000000"/>
      <rect x="58" y="2" width="3" height="26" fill="#000000"/>
      <rect x="63" y="2" width="2" height="26" fill="#000000"/>
      <rect x="67" y="2" width="4" height="26" fill="#000000"/>
      <rect x="73" y="2" width="1" height="26" fill="#000000"/>
      <rect x="76" y="2" width="3" height="26" fill="#000000"/>
      <rect x="81" y="2" width="2" height="26" fill="#000000"/>
      <rect x="85" y="2" width="1" height="26" fill="#000000"/>
      <rect x="88" y="2" width="4" height="26" fill="#000000"/>
      <rect x="94" y="2" width="2" height="26" fill="#000000"/>
      <rect x="98" y="2" width="3" height="26" fill="#000000"/>
      <rect x="103" y="2" width="1" height="26" fill="#000000"/>
      <rect x="106" y="2" width="4" height="26" fill="#000000"/>
      <rect x="112" y="2" width="2" height="26" fill="#000000"/>
      <rect x="116" y="2" width="1" height="26" fill="#000000"/>
      <rect x="119" y="2" width="3" height="26" fill="#000000"/>
      <rect x="124" y="2" width="2" height="26" fill="#000000"/>
      <rect x="128" y="2" width="4" height="26" fill="#000000"/>
      <rect x="134" y="2" width="1" height="26" fill="#000000"/>
      <rect x="137" y="2" width="3" height="26" fill="#000000"/>
      <rect x="142" y="2" width="2" height="26" fill="#000000"/>
    </svg>
  `;

  return `
    <div class="document-container" style="max-width: 850px; border: 1.5px solid #888888; padding: 25px; font-family: Arial, sans-serif; line-height: 1.4; color: #000000; margin-bottom: 20px; box-shadow: none;">
      <!-- Main Brand Header -->
      <div style="text-align: center; margin-bottom: 15px;">
        <h1 style="color: #9C1C24; font-family: 'Outfit', Arial, sans-serif; font-size: 24px; font-weight: 900; margin: 0 0 5px 0; letter-spacing: 0.5px;">TERRIFIC TRAVEL LTD</h1>
        <p style="margin: 0; font-size: 9px; font-weight: bold; color: #444444; text-transform: uppercase;">
          OFFICE 1, 11 WALFORD ROAD, BIRMINGHAM, B11 1NP, UNITED KINGDOM
        </p>
        <p style="margin: 3px 0 0 0; font-size: 10px; font-weight: bold; color: #444444;">
          Phone: 01215291630 | Email: office@terrifictravel.co.uk
        </p>
      </div>

      <hr style="border: 0; border-top: 1.5px solid #000000; margin: 10px 0;" />

      <!-- Booking Info / Barcode Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; font-size: 11px;">
        <div style="line-height: 1.5;">
          <div><strong>Email:</strong> office@terrifictravel.co.uk</div>
          <div style="margin-top: 5px;">
            <span style="margin-right: 15px;"><strong>Booking Date:</strong> ${formatDate(booking.createdAt)}</span>
            <span style="margin-right: 15px;"><strong>Supplier Ref:</strong> ${pnr}</span>
            <span><strong>Booking Ref:</strong> ${booking.bookingReference || "—"}</span>
          </div>
        </div>
        <div style="text-align: right;">
          ${barcode}
        </div>
      </div>

      <!-- Passenger Details Block -->
      <div style="background: #9C1C24; color: #FFFFFF; font-weight: bold; font-size: 13px; padding: 6px 12px; margin-bottom: 8px; text-transform: uppercase; font-family: 'Outfit', Arial, sans-serif; border-radius: 2px;">
        Passenger Details
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
        <thead>
          <tr style="text-align: left; font-weight: bold; color: #555555; border-bottom: 1px solid #E2E8F0;">
            <th style="padding: 6px 8px; width: 15%;">PAX Type</th>
            <th style="padding: 6px 8px; width: 25%;">Last Name</th>
            <th style="padding: 6px 8px; width: 25%;">First Name</th>
            <th style="padding: 6px 8px; width: 20%;">E-Ticket Number</th>
            <th style="padding: 6px 8px; width: 15%;">Agency IATA Number</th>
          </tr>
        </thead>
        <tbody>
          <tr style="font-weight: bold; color: #000000; font-size: 12px;">
            <td style="padding: 8px 8px; text-transform: uppercase;">${passenger.role || deriveAgeCategory(passenger.dateOfBirth)}</td>
            <td style="padding: 8px 8px; text-transform: uppercase;">${passenger.lastName}</td>
            <td style="padding: 8px 8px; text-transform: uppercase;">${passenger.title || ""} ${passenger.firstName}</td>
            <td style="padding: 8px 8px; color: #0284C7; font-family: monospace; font-size: 13px; font-weight: bold;">${ticketNo}</td>
            <td style="padding: 8px 8px;">91263712</td>
          </tr>
          <tr style="font-size: 9px; color: #555555; border-top: 1px solid #F1F5F9;">
            <td style="padding: 4px 8px;" colspan="3"><strong>Ticket Issue Date:</strong> ${issueDate}</td>
            <td style="padding: 4px 8px;" colspan="2"><strong>Mileage Number:</strong> —</td>
          </tr>
        </tbody>
      </table>

      <!-- Flight Details Block -->
      <div style="background: #9C1C24; color: #FFFFFF; font-weight: bold; font-size: 13px; padding: 6px 12px; margin-bottom: 8px; text-transform: uppercase; font-family: 'Outfit', Arial, sans-serif; border-radius: 2px;">
        Flight Details
      </div>

      ${flights
        .map((f: any, idx: number) => {
          const isConnecting = getIsConnecting(f);
          const nextFlight = flights[idx + 1];
          const layoverStr =
            isConnecting && nextFlight ? calculateLayover(f, nextFlight) : "";

          // Format dates neatly
          const depDateStr = formatDate(f.date);
          const arrDateStr = formatDate(f.date);

          return `
          <div style="border-bottom: 1px solid #CCCCCC; padding-bottom: 12px; margin-bottom: 12px; font-size: 11px;">
            <!-- Segment Carrier Row -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
              <tr style="font-weight: bold; font-size: 10px; color: #666666; border-bottom: 1px solid #E2E8F0; text-transform: uppercase;">
                <td style="padding: 4px 0; width: 30%;">Airline</td>
                <td style="padding: 4px 0; width: 35%;">Departure</td>
                <td style="padding: 4px 0; width: 35%;">Arrival</td>
              </tr>
              <tr>
                <!-- Airline Info -->
                <td style="vertical-align: top; padding: 6px 0;">
                  <strong style="font-size: 12px; color: #000000;">${f.vendor?.name || "Airline Partner"}</strong><br/>
                  <span style="font-weight: bold; font-size: 11px; color: #555555;">${f.flightNo}</span>
                </td>
                
                <!-- Departure Station -->
                <td style="vertical-align: top; padding: 6px 0; line-height: 1.3;">
                  <strong style="color: #555555;">${depDateStr}</strong><br/>
                  <span style="font-size: 13px; font-weight: bold; color: #000000;">${f.departTime || "—"}</span><br/>
                  <span style="text-transform: uppercase; font-weight: bold;">${f.departedFrom}</span>
                </td>

                <!-- Arrival Station -->
                <td style="vertical-align: top; padding: 6px 0; line-height: 1.3;">
                  <strong style="color: #555555;">${arrDateStr}</strong><br/>
                  <span style="font-size: 13px; font-weight: bold; color: #000000;">${f.arrivalTime || "—"}</span><br/>
                  <span style="text-transform: uppercase; font-weight: bold;">${f.arrivedAt}</span>
                </td>
              </tr>
            </table>

            <!-- Segment Ticketing Details (3x3 grid matching ref style) -->
            <div style="display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 8px; background: #FDFDFD; border: 1px solid #E2E8F0; padding: 10px; border-radius: 4px; font-size: 10px;">
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Baggage:</span> 
                <span style="font-weight: bold; color: #000000;">${f.baggage || "25 Kilograms"}</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">FareBasis:</span> 
                <span style="font-weight: bold; color: #000000;">OLGBN1RE</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">SeatNumber:</span> 
                <span style="font-weight: bold; color: #000000;">—</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Status:</span> 
                <span style="font-weight: bold; color: #16A34A;">Open</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Not Valid Before:</span> 
                <span style="font-weight: bold; color: #000000;">${depDateStr}</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Not Valid After:</span> 
                <span style="font-weight: bold; color: #000000;">${arrDateStr}</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Meal Preference:</span> 
                <span style="font-weight: bold; color: #000000;">—</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Class:</span> 
                <span style="font-weight: bold; color: #0EA5E9;">${f.flightClass || "Economy"}</span>
              </div>
              <div>
                <span style="color: #666666; font-weight: bold; text-transform: uppercase;">Wheelchair(WCHR):</span> 
                <span style="font-weight: bold; color: #000000;">—</span>
              </div>
            </div>

            <!-- Connecting Layover Alert if connecting -->
            ${
              layoverStr
                ? `
              <div class="layover-divider">
                <span>⏱️ Layover Connection: <strong>${layoverStr}</strong> at transit airport <strong>${f.arrivedAt}</strong></span>
              </div>
            `
                : ""
            }
          </div>
        `;
        })
        .join("")}

      <!-- Bottom Notice matching ref style -->
      <div style="font-size: 8px; line-height: 1.4; color: #666666; border-top: 1px dashed #888888; padding-top: 10px; margin-top: 20px;">
        <p style="margin: 0 0 5px 0; font-weight: bold;">Foreign & Commonwealth Office Travel Advice:</p>
        <p style="margin: 0 0 10px 0;">The Foreign & Commonwealth Office (FCO) issues travel advice on destinations, which includes information on passports, visas, health, safety, and security. For more information refer to link: https://www.gov.uk/foreign-travel-advice</p>
        
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #9C1C24;">NOTES :</p>
        <p style="margin: 0;">1. Reconfirmation of any onward / return journey is passenger responsibility.</p>
        <p style="margin: 0;">2. Timings are subject to change. Please reconfirm with your airline operator before you fly.</p>
        <p style="margin: 0;">3. Present your e-ticket along with your original valid passport at check-in counter to obtain boarding passes.</p>
        <p style="margin: 0;">4. All flight ticket bookings are protected under the UK Civil Aviation Authority ATOL scheme (Reg 11492) and fully backed by our IATA credentials.</p>
      </div>

      <div style="text-align: center; font-size: 9px; font-weight: bold; color: #888888; margin-top: 15px; border-top: 1px solid #E2E8F0; padding-top: 8px;">
        Thank you for booking with Terrific Travel. Have a safe and comfortable flight!
      </div>
    </div>
  `;
}

// 2. GENERATE FLIGHT TICKET
export function generateFlightTicketHtml(
  booking: any,
  flight: any,
  selectedPassengerId?: string | null,
) {
  const flightsToRender =
    booking.flightServices && booking.flightServices.length > 0
      ? booking.flightServices
      : [flight];

  const sortedFlights = [...flightsToRender].sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return (a.departTime || "").localeCompare(b.departTime || "");
  });

  const passengers =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
      : [
          {
            firstName: "Valued",
            lastName: "Passenger",
            role: "Passenger",
            dateOfBirth: "",
          },
        ];

  if (!selectedPassengerId || selectedPassengerId === "all") {
    // Return all passenger tickets separated by page break
    return passengers
      .map((p: any) => generateIndividualTicketHtml(booking, p, sortedFlights))
      .join('<div style="page-break-after: always; height: 1px;"></div>');
  } else {
    const p = passengers.find((pass: any) => pass.id === selectedPassengerId);
    return generateIndividualTicketHtml(
      booking,
      p || passengers[0],
      sortedFlights,
    );
  }
}

// 3. GENERATE HOTEL VOUCHER
export function generateHotelVoucherHtml(booking: any, hotel: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const voucherNo = `HTL-${hotel.id.substring(0, 8).toUpperCase()}`;

  return `
    <div class="document-container">
      <div class="doc-header">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B;">
            Accommodation & Hospitality | Terrific Travel & Tours
          </p>
        </div>
        <div class="logos-block">
          ${BRAND_LOGOS.iataLogo}
          ${BRAND_LOGOS.atolLogo}
        </div>
      </div>

      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Hotel Booking Voucher</h1>
          <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Confirmed</span>
        </div>
        <div class="doc-meta">
          <p>Voucher No: <strong>${voucherNo}</strong></p>
          <p>Issue Date: <strong>${hotel.issueDate ? formatDate(hotel.issueDate) : formatDate(new Date())}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
          <p>Hotel Confirmation #: <strong style="font-size: 12px; color: #10B981;">${hotel.hotelConfirmationNumber || "CONFIRMED"}</strong></p>
          <p>GDS Reservation Code: <strong>${hotel.reservationNumber || "—"}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Guest / Lead Client Details</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Guest"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
          <p>Total Guests: <strong>${booking.passengers?.length || 1} Person(s)</strong></p>
        </div>
        <div class="info-box">
          <h3>Property Information</h3>
          <p style="font-size: 13px; font-weight: 700; color: #0F172A;">${hotel.hotelName}</p>
          <p>City/Region: ${hotel.city || "—"}</p>
          <p>Address: ${hotel.hotelAddress || "—"}</p>
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Stay & Room Accommodation Details</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Room Specifications</th>
            <th>Room Qty</th>
            <th>Meal Plan Included</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${formatDate(hotel.checkInDate)}</strong><br>
              <span style="font-size: 9px; color: #64748B;">From: ${hotel.checkInTime || "16:00"}</span>
            </td>
            <td>
              <strong>${formatDate(hotel.checkOutDate)}</strong><br>
              <span style="font-size: 9px; color: #64748B;">Until: ${hotel.checkOutTime || "12:00"}</span>
            </td>
            <td><strong>${hotel.roomType}</strong></td>
            <td class="text-center">${hotel.qty || 1}</td>
            <td><span style="font-weight: 700; color: #10B981;">${hotel.mealType || "Room Only"}</span></td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Registered Guests</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>No.</th>
            <th>Guest Name</th>
            <th>Age Category</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tbody>
          ${
            booking.passengers && booking.passengers.length > 0
              ? booking.passengers
                  .map(
                    (p: any, idx: number) => `
            <tr>
              <td class="text-center">${idx + 1}</td>
              <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
              <td>${p.age || "Adult"}</td>
              <td>${p.nationality || "—"}</td>
            </tr>
          `,
                  )
                  .join("")
              : `
            <tr>
              <td colspan="4" class="text-center" style="color: #64748B;">No guests registered.</td>
            </tr>
          `
          }
        </tbody>
      </table>

      <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Check-In Information</p>
        <p style="margin: 0;">1. Present this printable voucher at the hotel reception desk along with a valid photo ID of all adult guests for verification.</p>
        <p style="margin: 0;">2. A security deposit via credit card or cash may be requested by the hotel reception at check-in for incidental charges.</p>
        <p style="margin: 0;">3. Early check-in and late check-out requests are subject to availability and hotel convenience.</p>
        <p style="margin: 0;">4. Cancellation and modifications are strictly governed by hotel policies. Pre-paid booking voucher cannot be refunded directly.</p>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel & Tours Ltd | Accommodation confirmation program registration under CAA regulations</p>
        <p>We wish you an enjoyable and comfortable stay!</p>
      </div>
    </div>
  `;
}

// 4. GENERATE VISA INVOICE
export function generateVisaInvoiceHtml(booking: any, visa: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const visas = visa === "all" || !visa ? booking.visaServices || [] : [visa];

  const invoiceNo =
    visa === "all" || !visa
      ? `VISA-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `VISA-${visa.id.substring(0, 8).toUpperCase()}`;

  const totalCost = visas.reduce(
    (sum: number, v: any) => sum + (v.price || 0),
    0,
  );
  const issueDate =
    visa === "all" || !visa
      ? formatDate(new Date())
      : visa.issueDate
        ? formatDate(visa.issueDate)
        : formatDate(new Date());

  return `
    <div class="document-container">
      <div class="doc-header">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B;">
            Visa & Immigration Department | Terrific Travel
          </p>
        </div>
        <div class="logos-block">
          ${BRAND_LOGOS.iataLogo}
          ${BRAND_LOGOS.atolLogo}
        </div>
      </div>

      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Visa Services Invoice</h1>
          <span class="section-badge" style="background: #DCFCE7; color: #15803D;">Status: Completed</span>
        </div>
        <div class="doc-meta">
          <p>Invoice No: <strong>${invoiceNo}</strong></p>
          <p>Issue Date: <strong>${issueDate}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Applicant / Client Info</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Applicant"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Services Desk</h3>
          <p><strong>Terrific Travel Visas & Consular Services</strong></p>
          <p>Consular Desk Support</p>
          <p>Total Visa Applications: <strong>${visas.length}</strong></p>
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Consular & Processing Services Summary</h3>
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
          ${visas
            .map(
              (v: any) => `
            <tr>
              <td><strong>${v.visaType}</strong></td>
              <td>${v.passportNumber}</td>
              <td>${v.visaNumber || "—"}</td>
              <td>${v.issueDate ? formatDate(v.issueDate) : "—"}</td>
              <td class="text-right"><strong>${formatCurrency(v.price)}</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="financial-panel">
        <table class="financial-table">
          <tr class="total-row">
            <td><strong>Total Visa Charges:</strong></td>
            <td class="text-right"><strong>${formatCurrency(totalCost)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Visa Consular Notice</p>
        <p style="margin: 0;">1. Travelers must verify that all details on their visa match their passport data precisely. Inform consular desk of errors immediately.</p>
        <p style="margin: 0;">2. Possession of a valid visa does not guarantee entry into sovereign territory. Final decision remains with border authorities.</p>
        <p style="margin: 0;">3. Visa fees are completely non-refundable once the application is registered with consulate departments.</p>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel & Tours Ltd | Registered Consular and Travel Visa Processing Partner</p>
        <p>We wish you a safe and hassle-free transit!</p>
      </div>
    </div>
  `;
}

// 5. GENERATE TRANSPORT VOUCHER
export function generateTransportVoucherHtml(booking: any, transport: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const transfers =
    transport === "all" || !transport
      ? booking.transportServices || []
      : [transport];

  const voucherNo =
    transport === "all" || !transport
      ? `TRN-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `TRN-${transport.id.substring(0, 8).toUpperCase()}`;

  const totalCost = transfers.reduce(
    (sum: number, t: any) => sum + (t.price || 0),
    0,
  );
  const issueDate =
    transport === "all" || !transport
      ? formatDate(new Date())
      : transport.issueDate
        ? formatDate(transport.issueDate)
        : formatDate(new Date());

  return `
    <div class="document-container">
      <div class="doc-header">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B;">
            Ground Transport & Transfers Desk | Terrific Travel
          </p>
        </div>
        <div class="logos-block">
          ${BRAND_LOGOS.iataLogo}
          ${BRAND_LOGOS.atolLogo}
        </div>
      </div>

      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Transfer Voucher</h1>
          <span class="section-badge" style="background: #FEF3C7; color: #D97706;">Service: Scheduled</span>
        </div>
        <div class="doc-meta">
          <p>Voucher No: <strong>${voucherNo}</strong></p>
          <p>Issue Date: <strong>${issueDate}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Lead Passenger / Guest</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Booking Summary</h3>
          <p>Total Scheduled Transfers: <strong>${transfers.length} Leg(s)</strong></p>
          <p>Ground Status: <strong>Confirmed & Secured</strong></p>
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Route & Service Details</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Pick-up Location</th>
            <th>Drop-off Destination</th>
            <th>Vehicle & Transfer Details</th>
            <th class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${transfers
            .map(
              (t: any) => `
            <tr>
              <td>
                <strong>${formatDate(t.date)}</strong><br/>
                <span style="font-size: 9px; color: #64748B;">Time: ${t.departureTime || "—"}</span>
              </td>
              <td><strong>${t.departureDestination}</strong></td>
              <td><strong>${t.arrivalDestination}</strong></td>
              <td>
                <span style="font-weight: 700; color: #0F172A;">${t.vehicleType}</span>
                ${t.flightNo ? `<br/><span style="font-size: 9px; color: #0284C7; font-weight: bold;">Flight: ${t.flightNo}</span>` : ""}
              </td>
              <td class="text-right"><strong>${formatCurrency(t.price)}</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="financial-panel">
        <table class="financial-table">
          <tr class="total-row">
            <td><strong>Total Ground Cost:</strong></td>
            <td class="text-right"><strong>${formatCurrency(totalCost)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="info-box" style="font-size: 9px; line-height: 1.4; color: #64748B; border: 1.5px solid #E2E8F0; padding: 12px; border-radius: 8px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Important Transfer Notices</p>
        <p style="margin: 0;">1. Driver will hold a sign with the lead passenger's name at the designated arrivals exit or hotel lobby.</p>
        <p style="margin: 0;">2. Maximum waiting time for flight arrivals is 60 minutes after actual landing. Contact support if delayed in customs.</p>
        <p style="margin: 0;">3. For departure transfers, please be present at the hotel lobby 10 minutes prior to scheduled pickup time.</p>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel & Tours Ltd | Ground Operations and VIP Client Transfers</p>
        <p>We wish you a pleasant and comfortable ride!</p>
      </div>
    </div>
  `;
}

// 6. GENERATE SPECIAL SERVICE INVOICE
export function generateSpecialServiceInvoiceHtml(booking: any, service: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const services =
    service === "all" || !service
      ? booking.additionalServices || []
      : [service];

  const invoiceNo =
    service === "all" || !service
      ? `SVC-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `SVC-${service.id.substring(0, 8).toUpperCase()}`;

  const totalCost = services.reduce(
    (sum: number, s: any) => sum + (s.servicePrice || 0),
    0,
  );

  return `
    <div class="document-container">
      <div class="doc-header">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B;">
            Special Services & Tour Desks | Terrific Travel
          </p>
        </div>
        <div class="logos-block">
          ${BRAND_LOGOS.iataLogo}
          ${BRAND_LOGOS.atolLogo}
        </div>
      </div>

      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Special Service Invoice</h1>
          <span class="section-badge" style="background: #FCE7F3; color: #BE185D;">Status: Confirmed</span>
        </div>
        <div class="doc-meta">
          <p>Invoice No: <strong>${invoiceNo}</strong></p>
          <p>Date: <strong>${formatDate(new Date())}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Lead Passenger / Guest</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Fulfillment Details</h3>
          <p>Special Service Type: Additional / Custom Element</p>
          <p>Total Items: <strong>${services.length}</strong></p>
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Special Request & Service Details</h3>
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
          ${services
            .map(
              (s: any) => `
            <tr>
              <td><strong>${s.serviceName}</strong></td>
              <td>${s.customVendorName || s.vendor?.name || "Terrific Travel Direct Office"}</td>
              <td>${s.serviceDescription || "Custom service request confirmed by our booking agent."}</td>
              <td class="text-right"><strong>${formatCurrency(s.servicePrice)}</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="financial-panel">
        <table class="financial-table">
          <tr class="total-row">
            <td><strong>Total Special Service Price:</strong></td>
            <td class="text-right"><strong>${formatCurrency(totalCost)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel & Tours Ltd | Custom Travel Programs and Bespoke Luxury Services</p>
        <p>We are delighted to be part of your travel arrangements!</p>
      </div>
    </div>
  `;
}

// ──────────────────────────────────────────────────────────────────────────
// DB Template Renderers
// ──────────────────────────────────────────────────────────────────────────

export function renderBookingInvoice(
  templateHtml: string,
  booking: any,
): string {
  if (!templateHtml) return generateBookingInvoiceHtml(booking);

  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const formattedDeparture = formatDate(booking.departureDate);
  const invoiceNo = `INV-${booking.bookingReference || booking.id.substring(0, 8)}`;

  const flightsCost =
    booking.flightServices?.reduce(
      (sum: number, f: any) => sum + (f.price || 0),
      0,
    ) || 0;
  const hotelsCost =
    booking.accommodations?.reduce(
      (sum: number, h: any) => sum + (h.price || 0),
      0,
    ) || 0;
  const transportCost =
    booking.transportServices?.reduce(
      (sum: number, t: any) => sum + (t.price || 0),
      0,
    ) || 0;
  const visaCost =
    booking.visaServices?.reduce(
      (sum: number, v: any) => sum + (v.price || 0),
      0,
    ) || 0;
  const additionalCost =
    booking.additionalServices?.reduce(
      (sum: number, a: any) => sum + (a.servicePrice || 0),
      0,
    ) || 0;

  const totalCalculated =
    flightsCost + hotelsCost + transportCost + visaCost + additionalCost;
  const totalPrice = booking.totalPrice || totalCalculated;
  const paidAmount = booking.paidAmount || 0;
  const balanceDue = totalPrice - paidAmount;

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Customer"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
    ${leader && leader.passportNumber ? `<p>Passport No: ${leader.passportNumber}</p>` : ""}
  `;

  const agentBlock = `
    <p><strong>${booking.agent?.name || "Terrific Travel Direct Office"}</strong></p>
    <p>GDS System: ${booking.agent?.gdsSystem || "Amadeus/Sabre"}</p>
    <p>Assigned PCC: ${booking.agent?.pcc || "Direct Customer Support"}</p>
  `;

  const passengersRows =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
          .map(
            (p: any) => `
    <tr>
      <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
      <td>${p.age || "Adult"} (${p.role || "Passenger"})</td>
      <td>${p.passportNumber || "—"}</td>
      <td>${p.nationality || "—"}</td>
      <td>${p.passportExpiryDate ? formatDate(p.passportExpiryDate) : "—"}</td>
    </tr>
  `,
          )
          .join("")
      : `
    <tr>
      <td colspan="5" class="text-center" style="color: #64748B;">No passenger info added.</td>
    </tr>
  `;

  const servicesRows = [
    ...(booking.flightServices?.map(
      (f: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #0284C7;">FLIGHT</span></td>
        <td>Flight No: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"}) - ${f.departedFrom} to ${f.arrivedAt} on ${formatDate(f.date)}</td>
        <td class="text-right">${formatCurrency(f.price)}</td>
      </tr>
    `,
    ) || []),
    ...(booking.accommodations?.map(
      (h: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #10B981;">HOTEL</span></td>
        <td><strong>${h.hotelName}</strong> (${h.city || "—"}) - Room: ${h.roomType} x${h.qty} (${h.mealType || "Room Only"}), Confirmation #: ${h.hotelConfirmationNumber || "—"}</td>
        <td class="text-right">${formatCurrency(h.price)}</td>
      </tr>
    `,
    ) || []),
    ...(booking.transportServices?.map(
      (t: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #F59E0B;">TRANSFER</span></td>
        <td>${t.vehicleType} - From: ${t.departureDestination} to ${t.arrivalDestination} on ${formatDate(t.date)}</td>
        <td class="text-right">${formatCurrency(t.price)}</td>
      </tr>
    `,
    ) || []),
    ...(booking.visaServices?.map(
      (v: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #8B5CF6;">VISA</span></td>
        <td>Visa Type: ${v.visaType} (Passport: ${v.passportNumber}) - Visa Number: ${v.visaNumber || "—"}</td>
        <td class="text-right">${formatCurrency(v.price)}</td>
      </tr>
    `,
    ) || []),
    ...(booking.additionalServices?.map(
      (a: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #EC4899;">SPECIAL SERVICE</span></td>
        <td><strong>${a.serviceName}</strong> ${a.serviceDescription ? ` - ${a.serviceDescription}` : ""} ${a.customVendorName ? `(Vendor: ${a.customVendorName})` : ""}</td>
        <td class="text-right">${formatCurrency(a.servicePrice)}</td>
      </tr>
    `,
    ) || []),
  ].join("");

  const safeServicesRows =
    servicesRows ||
    `
    <tr>
      <td colspan="3" class="text-center" style="color: #64748B;">No service components registered.</td>
    </tr>
  `;

  let html = templateHtml;
  html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
  html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
  html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
  html = html.replace(/{{PAYMENT_STATUS}}/g, booking.paymentStatus || "UNPAID");
  html = html.replace(/{{INVOICE_NO}}/g, invoiceNo);
  html = html.replace(/{{TODAY}}/g, formatDate(new Date()));
  html = html.replace(/{{DATE}}/g, formatDate(new Date()));
  html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");
  html = html.replace(/{{DEPARTURE_DATE}}/g, formattedDeparture);
  html = html.replace(/{{LEAD_PASSENGER_BLOCK}}/g, leadPassengerBlock);
  html = html.replace(/{{AGENT_BLOCK}}/g, agentBlock);
  html = html.replace(/{{PASSENGERS_TABLE_ROWS}}/g, passengersRows);
  html = html.replace(/{{SERVICES_TABLE_ROWS}}/g, safeServicesRows);
  html = html.replace(/{{SUBTOTAL}}/g, formatCurrency(totalCalculated));
  html = html.replace(/{{TOTAL_PRICE}}/g, formatCurrency(totalPrice));
  html = html.replace(/{{PAID_AMOUNT}}/g, formatCurrency(paidAmount));
  html = html.replace(/{{BALANCE_DUE}}/g, formatCurrency(balanceDue));

  return html;
}

export function renderFlightTicket(
  templateHtml: string,
  booking: any,
  flight: any,
  selectedPassengerId?: string | null,
): string {
  if (!templateHtml || templateHtml.trim() === "{{FLIGHT_TICKET_PAGES}}") {
    return generateFlightTicketHtml(booking, flight, selectedPassengerId);
  }

  const passengers =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
      : [
          {
            firstName: "Valued",
            lastName: "Passenger",
            role: "Passenger",
            dateOfBirth: "",
          },
        ];

  const flightsToRender =
    booking.flightServices && booking.flightServices.length > 0
      ? booking.flightServices
      : [flight];

  const sortedFlights = [...flightsToRender].sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return (a.departTime || "").localeCompare(b.departTime || "");
  });

  const renderSingle = (p: any) => {
    let html = templateHtml;
    html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
    html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
    html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
    html = html.replace(/{{DATE}}/g, formatDate(new Date()));
    html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");

    const mainFlight = sortedFlights[0] || {};
    html = html.replace(
      /{{PNR}}/g,
      mainFlight.pnr || booking.bookingReference || "—",
    );
    html = html.replace(/{{FLIGHT_NO}}/g, mainFlight.flightNo || "—");
    html = html.replace(/{{DEPART_CODE}}/g, mainFlight.departedFrom || "—");
    html = html.replace(
      /{{DEPART_CITY}}/g,
      mainFlight.departedFromCity || mainFlight.departedFrom || "—",
    );
    html = html.replace(/{{DEPART_TIME}}/g, mainFlight.departTime || "—");
    html = html.replace(/{{ARRIVE_CODE}}/g, mainFlight.arrivedAt || "—");
    html = html.replace(
      /{{ARRIVE_CITY}}/g,
      mainFlight.arrivedAtCity || mainFlight.arrivedAt || "—",
    );
    html = html.replace(/{{ARRIVE_TIME}}/g, mainFlight.arriveTime || "—");
    html = html.replace(
      /{{FLIGHT_DATE}}/g,
      mainFlight.date ? formatDate(mainFlight.date) : "—",
    );
    html = html.replace(
      /{{FLIGHT_CLASS}}/g,
      mainFlight.flightClass || "Economy",
    );
    html = html.replace(/{{BAGGAGE}}/g, mainFlight.baggage || "23 KG");
    html = html.replace(/{{CARRY_ON}}/g, mainFlight.carryOn || "7 KG");

    html = html.replace(
      /{{PASSENGER_NAME}}/g,
      `${p.title || ""} ${p.firstName} ${p.lastName}`,
    );
    html = html.replace(
      /{{PASSENGER_DETAILS}}/g,
      `${p.age || "Adult"} · Passport: ${p.passportNumber || "—"}`,
    );
    html = html.replace(/{{SEAT}}/g, p.seat || "—");

    const passengerListHtml = passengers
      .map(
        (pass: any) => `
      <div class="passenger-row">
        <span><strong>${pass.title || ""} ${pass.firstName} ${pass.lastName}</strong></span>
        <span>${pass.age || "Adult"} · Passport: ${pass.passportNumber || "—"}</span>
        <span>Seat: ${pass.seat || "—"}</span>
      </div>
    `,
      )
      .join("");
    html = html.replace(/{{PASSENGERS_LIST_ROWS}}/g, passengerListHtml);

    return html;
  };

  if (!selectedPassengerId || selectedPassengerId === "all") {
    return passengers
      .map((p: any) => renderSingle(p))
      .join('<div style="page-break-after: always; height: 1px;"></div>');
  } else {
    const p = passengers.find((pass: any) => pass.id === selectedPassengerId);
    return renderSingle(p || passengers[0]);
  }
}

export function renderHotelVoucher(
  templateHtml: string,
  booking: any,
  hotel: any,
): string {
  if (!templateHtml) return generateHotelVoucherHtml(booking, hotel);

  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const voucherNo = `HTL-${hotel.id.substring(0, 8).toUpperCase()}`;

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Guest"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const hotelStayRow = `
    <tr>
      <td>
        <strong>${formatDate(hotel.checkInDate)}</strong><br>
        <span style="font-size: 9px; color: #64748B;">From: ${hotel.checkInTime || "16:00"}</span>
      </td>
      <td>
        <strong>${formatDate(hotel.checkOutDate)}</strong><br>
        <span style="font-size: 9px; color: #64748B;">Until: ${hotel.checkOutTime || "12:00"}</span>
      </td>
      <td><strong>${hotel.roomType}</strong></td>
      <td class="text-center">${hotel.qty || 1}</td>
      <td><span style="font-weight: 700; color: #10B981;">${hotel.mealType || "Room Only"}</span></td>
    </tr>
  `;

  const guestsRows =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
          .map(
            (p: any, idx: number) => `
    <tr>
      <td class="text-center">${idx + 1}</td>
      <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
      <td>${p.age || "Adult"}</td>
      <td>${p.nationality || "—"}</td>
    </tr>
  `,
          )
          .join("")
      : `
    <tr>
      <td colspan="4" class="text-center" style="color: #64748B;">No guests registered.</td>
    </tr>
  `;

  let html = templateHtml;
  html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
  html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
  html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
  html = html.replace(/{{VOUCHER_NO}}/g, voucherNo);
  html = html.replace(
    /{{ISSUE_DATE}}/g,
    hotel.issueDate ? formatDate(hotel.issueDate) : formatDate(new Date()),
  );
  html = html.replace(
    /{{DATE}}/g,
    hotel.issueDate ? formatDate(hotel.issueDate) : formatDate(new Date()),
  );
  html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");
  html = html.replace(
    /{{HOTEL_CONFIRMATION_NO}}/g,
    hotel.hotelConfirmationNumber || "CONFIRMED",
  );
  html = html.replace(/{{GDS_CODE}}/g, hotel.reservationNumber || "—");
  html = html.replace(/{{LEAD_PASSENGER_BLOCK}}/g, leadPassengerBlock);
  html = html.replace(
    /{{TOTAL_GUESTS}}/g,
    String(booking.passengers?.length || 1),
  );
  html = html.replace(/{{HOTEL_NAME}}/g, hotel.hotelName || "—");
  html = html.replace(/{{HOTEL_CITY}}/g, hotel.city || "—");
  html = html.replace(/{{HOTEL_ADDRESS}}/g, hotel.hotelAddress || "—");
  html = html.replace(/{{HOTEL_STAY_ROW}}/g, hotelStayRow);
  html = html.replace(/{{GUESTS_TABLE_ROWS}}/g, guestsRows);

  return html;
}

export function renderTransportVoucher(
  templateHtml: string,
  booking: any,
  transport: any,
): string {
  if (!templateHtml) return generateTransportVoucherHtml(booking, transport);

  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const transfers =
    transport === "all" || !transport
      ? booking.transportServices || []
      : [transport];

  const voucherNo =
    transport === "all" || !transport
      ? `TRN-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `TRN-${transport.id.substring(0, 8).toUpperCase()}`;

  const totalCost = transfers.reduce(
    (sum: number, t: any) => sum + (t.price || 0),
    0,
  );
  const issueDate =
    transport === "all" || !transport
      ? formatDate(new Date())
      : transport.issueDate
        ? formatDate(transport.issueDate)
        : formatDate(new Date());

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const transfersRows = transfers
    .map(
      (t: any) => `
    <tr>
      <td>
        <strong>${formatDate(t.date)}</strong><br/>
        <span style="font-size: 9px; color: #64748B;">Time: ${t.departureTime || "—"}</span>
      </td>
      <td><strong>${t.departureDestination}</strong></td>
      <td><strong>${t.arrivalDestination}</strong></td>
      <td>
        <span style="font-weight: 700; color: #0F172A;">${t.vehicleType}</span>
        ${t.flightNo ? `<br/><span style="font-size: 9px; color: #0284C7; font-weight: bold;">Flight: ${t.flightNo}</span>` : ""}
      </td>
      <td class="text-right"><strong>${formatCurrency(t.price)}</strong></td>
    </tr>
  `,
    )
    .join("");

  let html = templateHtml;
  html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
  html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
  html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
  html = html.replace(/{{VOUCHER_NO}}/g, voucherNo);
  html = html.replace(/{{ISSUE_DATE}}/g, issueDate);
  html = html.replace(/{{DATE}}/g, issueDate);
  html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");
  html = html.replace(/{{LEAD_PASSENGER_BLOCK}}/g, leadPassengerBlock);
  html = html.replace(/{{TOTAL_TRANSFERS}}/g, String(transfers.length));
  html = html.replace(/{{TRANSFERS_TABLE_ROWS}}/g, transfersRows);
  html = html.replace(/{{TOTAL_GROUND_COST}}/g, formatCurrency(totalCost));

  return html;
}

export function renderVisaInvoice(
  templateHtml: string,
  booking: any,
  visa: any,
): string {
  if (!templateHtml) return generateVisaInvoiceHtml(booking, visa);

  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const visas = visa === "all" || !visa ? booking.visaServices || [] : [visa];

  const invoiceNo =
    visa === "all" || !visa
      ? `VISA-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `VISA-${visa.id.substring(0, 8).toUpperCase()}`;

  const totalCost = visas.reduce(
    (sum: number, v: any) => sum + (v.price || 0),
    0,
  );
  const issueDate =
    visa === "all" || !visa
      ? formatDate(new Date())
      : visa.issueDate
        ? formatDate(visa.issueDate)
        : formatDate(new Date());

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Applicant"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const visasRows = visas
    .map(
      (v: any) => `
    <tr>
      <td><strong>${v.visaType}</strong></td>
      <td>${v.passportNumber}</td>
      <td>${v.visaNumber || "—"}</td>
      <td>${v.issueDate ? formatDate(v.issueDate) : "—"}</td>
      <td class="text-right"><strong>${formatCurrency(v.price)}</strong></td>
    </tr>
  `,
    )
    .join("");

  let html = templateHtml;
  html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
  html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
  html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
  html = html.replace(/{{INVOICE_NO}}/g, invoiceNo);
  html = html.replace(/{{ISSUE_DATE}}/g, issueDate);
  html = html.replace(/{{DATE}}/g, issueDate);
  html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");
  html = html.replace(/{{LEAD_PASSENGER_BLOCK}}/g, leadPassengerBlock);
  html = html.replace(/{{TOTAL_VISAS}}/g, String(visas.length));
  html = html.replace(/{{VISAS_TABLE_ROWS}}/g, visasRows);
  html = html.replace(/{{TOTAL_VISA_COST}}/g, formatCurrency(totalCost));

  return html;
}

export function renderSpecialServicesInvoice(
  templateHtml: string,
  booking: any,
  service: any,
): string {
  if (!templateHtml) return generateSpecialServiceInvoiceHtml(booking, service);

  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const services =
    service === "all" || !service
      ? booking.additionalServices || []
      : [service];

  const invoiceNo =
    service === "all" || !service
      ? `SVC-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : `SVC-${service.id.substring(0, 8).toUpperCase()}`;

  const totalCost = services.reduce(
    (sum: number, s: any) => sum + (s.servicePrice || 0),
    0,
  );

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const servicesRows = services
    .map(
      (s: any) => `
    <tr>
      <td><strong>${s.serviceName}</strong></td>
      <td>${s.customVendorName || s.vendor?.name || "Terrific Travel Direct Office"}</td>
      <td>${s.serviceDescription || "Custom service request confirmed by our booking agent."}</td>
      <td class="text-right"><strong>${formatCurrency(s.servicePrice)}</strong></td>
    </tr>
  `,
    )
    .join("");

  let html = templateHtml;
  html = html.replace(/{{COMPANY_LOGO}}/g, BRAND_LOGOS.companyLogo);
  html = html.replace(/{{IATA_LOGO}}/g, BRAND_LOGOS.iataLogo);
  html = html.replace(/{{ATOL_LOGO}}/g, BRAND_LOGOS.atolLogo);
  html = html.replace(/{{INVOICE_NO}}/g, invoiceNo);
  html = html.replace(/{{TODAY}}/g, formatDate(new Date()));
  html = html.replace(/{{DATE}}/g, formatDate(new Date()));
  html = html.replace(/{{BOOKING_REF}}/g, booking.bookingReference || "—");
  html = html.replace(/{{LEAD_PASSENGER_BLOCK}}/g, leadPassengerBlock);
  html = html.replace(/{{TOTAL_SERVICES}}/g, String(services.length));
  html = html.replace(/{{SERVICES_TABLE_ROWS}}/g, servicesRows);
  html = html.replace(/{{TOTAL_COST}}/g, formatCurrency(totalCost));

  return html;
}
