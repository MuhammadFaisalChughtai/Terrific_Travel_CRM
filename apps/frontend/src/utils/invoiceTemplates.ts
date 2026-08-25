import { formatCurrency } from "@tms/shared-utils";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function formatPassengerName(p: any): string {
  if (!p) return "";
  const title = (p.title || "").trim();
  const firstName = (p.firstName || "").trim();
  const lastName = (p.lastName || "").trim();
  const fullName = `${title} ${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
  return fullName.toUpperCase();
}

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
    </svg>
  `,
};

const parseTimeStr = (timeStr: string) => {
  if (!timeStr) return 0;
  const t = timeStr.trim().toUpperCase();
  const firstPart = t.split("-")[0].trim();
  const isPM = firstPart.includes("P");
  const isAM = firstPart.includes("A");
  let raw = firstPart.replace(/[APM:\s]/g, "");
  if (raw.indexOf(":") !== -1) {
    const parts = raw.split(":");
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  let rawDigits = firstPart.replace(/[APM:\s:]/g, "");
  if (rawDigits.length === 3) rawDigits = "0" + rawDigits;
  if (rawDigits.length < 4) {
    const parsed = parseInt(rawDigits, 10);
    return isNaN(parsed) ? 0 : parsed * 60;
  }
  let hours = parseInt(rawDigits.substring(0, 2), 10) || 0;
  const minutes = parseInt(rawDigits.substring(2, 4), 10) || 0;
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return hours * 60 + (isNaN(minutes) ? 0 : minutes);
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
  .timeline-badge.layover { border-color: #D97706; color: #D97706; background: #FFFBEB; }
  
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
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 16px 0;
    position: relative;
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

export function downloadDocument(htmlContent: string, filename: string) {
  const element = document.createElement("div");
  element.innerHTML = `
    <style>${SHARED_CSS}</style>
    <div style="padding: 10px;">
      ${htmlContent}
    </div>
  `;

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
  };

  html2pdf().set(opt).from(element).save();
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

function formatNotes(notesString: string | null | undefined): string {
  if (!notesString) return "";
  const trimmed = notesString.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        if ("actualNotes" in parsed) {
          return parsed.actualNotes || "";
        }
      }
    } catch (e) {
      // Ignore
    }
  }
  return notesString;
}

function generateTimelineHtml(booking: any): string {
  const items: any[] = [];

  const formatDate = (d: any) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter out cancelled flights for the main timeline
  const activeFlights = (booking.flightServices || []).filter(
    (f: any) => f.status !== "CANCELLED",
  );

  // Flights — grouped by PNR so each journey's layovers stay isolated
  if (activeFlights.length > 0) {
    // 1. Group by PNR key
    const flightGroups: { [key: string]: any[] } = {};
    activeFlights.forEach((f: any) => {
      const rawPnr = (f.pnr || "").trim();
      const pnrKey =
        !rawPnr ||
        rawPnr.toLowerCase() === "pending" ||
        rawPnr.toLowerCase() === "n/a"
          ? "No PNR Assigned"
          : rawPnr.toUpperCase();
      if (!flightGroups[pnrKey]) flightGroups[pnrKey] = [];
      flightGroups[pnrKey].push(f);
    });

    // 2. Sort flights within each group chronologically
    Object.keys(flightGroups).forEach((key) => {
      flightGroups[key].sort((a: any, b: any) => {
        const dA = new Date(a.date).getTime();
        const dB = new Date(b.date).getTime();
        if (dA !== dB) return dA - dB;
        const parseTime = (s: string) => {
          if (!s) return 0;
          const t = s.trim().toUpperCase();
          const isPM = t.includes("P");
          const isAM = t.includes("A");
          let raw = t.replace(/[APM:\s]/g, "");
          if (raw.length === 3) raw = "0" + raw;
          if (raw.length < 4) return 0;
          let h = parseInt(raw.substring(0, 2), 10);
          const m = parseInt(raw.substring(2, 4), 10);
          if (isPM && h < 12) h += 12;
          if (isAM && h === 12) h = 0;
          return h * 60 + (isNaN(m) ? 0 : m);
        };
        return parseTime(a.departTime) - parseTime(b.departTime);
      });
    });

    // 3. Order the groups by earliest departure date
    const sortedPnrKeys = Object.keys(flightGroups).sort((keyA, keyB) => {
      if (keyA === "No PNR Assigned") return 1;
      if (keyB === "No PNR Assigned") return -1;
      return (
        new Date(flightGroups[keyA][0].date).getTime() -
        new Date(flightGroups[keyB][0].date).getTime()
      );
    });

    // 4. Push each group with a header separator item
    const multipleGroups = sortedPnrKeys.length > 1;
    sortedPnrKeys.forEach((pnrKey) => {
      const groupFlights = flightGroups[pnrKey];

      // Insert a PNR_HEADER divider if there are multiple PNR groups
      if (multipleGroups) {
        const firstFlight = groupFlights[0];
        items.push({
          type: "PNR_HEADER",
          date: firstFlight.date
            ? new Date(firstFlight.date)
            : new Date(booking.createdAt),
          pnrKey,
          phase: 3.5, // between visa/special and flights
          // Anchor this header before the flight with its unique ID
          beforeFlightId: firstFlight.id,
        });
      }

      groupFlights.forEach((f: any, idx: number) => {
        const nextFlight = groupFlights[idx + 1];
        const isConnecting = getIsConnecting(f, nextFlight);
        const layoverStr =
          isConnecting && nextFlight ? calculateLayover(f, nextFlight) : "";

        const extractCode = (str: string) => {
          const match = str.match(/\(([^)]+)\)/);
          return match ? match[1].toUpperCase() : str.toUpperCase();
        };
        const transitHub = extractCode(f.arrivedAt || "");

        const isCancelled = f.status === "CANCELLED";
        const strikeStyle = isCancelled
          ? 'style="text-decoration: line-through; opacity: 0.5;"'
          : "";
        const statusText = isCancelled ? "Cancelled" : "Confirmed";
        const statusBadge = `<span class="timeline-badge-status ${isCancelled ? "cancelled" : "confirmed"}" style="margin-left: 8px; vertical-align: middle;">${statusText}</span>`;

        items.push({
          type: "FLIGHT",
          id: f.id,
          date: f.date ? new Date(f.date) : new Date(booking.createdAt),
          title: `<span ${strikeStyle}>${f.flightType || "Outbound"} Flight: ${f.departedFrom} to ${f.arrivedAt}</span>${statusBadge}`,
          icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.4.5l-.3.3c-.4.4-.4 1.1 0 1.5L9 12l-5.5 5.5H2v2l2 2h2v-1.5L11.5 15l3.5 5.7c.4.4 1.1.4 1.5 0l.3-.3c.4-.3.6-.9.5-1.4Z"/></svg>`,
          badgeClass: "flight",
          details: `
            <div class="timeline-detail-item" ${strikeStyle}>Flight: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"})</div>
            <div class="timeline-detail-item" ${strikeStyle}>Departure: <strong>${f.departTime || "—"}</strong> | Arrival: <strong>${f.arrivalTime || "—"}</strong></div>
            <div class="timeline-detail-item" ${strikeStyle}>Class: <strong>${f.flightClass || "Economy"}</strong> | Baggage: <strong>${f.baggage || "23 KG"}</strong></div>
          `,
          notes: f.notes,
        });

        if (
          isConnecting &&
          layoverStr &&
          f.status !== "CANCELLED" &&
          (!nextFlight || nextFlight.status !== "CANCELLED")
        ) {
          const layoverDate = f.date
            ? new Date(new Date(f.date).getTime() + 1000)
            : new Date(new Date(booking.createdAt).getTime() + 1000);
          items.push({
            type: "LAYOVER",
            date: layoverDate,
            title: `Transit Connection at ${transitHub}`,
            icon: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:block; color:#D97706;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
            badgeClass: "layover",
            details: `Connection layover of <strong>${layoverStr}</strong> before the next flight.`,
            notes: "",
            isLayoverCard: true,
            // Match against the unique flight ID
            afterFlightId: f.id,
          });
        }
      });
    });
  }

  // Accommodations
  if (booking.accommodations && booking.accommodations.length > 0) {
    booking.accommodations.forEach((h: any) => {
      const checkIn = h.checkInDate
        ? new Date(h.checkInDate)
        : new Date(booking.createdAt);
      const checkOut = h.checkOutDate
        ? new Date(h.checkOutDate)
        : new Date(booking.createdAt);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      items.push({
        type: "HOTEL",
        date: checkIn,
        title: `Hotel Check-In: ${h.hotelName}`,
        icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M18 22V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M4 22h16"/><path d="M10 14a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v8H10Z"/><path d="M12 2v4"/><path d="M8 5h8"/></svg>`,
        badgeClass: "hotel",
        details: `
          <div class="timeline-detail-item">Room: <strong>${h.roomType} x${h.qty || 1}</strong> (${h.mealType || "Room Only"})</div>
          <div class="timeline-detail-item">Stay: <strong>${nights} Night(s)</strong> | Check-Out: <strong>${formatDate(checkOut)}</strong></div>
          <div class="timeline-detail-item">City: <strong>${h.city || "—"}</strong> | Conf #: <strong>${h.hotelConfirmationNumber || "—"}</strong></div>
        `,
        notes: h.notes,
      });
    });
  }

  // Transports
  if (booking.transportServices && booking.transportServices.length > 0) {
    booking.transportServices.forEach((t: any) => {
      items.push({
        type: "TRANSFER",
        date: t.date ? new Date(t.date) : new Date(booking.createdAt),
        title: `Ground Transfer: ${t.departureDestination} to ${t.arrivalDestination}`,
        icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 21h14"/><path d="M9 13h6"/></svg>`,
        badgeClass: "transfer",
        details: `
          <div class="timeline-detail-item">Vehicle: <strong>${t.vehicleType}</strong> | Pickup Time: <strong>${t.departureTime || t.arrivalTime || "—"}</strong></div>
          <div class="timeline-detail-item">Flight Ref: <strong>${t.flightNo || "—"}</strong></div>
        `,
        notes: t.notes,
      });
    });
  }

  // Visas
  if (booking.visaServices && booking.visaServices.length > 0) {
    const visaGroups: Record<string, any[]> = {};
    booking.visaServices.forEach((v: any) => {
      const key = v.visaType || "Unknown Visa";
      if (!visaGroups[key]) visaGroups[key] = [];
      visaGroups[key].push(v);
    });

    Object.values(visaGroups).forEach((group: any[]) => {
      const v = group[0];
      const count = group.length;
      items.push({
        type: "VISA",
        date: v.issueDate ? new Date(v.issueDate) : new Date(booking.createdAt),
        title:
          count > 1
            ? `Visa Application: ${v.visaType} (x${count})`
            : `Visa Application: ${v.visaType}`,
        icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
        badgeClass: "visa",
        details: `
          <div class="timeline-detail-item">Status: <strong>Processed</strong></div>
        `,
        notes: v.notes,
      });
    });
  }

  // Special/Additional Services
  if (booking.additionalServices && booking.additionalServices.length > 0) {
    booking.additionalServices.forEach((a: any) => {
      items.push({
        type: "SPECIAL_SERVICE",
        date: a.createdAt ? new Date(a.createdAt) : new Date(booking.createdAt),
        title: `Special Service: ${a.serviceName}`,
        icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
        badgeClass: "special",
        details: `
          <div class="timeline-detail-item">Description: <strong>${a.serviceDescription || "—"}</strong></div>
        `,
        notes: a.notes,
      });
    });
  }

  if (items.length === 0) {
    return `<div class="text-center" style="color: #64748B; padding: 24px; background: #F8FAFC; border: 1px dashed #E2E8F0; border-radius: 8px;">No travel itinerary components registered.</div>`;
  }

  // Separate layover cards AND PNR headers from regular items so that
  // chronological sort does not displace them from their adjacent segments.
  const layoverCards = items.filter((i) => i.isLayoverCard);
  const pnrHeaders = items.filter((i) => i.type === "PNR_HEADER");
  const regularItems = items.filter(
    (i) => !i.isLayoverCard && i.type !== "PNR_HEADER",
  );

  // 1. Assign a base sorting date, parse exact time if available, and assign fallback phase
  regularItems.forEach((item) => {
    item.sortDate = new Date(item.date);

    if (item.type === "FLIGHT") {
      const match = item.details.match(
        /Departure: <strong>([0-9]{2}:[0-9]{2})/,
      );
      if (match) {
        const [h, m] = match[1].split(":");
        item.sortDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      }
      item.phase = 4;
    } else if (item.type === "TRANSFER") {
      const match = item.details.match(
        /Pickup Time: <strong>([0-9]{2}:[0-9]{2})/,
      );
      if (match) {
        const [h, m] = match[1].split(":");
        item.sortDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
      }
      item.phase = 3;
    } else if (item.type === "HOTEL") {
      item.sortDate.setHours(23, 59, 0, 0); // Default hotel check-in to end of the day
      item.phase = 5;
    } else if (item.type === "VISA") {
      item.sortDate.setHours(0, 0, 0, 0); // Default visas to start of day
      item.phase = 1;
    } else if (item.type === "SPECIAL_SERVICE") {
      item.sortDate.setHours(12, 0, 0, 0); // Default special services to mid-day
      item.phase = 2;
    } else {
      item.phase = 9;
    }
  });

  // 2. Sort by exact datetime first, then by phase if datetimes are identical
  regularItems.sort((a, b) => {
    const timeDiff = a.sortDate.getTime() - b.sortDate.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.phase - b.phase;
  });

  // Re-insert each layover card immediately AFTER the flight it belongs to.
  // Re-insert each PNR header immediately BEFORE the first flight of its group.
  // Both match by the unique flight ID to remain robust against chronological sorting.
  const orderedItems: any[] = [];
  regularItems.forEach((item) => {
    if (item.type === "FLIGHT") {
      // Insert PNR header before this flight if matched by flight ID
      pnrHeaders
        .filter((ph) => ph.beforeFlightId === item.id)
        .forEach((ph) => orderedItems.push(ph));
      orderedItems.push(item);
      // Insert any layover card whose `afterFlightId` matches this flight
      layoverCards
        .filter((lc) => lc.afterFlightId === item.id)
        .forEach((lc) => orderedItems.push(lc));
    } else {
      orderedItems.push(item);
    }
  });

  return `
    <div class="timeline-container">
      ${orderedItems
        .map((item) => {
          if (item.type === "PNR_HEADER") {
            const label =
              item.pnrKey === "No PNR Assigned"
                ? "No PNR Assigned"
                : `Journey · PNR: <strong style="color:#0F172A;">${item.pnrKey}</strong>`;
            return `
              <div style="display:flex; align-items:center; gap:8px; margin: 16px 0 8px; padding: 6px 12px; background: linear-gradient(90deg,#EFF6FF,#F8FAFC); border-left: 3px solid #3B82F6; border-radius: 0 6px 6px 0;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.4.5l-.3.3c-.4.4-.4 1.1 0 1.5L9 12l-5.5 5.5H2v2l2 2h2v-1.5L11.5 15l3.5 5.7c.4.4 1.1.4 1.5 0l.3-.3c.4-.3.6-.9.5-1.4Z"/></svg>
                <span style="font-size:10px; font-weight:700; color:#1E40AF; text-transform:uppercase; letter-spacing:0.06em;">${label}</span>
              </div>
            `;
          }

          if (item.isLayoverCard) {
            return `
              <div class="timeline-item">
                <div class="timeline-badge layover">${item.icon}</div>
                <div class="timeline-card" style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 8px; padding: 8px 16px;">
                  <div style="font-weight: 800; color: #78350F; font-size: 11px; display: flex; align-items: center; gap: 6px;">
                    ${item.title}
                  </div>
                  <div style="margin-top: 4px; font-size: 10px; color: #B45309;">
                    ${item.details}
                  </div>
                </div>
              </div>
              `;
          }

          const formattedNotesText = formatNotes(item.notes);

          return `
            <div class="timeline-item">
              <div class="timeline-badge ${item.badgeClass}">${item.icon}</div>
              <div class="timeline-card">
                <div class="timeline-card-header">
                  <div class="timeline-title">${item.title}</div>
                  <div class="timeline-date">${formatDate(item.date)}</div>
                </div>
                <div class="timeline-grid">${item.details}</div>
                ${
                  formattedNotesText
                    ? `<div style="margin-top: 8px; font-size: 9px; color: #64748B; font-style: italic; background: #FFFFFF; padding: 6px; border-radius: 4px; border: 1px solid #E2E8F0;">Notes: ${formattedNotesText}</div>`
                    : ""
                }
              </div>
            </div>
            `;
        })
        .join("")}
    </div>
  `;
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
  const balanceDue = Math.max(0, totalPrice - paidAmount);

  return `
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

      <div class="info-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
        <div class="info-box">
          <h3>Lead Passenger / Client</h3>
          <p><strong>${leader ? formatPassengerName(leader) : "VALUED CUSTOMER"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Agent / Account Executive</h3>
          <p><strong>${booking.agent?.name || "Terrific Travel Direct Office"}</strong></p>
          ${booking.agent?.phoneNumber ? `<p>Phone: ${booking.agent.phoneNumber}</p>` : ""}
          ${booking.agent?.email ? `<p>Email: ${booking.agent.email}</p>` : ""}
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
          ${
            booking.passengers && booking.passengers.length > 0
              ? booking.passengers
                  .map(
                    (p: any) => `
            <tr>
              <td><strong>${formatPassengerName(p)}</strong></td>
              <td>${p.age || "Adult"} (${p.role || "Passenger"})</td>
              <td>${p.nationality || "—"}</td>
            </tr>
          `,
                  )
                  .join("")
              : `
            <tr>
              <td colspan="3" class="text-center" style="color: #64748B;">No passenger info added.</td>
            </tr>
          `
          }
        </tbody>
      </table>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 16px;">Dynamic Trip Itinerary &amp; Timeline</h3>
      ${generateTimelineHtml(booking)}

      <div class="financial-panel">
        <table class="financial-table">
          <tr>
            <td>Total Invoice Amount:</td>
            <td class="text-right"><strong>${formatCurrency(totalPrice)}</strong></td>
          </tr>
          <tr>
            <td>Total Amount Received:</td>
            <td class="text-right" style="color: #16A34A; font-weight: bold;">${formatCurrency(paidAmount)}</td>
          </tr>
          <tr class="due-row">
            <td><strong>Remaining Balance Due:</strong></td>
            <td class="text-right"><strong>${formatCurrency(balanceDue)}</strong></td>
          </tr>
        </table>
      </div>

      ${(() => {
        const cancelledFlights = (booking.flightServices || []).filter(
          (f: any) => f.status === "CANCELLED",
        );
        if (cancelledFlights.length === 0) return "";
        return `
            <div class="cancelled-flights-section" style="margin-top: 24px; margin-bottom: 24px; padding: 16px; background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; page-break-inside: avoid;">
              <h3 style="margin-top: 0; margin-bottom: 12px; font-family: 'Outfit', sans-serif; font-size: 11px; color: #991B1B; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #FCA5A5; padding-bottom: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #DC2626; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancelled Flight Services &amp; Routing
              </h3>
              <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                ${cancelledFlights
                  .map(
                    (f: any) => `
                    <div style="padding: 10px 12px; background: #FFFFFF; border: 1px solid #FEE2E2; border-radius: 6px; display: flex; align-items: center;">
                      <div>
                        <span style="font-size: 8px; font-weight: 700; color: #DC2626; text-transform: uppercase; background: #FEE2E2; padding: 2px 6px; border-radius: 4px; margin-right: 8px; display: inline-block; vertical-align: middle;">Cancelled</span>
                        <strong style="font-size: 11px; color: #475569; display: inline-block; vertical-align: middle;">${f.flightType || "Outbound"} Flight: ${f.departedFrom} to ${f.arrivedAt}</strong>
                        <div style="font-size: 9px; color: #94A3B8; margin-top: 4px;">
                          Flight No: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"}) | 
                          Departure: <strong>${f.departTime || "—"}</strong> | Arrival: <strong>${f.arrivalTime || "—"}</strong> | 
                          Date: <strong>${formatDate(f.date)}</strong>
                        </div>
                      </div>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>
          `;
      })()}

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
          <p>Flight bookings are protected under the UK Civil Aviation Authority ATOL scheme and fully backed by our IATA credentials. Travel insurance is highly recommended for all overseas bookings.</p>
        </div>
        <div class="terms-card">
          <h4>⚖️ Disclaimer</h4>
          <p>Terrific Travel acts as an intermediary agent and shall not be held liable for personal injury, property loss, delays, cancellations, or defaults caused by airlines, hotels, or other service providers.</p>
        </div>
      </div>

      <div class="signature-block" style="margin-top: 40px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 20px; page-break-inside: avoid;">
        <div style="width: 250px;">
          <div style="border-bottom: 1px solid #94A3B8; height: 40px; margin-bottom: 8px;"></div>
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #475569;">Customer Signature</p>
          <p style="margin: 2px 0 0 0; font-size: 9px; color: #94A3B8;">I agree to all Terms &amp; Conditions</p>
        </div>
        <div style="width: 250px; text-align: right;">
          <div style="border-bottom: 1px solid #94A3B8; height: 40px; margin-bottom: 8px; position: relative;">
            <span style="position: absolute; bottom: 4px; right: 0; font-family: 'Brush Script MT', cursive; font-size: 24px; color: #0F172A; opacity: 0.8; font-style: italic;">Terrific Travel</span>
          </div>
          <p style="margin: 0; font-size: 11px; font-weight: bold; color: #475569;">Authorized Signatory</p>
          <p style="margin: 2px 0 0 0; font-size: 9px; color: #94A3B8;">Terrific Travel &amp; Tours Ltd</p>
        </div>
      </div>

      <div class="doc-footer">
        <p>Terrific Travel &amp; Tours Ltd | Registered in England &amp; Wales</p>
        <p>Thank you for choosing Terrific Travel. We wish you an amazing journey!</p>
      </div>
    </div>
  `;
}


function getIsConnecting(currentFlight: any, nextFlight: any): boolean {
  if (!nextFlight) return false;

  // 1. Explicit check: notes metadata
  if (currentFlight.notes) {
    try {
      const parsed = JSON.parse(currentFlight.notes);
      if (parsed.hasOwnProperty("isConnecting")) {
        return !!parsed.isConnecting;
      }
    } catch (e) {
      // Not JSON
    }
  }

  // 2. Implicit check: if arrival airport code matches next departure airport code
  // and the departure is within 24 hours of arrival
  const arrAirport = (currentFlight.arrivedAt || "").trim().toUpperCase();
  const nextDepAirport = (nextFlight.departedFrom || "").trim().toUpperCase();

  // Extract airport code if it is in format "Name (Code)" or "Code"
  const extractCode = (str: string) => {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1].toUpperCase() : str.toUpperCase();
  };

  const codeA = extractCode(arrAirport);
  const codeB = extractCode(nextDepAirport);

  if (codeA && codeB && codeA === codeB) {
    try {
      let arrDateStr = currentFlight.date;
      if (currentFlight.notes) {
        try {
          const parsed = JSON.parse(currentFlight.notes);
          if (parsed.arrivalDate) arrDateStr = parsed.arrivalDate;
        } catch (e) {}
      }
      const arrDate = new Date(arrDateStr);
      const depDate = new Date(nextFlight.date);

      const [arrH, arrM] = (currentFlight.arrivalTime || "00:00")
        .split(":")
        .map(Number);
      const [depH_arrSeg, depM_arrSeg] = (currentFlight.departTime || "00:00")
        .split(":")
        .map(Number);
      const [depH, depM] = (nextFlight.departTime || "00:00")
        .split(":")
        .map(Number);

      const arrTime = new Date(
        arrDate.getFullYear(),
        arrDate.getMonth(),
        arrDate.getDate(),
        arrH,
        arrM,
      );

      const isSameDate =
        new Date(arrDateStr).toDateString() ===
        new Date(currentFlight.date).toDateString();
      // If arrival time is earlier in the day than departure time of the same flight,
      // and they are currently evaluated on the same date, it means it landed the next day.
      if (
        isSameDate &&
        (arrH < depH_arrSeg || (arrH === depH_arrSeg && arrM < depM_arrSeg))
      ) {
        arrTime.setDate(arrTime.getDate() + 1);
      }

      const depTime = new Date(
        depDate.getFullYear(),
        depDate.getMonth(),
        depDate.getDate(),
        depH,
        depM,
      );

      const diffMs = depTime.getTime() - arrTime.getTime();
      // If it's positive and under 24 hours, it's a layover!
      return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000;
    } catch (e) {
      return false;
    }
  }

  return false;
}

function calculateLayover(arrivalSeg: any, departSeg: any): string {
  try {
    let arrDateStr = arrivalSeg.date;
    if (arrivalSeg.notes) {
      try {
        const parsed = JSON.parse(arrivalSeg.notes);
        if (parsed.arrivalDate) arrDateStr = parsed.arrivalDate;
      } catch (e) {}
    }
    const arrDate = new Date(arrDateStr);
    const depDate = new Date(departSeg.date);

    const [arrH, arrM] = (arrivalSeg.arrivalTime || "00:00")
      .split(":")
      .map(Number);
    const [depH_arrSeg, depM_arrSeg] = (arrivalSeg.departTime || "00:00")
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

    const isSameDate =
      new Date(arrDateStr).toDateString() ===
      new Date(arrivalSeg.date).toDateString();
    // If arrival time is earlier in the day than departure time of the same flight,
    // and they are currently evaluated on the same date, it means the flight landed the next day.
    if (
      isSameDate &&
      (arrH < depH_arrSeg || (arrH === depH_arrSeg && arrM < depM_arrSeg))
    ) {
      arrTime.setDate(arrTime.getDate() + 1);
    }

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

function getAirlineName(flightNo: string): string {
  if (!flightNo) return "Airline Partner";
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
}

// Helper to resolve specific passenger PNR
function getPassengerPnr(passenger: any, flight: any): string {
  if (passenger?.eticket) {
    const raw = String(passenger.eticket).trim();
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const map = JSON.parse(raw);
        const flightCarrier = (flight?.flightNo || "").substring(0, 2).toUpperCase();
        const flightAirlineName = getAirlineName(flight?.flightNo);
        const flightPnr = (flight?.pnr || "").trim().toUpperCase();
        const depCode = (flight?.departedFrom || "").match(/\(([^)]+)\)/)?.[1] || "";
        const arrCode = (flight?.arrivedAt || "").match(/\(([^)]+)\)/)?.[1] || "";

        let bestVal: any = null;
        let highestScore = -1;

        for (const [key, val] of Object.entries(map)) {
          if (!val) continue;
          const kUpper = key.toUpperCase();
          let score = 0;

          // 1. PNR Match (+100)
          if (flightPnr && flightPnr.length >= 2 && kUpper.includes(flightPnr)) {
            score += 100;
          }
          // 2. Route Sector Match (+30)
          if (depCode && arrCode && kUpper.includes(depCode.toUpperCase()) && kUpper.includes(arrCode.toUpperCase())) {
            score += 30;
          }
          // 3. Airline / Carrier Match (+10)
          if (
            (flightAirlineName && kUpper.includes(flightAirlineName.toUpperCase())) ||
            (flightCarrier && kUpper.includes(flightCarrier))
          ) {
            score += 10;
          }

          if (score > highestScore && score > 0) {
            highestScore = score;
            bestVal = val;
          }
        }

        if (bestVal) {
          if (typeof bestVal === "object" && bestVal !== null && (bestVal as any).pnr) {
            return String((bestVal as any).pnr);
          }
          if (typeof bestVal === "string") return bestVal;
        }

        for (const val of Object.values(map)) {
          if (typeof val === "object" && val !== null && (val as any).pnr) {
            return String((val as any).pnr);
          }
        }
      } catch (e) {
        // Fall back
      }
    }
  }
  return flight?.pnr || "—";
}

// Helper to generate deterministic realistic e-ticket number
function getTicketNumber(
  passenger: any,
  flight: any,
  passengerIndex: number = 0,
): string {
  if (passenger?.eticket) {
    const raw = String(passenger.eticket).trim();
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const map = JSON.parse(raw);
        const flightCarrier = (flight?.flightNo || "").substring(0, 2).toUpperCase();
        const flightAirlineName = getAirlineName(flight?.flightNo);
        const flightPnr = (flight?.pnr || "").trim().toUpperCase();
        const depCode = (flight?.departedFrom || "").match(/\(([^)]+)\)/)?.[1] || "";
        const arrCode = (flight?.arrivedAt || "").match(/\(([^)]+)\)/)?.[1] || "";

        let bestVal: any = null;
        let highestScore = -1;

        for (const [key, val] of Object.entries(map)) {
          if (!val) continue;
          const kUpper = key.toUpperCase();
          let score = 0;

          if (flightPnr && flightPnr.length >= 2 && kUpper.includes(flightPnr)) {
            score += 100;
          }
          if (depCode && arrCode && kUpper.includes(depCode.toUpperCase()) && kUpper.includes(arrCode.toUpperCase())) {
            score += 30;
          }
          if (
            (flightAirlineName && kUpper.includes(flightAirlineName.toUpperCase())) ||
            (flightCarrier && kUpper.includes(flightCarrier))
          ) {
            score += 10;
          }

          if (score > highestScore && score > 0) {
            highestScore = score;
            bestVal = val;
          }
        }

        if (bestVal) {
          if (typeof bestVal === "object" && bestVal !== null) {
            return String((bestVal as any).eticket || "");
          }
          return String(bestVal);
        }

        const firstVal = Object.values(map).find((v) => !!v);
        if (firstVal) {
          if (typeof firstVal === "object" && firstVal !== null) {
            return String((firstVal as any).eticket || "");
          }
          return String(firstVal);
        }
      } catch (e) {
        // Fall back to raw string
      }
    }
    const list = raw.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
    if (list.length > 1) {
      if (passengerIndex < list.length) {
        return list[passengerIndex];
      }
      return list[0];
    }
    return raw;
  }
  if (passenger?.ticketNo) return passenger.ticketNo;

  const rawFlightTickets = flight?.confirmationNumber || flight?.eTicket;
  if (rawFlightTickets) {
    const list = String(rawFlightTickets)
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length > 0) {
      if (passengerIndex < list.length) {
        return list[passengerIndex];
      }
      return list[0];
    }
  }

  const nameCode =
    ((passenger?.firstName || "").length * 7 +
      (passenger?.lastName || "").length * 3) %
    1000000;
  const passIdCode = passenger?.id
    ? parseInt(passenger.id.replace(/[^0-9]/g, "").substring(0, 7)) || 1234567
    : 1234567;
  const num = String((nameCode * passIdCode) % 1000000000).padStart(9, "0");

  const flightCarrier = (flight?.flightNo || "").substring(0, 2).toUpperCase();
  let prefix = "157"; // Qatar Airways
  if (flightCarrier === "EK") prefix = "176";
  else if (flightCarrier === "BA") prefix = "125";
  else if (flightCarrier === "SV") prefix = "065";
  else if (flightCarrier === "WY") prefix = "910";
  else if (flightCarrier === "PC") prefix = "281";
  else if (flightCarrier === "W9" || flightCarrier === "W6") prefix = "953";

  return `${prefix}${num}`;
}

function generateConsolidatedTicketHtml(
  booking: any,
  passengersList: any[],
  flights: any[],
  groupByNationality: boolean = false,
) {
  const primaryPax = passengersList[0] || {};
  const ticketNo = primaryPax
    ? getTicketNumber(primaryPax, flights[0] || {})
    : "—";
  const pnr = flights[0]?.pnr || booking.bookingReference || "—";
  const issueDate = flights[0]?.issueDate
    ? formatDate(flights[0].issueDate)
    : formatDate(booking.createdAt || new Date());

  let passengerSectionHtml = "";

  if (groupByNationality) {
    const groups: { [key: string]: any[] } = {};
    passengersList.forEach((p: any) => {
      const nat = (p.nationality || "Unspecified").toUpperCase();
      if (!groups[nat]) groups[nat] = [];
      groups[nat].push(p);
    });

    passengerSectionHtml = `
      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 8px;">Passenger Details (Grouped by Nationality)</h3>
      ${Object.entries(groups)
        .map(
          ([nat, groupPax]) => `
        <div style="margin-top: 10px; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #0EA5E9; padding-bottom: 3px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; color: #0EA5E9; margin: 0; text-transform: uppercase;">
            🌐 Nationality: ${nat} (${groupPax.length} ${groupPax.length === 1 ? "Passenger" : "Passengers"})
          </h4>
        </div>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px;">
          <thead>
            <tr style="background: #0F172A; color: #FFFFFF; text-align: left;">
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">PAX Type</th>
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">Passenger Name</th>
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">Nationality</th>
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">PNR</th>
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">E-Ticket Number</th>
              <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">Agency IATA</th>
            </tr>
          </thead>
          <tbody>
            ${groupPax
              .map(
                (p: any, idx: number) => `
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 6px 10px; text-transform: uppercase; font-weight: bold; color: #334155;">${p.role || deriveAgeCategory(p.dateOfBirth)}</td>
                <td style="padding: 6px 10px; color: #0F172A; text-transform: uppercase;"><strong>${formatPassengerName(p)}</strong></td>
                <td style="padding: 6px 10px; color: #475569; font-weight: bold;">${p.nationality || "—"}</td>
                <td style="padding: 6px 10px; color: #0EA5E9; font-family: monospace; font-size: 11px; font-weight: bold;">${getPassengerPnr(p, flights[0] || {})}</td>
                <td style="padding: 6px 10px; color: #0284C7; font-family: monospace; font-size: 11px; font-weight: bold;">${getTicketNumber(p, flights[0] || {}, idx)}</td>
                <td style="padding: 6px 10px; color: #475569;">91263712</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `,
        )
        .join("")}
    `;
  } else {
    passengerSectionHtml = `
      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 8px;">Passenger Details</h3>
      <table class="data-table" style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10px;">
        <thead>
          <tr style="background: #0F172A; color: #FFFFFF; text-align: left;">
            <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">PAX Type</th>
            <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">Passenger Name</th>
            <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">PNR</th>
            <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">E-Ticket Number</th>
            <th style="padding: 6px 10px; font-size: 9px; text-transform: uppercase;">Agency IATA</th>
          </tr>
        </thead>
        <tbody>
          ${passengersList
            .map(
              (p: any, idx: number) => `
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 6px 10px; text-transform: uppercase; font-weight: bold; color: #334155;">${p.role || deriveAgeCategory(p.dateOfBirth)}</td>
              <td style="padding: 6px 10px; color: #0F172A; text-transform: uppercase;"><strong>${formatPassengerName(p)}</strong></td>
              <td style="padding: 6px 10px; color: #0EA5E9; font-family: monospace; font-size: 11px; font-weight: bold;">${getPassengerPnr(p, flights[0] || {})}</td>
              <td style="padding: 6px 10px; color: #0284C7; font-family: monospace; font-size: 11px; font-weight: bold;">${getTicketNumber(p, flights[0] || {}, idx)}</td>
              <td style="padding: 6px 10px; color: #475569;">91263712</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  return `
    <div class="document-container" style="padding: 16px 20px; max-width: 850px; margin: 0 auto; background: #ffffff;">
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 16px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 6px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 7888 461474<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            IATA: 91263712  
          </p>
        </div>
        <div style="display: flex; align-items: center; height: 50px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
        </div>
      </div>

      <div class="doc-title-section" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <h1 class="doc-title" style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: #0F172A; margin: 0;">Flight Ticket / Itinerary</h1>
          <span class="section-badge" style="background: #E0F2FE; color: #0369A1; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 99px; text-transform: uppercase;">Status: Issued</span>
        </div>
        <div class="doc-meta" style="text-align: right; font-size: 10px; color: #475569;">
          <p style="margin: 0;">Booking Ref: <strong>${booking.bookingReference || "—"}</strong></p>
          <p style="margin: 2px 0 0 0;">Supplier Ref (PNR): <strong style="font-family: monospace; font-size: 12px; color: #0EA5E9;">${pnr}</strong></p>
          <p style="margin: 2px 0 0 0;">Issue Date: <strong>${issueDate}</strong></p>
        </div>
      </div>

      ${passengerSectionHtml}

      <!-- Flight Segments Section -->
      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 10px; font-weight: 800; color: #0F172A; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px;">Flight Itinerary Segments</h3>

      ${flights
        .map((f: any, idx: number) => {
          const nextFlight = flights[idx + 1];
          const isConnecting = getIsConnecting(f, nextFlight);
          const layoverStr =
            isConnecting && nextFlight ? calculateLayover(f, nextFlight) : "";

          const depDateStr = formatDate(f.date);
          let flightArrDate = f.arrivalDate || f.date;
          if (f.notes) {
            try {
              const parsed = JSON.parse(f.notes);
              if (parsed.arrivalDate) {
                flightArrDate = parsed.arrivalDate;
              }
            } catch (e) {}
          }
          const arrDateStr = formatDate(flightArrDate);

          // Extract codes and names for professional layout
          const extractCode = (str: string) => {
            const match = str.match(/\(([^)]+)\)/);
            return match ? match[1].toUpperCase() : str.toUpperCase();
          };
          const extractName = (str: string) => {
            const match = str.match(/(.*?)\s*\(([^)]+)\)/);
            return match ? match[1].trim() : str;
          };

          const depCode = extractCode(f.departedFrom || "");
          const depName = extractName(f.departedFrom || "");
          const arrCode = extractCode(f.arrivedAt || "");
          const arrName = extractName(f.arrivedAt || "");
          const transitHub = extractCode(f.arrivedAt || "");

          let depTerminal = "";
          let arrTerminal = "";
          if (f.notes) {
            try {
              const parsed = JSON.parse(f.notes);
              depTerminal = parsed.depTerminal || "";
              arrTerminal = parsed.arrTerminal || "";
            } catch (e) {
              // ignore
            }
          }

          const segmentETicket = f.confirmationNumber || f.eTicket || ticketNo;

          return `
          <div class="ticket-card" style="border: 1px solid #E2E8F0; margin-bottom: 14px; border-radius: 6px; overflow: hidden; background: #FFFFFF;">
            <div class="ticket-card-header" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 900; color: #FFFFFF; font-size: 11px; display: flex; align-items: center; gap: 6px;">
                <span style="background: #0EA5E9; color: #FFFFFF; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; text-transform: uppercase;">Segment #${idx + 1}</span>
                <span>${f.flightNo}</span>
              </div>
              <div style="font-size: 10px; font-weight: 800; font-family: monospace; color: #38BDF8; background: rgba(56, 189, 248, 0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2);">
                PNR: ${f.pnr || "—"}
              </div>
            </div>
            <div class="ticket-card-body" style="padding: 12px 14px; display: grid; grid-template-columns: 2fr 1.2fr 2fr; align-items: center; gap: 12px;">
              <div style="text-align: left;">
                <p class="airport-code" style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: #0F172A; margin: 0; line-height: 1;">${depCode}</p>
                <p class="airport-name" style="font-size: 10px; font-weight: bold; color: #475569; margin: 2px 0 0 0;">${depName}</p>
                ${depTerminal ? `<p style="font-size: 9px; font-weight: bold; color: #E11D48; margin: 2px 0 0 0;">Terminal: ${depTerminal}</p>` : ""}
                <p style="font-size: 13px; font-weight: bold; color: #0F172A; margin: 4px 0 0 0;">${f.departTime || "—"}</p>
                <p style="font-size: 9px; color: #64748B; margin: 2px 0 0 0;">Date: ${depDateStr}</p>
              </div>
              <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-width: 80px;">
                <div style="font-size: 9px; text-transform: uppercase; color: #94A3B8; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">NON-STOP</div>
                <div style="width: 100%; display: flex; align-items: center; position: relative;">
                  <div style="height: 1px; flex-grow: 1; border-top: 1.5px dashed #E2E8F0;"></div>
                  <div style="color: #0EA5E9; font-size: 12px; transform: rotate(90deg); margin: 0 4px; line-height: 1;">✈</div>
                  <div style="height: 1px; flex-grow: 1; border-top: 1.5px dashed #E2E8F0;"></div>
                </div>
              </div>
              <div style="text-align: right;">
                <p class="airport-code" style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: #0F172A; margin: 0; line-height: 1;">${arrCode}</p>
                <p class="airport-name" style="font-size: 10px; font-weight: bold; color: #475569; margin: 2px 0 0 0;">${arrName}</p>
                ${arrTerminal ? `<p style="font-size: 9px; font-weight: bold; color: #E11D48; margin: 2px 0 0 0;">Terminal: ${arrTerminal}</p>` : ""}
                <p style="font-size: 13px; font-weight: bold; color: #0F172A; margin: 4px 0 0 0;">${f.arrivalTime || "—"}</p>
                <p style="font-size: 9px; color: #64748B; margin: 2px 0 0 0;">Date: ${arrDateStr}</p>
              </div>
            </div>
            
            <div class="flight-meta-grid" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: #FAFAFA; border-top: 1px solid #F1F5F9; font-size: 10px; color: #475569; flex-wrap: wrap; gap: 8px;">
              <div>
                Operating Carrier: <strong style="color: #0F172A;">${getAirlineName(f.flightNo)}</strong>
              </div>
              <div>
                Baggage Allowance: <strong style="color: #0F172A;">${f.baggage || "25 KG"}</strong>
              </div>
              <div>
                Hand Carry: <strong style="color: #0F172A;">${f.carryOnBaggage || "7 KG"}</strong>
              </div>
              <div>
                Personal Item: <strong style="color: #0F172A;">${f.personalItem || "1 Personal Item Bag"}</strong>
              </div>
              <div>
                Cabin Class: <strong style="color: #0F172A;">${f.flightClass || "Economy Class"}</strong>
              </div>
              <div>
                Status: <strong style="color: #059669;">CONFIRMED</strong>
              </div>
            </div>
          </div>

          ${
            layoverStr
              ? `
            <div class="layover-divider" style="text-align: center; margin: -6px 0 10px 0;">
              <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 99px; padding: 4px 14px; font-size: 10px; font-weight: 700; color: #B45309; display: inline-flex; align-items: center; gap: 4px;">
                <span>Transit Layover: <strong style="color: #92400E;">${layoverStr}</strong> at <strong>${transitHub}</strong></span>
              </div>
            </div>
          `
              : ""
          }
        `;
        })
        .join("")}

      <!-- Bottom Notice matching ref style -->
      <div style="font-size: 8px; line-height: 1.3; color: #64748B; border-top: 1px dashed #E2E8F0; padding-top: 8px; margin-top: 12px;">
        <p style="margin: 0 0 3px 0; font-weight: bold; color: #334155;">Foreign &amp; Commonwealth Office Travel Advice:</p>
        <p style="margin: 0 0 6px 0;">The Foreign &amp; Commonwealth Office (FCO) issues travel advice on destinations, which includes information on passports, visas, health, safety, and security. For more information refer to link: https://www.gov.uk/foreign-travel-advice</p>
        
        <p style="margin: 0 0 3px 0; font-weight: bold; color: #0F172A;">NOTES &amp; REGULATORY DISCLOSURES :</p>
        <p style="margin: 0;">1. Reconfirmation of any onward / return journey is passenger responsibility.</p>
        <p style="margin: 0;">2. Timings are subject to change. Please reconfirm with your airline operator before you fly.</p>
        <p style="margin: 0;">3. Present your e-ticket along with your original valid passport at check-in counter to obtain boarding passes.</p>
        <p style="margin: 0;">4. All flight ticket bookings are protected under the UK Civil Aviation Authority ATOL scheme and fully backed by our IATA credentials.</p>
      </div>

      <div style="text-align: center; font-size: 9px; font-weight: bold; color: #94A3B8; margin-top: 10px; border-top: 1px solid #E2E8F0; padding-top: 6px;">
        Thank you for booking with Terrific Travel. Have a safe and comfortable flight!
      </div>
    </div>
  `;
}

export function getAirlineKey(flight: any): string {
  if (!flight) return "Flight Service";
  const rawFlightNo = (flight.flightNo || "").trim();
  const codeMatch = rawFlightNo.match(/^([A-Z0-9]{2})/i);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    return getAirlineName(code);
  }
  return flight.vendor?.name || "Flight Service";
}

// 2. GENERATE FLIGHT TICKET
export function generateFlightTicketHtml(
  booking: any,
  flight: any,
  selectedPassengerId?: string | null,
  selectedAirline?: string | null,
  splitByAirline?: boolean,
  groupByNationality?: boolean,
  docType?: "eticket" | "full_package" | "hotel_voucher" | "agent_copy",
  selectedNationality?: string | null,
  splitByNationality?: boolean,
) {
  // If Hotel Voucher mode requested:
  if (docType === "hotel_voucher") {
    const hotels = booking.accommodations || [];
    if (hotels.length === 0) {
      return `<div style="padding: 40px; text-align: center; font-family: sans-serif;"><h2>No Hotel Services Found</h2><p>This booking does not currently contain accommodation services.</p></div>`;
    }
    return hotels
      .map((h: any) => generateHotelVoucherHtml(booking, h))
      .join('<div style="page-break-after: always; height: 1px;"></div>');
  }

  const flightsToRender =
    booking.flightServices && booking.flightServices.length > 0
      ? booking.flightServices
      : [flight];

  let sortedFlights = [...flightsToRender].sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return (a.departTime || "").localeCompare(b.departTime || "");
  });

  // Filter by selected airline if specified and not 'all'
  if (selectedAirline && selectedAirline !== "all") {
    sortedFlights = sortedFlights.filter((f: any) => {
      const airlineName = getAirlineKey(f);
      return airlineName.toLowerCase() === selectedAirline.toLowerCase();
    });
  }

  // Filter flights by selected nationality if specified and not 'all'
  if (selectedNationality && selectedNationality !== "all") {
    sortedFlights = sortedFlights.filter((f: any) => {
      let flightNat = "ALL";
      if (f.notes) {
        try {
          const parsed = JSON.parse(f.notes);
          if (parsed.associatedNationality) {
            flightNat = parsed.associatedNationality.trim().toUpperCase();
          }
        } catch (e) {}
      }
      return flightNat === "ALL" || flightNat === selectedNationality.trim().toUpperCase();
    });
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

  let passengersToRender =
    selectedPassengerId && selectedPassengerId !== "all"
      ? passengers.filter((p: any) => p.id === selectedPassengerId)
      : passengers;

  // Filter by selected nationality if specified and not 'all'
  if (selectedNationality && selectedNationality !== "all") {
    passengersToRender = passengersToRender.filter((p: any) => {
      const pNat = (p.nationality || "Unspecified").trim().toUpperCase();
      return pNat === selectedNationality.trim().toUpperCase();
    });
  }

  const activePax =
    passengersToRender.length > 0 ? passengersToRender : passengers;

  let baseFlightHtml = "";

  // Split by nationality into separate pages if requested
  if (splitByNationality) {
    const natGroups: { [key: string]: any[] } = {};
    activePax.forEach((p: any) => {
      const nat = (p.nationality || "Unspecified").toUpperCase();
      if (!natGroups[nat]) natGroups[nat] = [];
      natGroups[nat].push(p);
    });

    const natKeys = Object.keys(natGroups);
    if (natKeys.length > 1) {
      baseFlightHtml = natKeys
        .map((nat) => {
          const natPax = natGroups[nat];
          const natFlights = sortedFlights.filter((f: any) => {
            let flightNat = "ALL";
            if (f.notes) {
              try {
                const parsed = JSON.parse(f.notes);
                if (parsed.associatedNationality) {
                  flightNat = parsed.associatedNationality.trim().toUpperCase();
                }
              } catch (e) {}
            }
            return flightNat === "ALL" || flightNat === nat.trim().toUpperCase();
          });
          return generateConsolidatedTicketHtml(booking, natPax, natFlights, false);
        })
        .join('<div style="page-break-after: always; height: 1px;"></div>');
      return baseFlightHtml;
    }
  }

  // Split by airline into separate pages if requested
  if (splitByAirline) {
    const groups: { [key: string]: any[] } = {};
    sortedFlights.forEach((f: any) => {
      const key = getAirlineKey(f);
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
    });

    const airlineKeys = Object.keys(groups);
    if (airlineKeys.length > 1) {
      baseFlightHtml = airlineKeys
        .map((airline) =>
          generateConsolidatedTicketHtml(booking, activePax, groups[airline], groupByNationality),
        )
        .join('<div style="page-break-after: always; height: 1px;"></div>');
    } else {
      baseFlightHtml = generateConsolidatedTicketHtml(booking, activePax, sortedFlights, groupByNationality);
    }
  } else {
    baseFlightHtml = generateConsolidatedTicketHtml(booking, activePax, sortedFlights, groupByNationality);
  }

  // Handle Full Package Mode (Flight + Hotel Vouchers)
  if (docType === "full_package") {
    const parts = [baseFlightHtml];
    if (booking.accommodations && booking.accommodations.length > 0) {
      booking.accommodations.forEach((h: any) => {
        parts.push(generateHotelVoucherHtml(booking, h));
      });
    }
    return parts.join('<div style="page-break-after: always; height: 1px;"></div>');
  }

  // Handle Agent Copy / Internal Operations Record Mode
  if (docType === "agent_copy") {
    const agentHeader = `
      <div style="background: #1E293B; color: #F8FAFC; padding: 12px 18px; border-radius: 8px; margin-bottom: 16px; font-family: sans-serif; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
          <strong style="color: #38BDF8; font-size: 13px; text-transform: uppercase;">💼 AGENT OPERATIONS &amp; INTERNAL AUDIT COPY</strong>
          <span style="background: #0EA5E9; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: 800;">CONFIDENTIAL</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          <div>Assigned Agent: <strong>${booking.agent?.name || booking.user?.firstName || "System Admin"}</strong></div>
          <div>Booking Ref: <strong>${booking.bookingReference}</strong></div>
          <div>Client Paid Total: <strong>£${booking.paidTotal || 0}</strong></div>
        </div>
      </div>
    `;
    return agentHeader + baseFlightHtml;
  }

  return baseFlightHtml;
}

// 3. GENERATE HOTEL VOUCHER
export function generateHotelVoucherHtml(booking: any, hotel: any) {
  const leader =
    booking.passengers?.find((p: any) => p.role === "Leader") ||
    booking.passengers?.[0];
  const voucherNo = `HTL-${hotel.id.substring(0, 8).toUpperCase()}`;

  return `
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
          <p>Voucher No: <strong>${voucherNo}</strong></p>
          <p>Issue Date: <strong>${hotel.issueDate ? formatDate(hotel.issueDate) : formatDate(new Date())}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
          <p>Hotel Confirmation #: <strong style="font-size: 12px; color: #10B981;">${hotel.hotelConfirmationNumber || "CONFIRMED"}</strong></p>
          <p>Reservation Code: <strong>${hotel.reservationNumber || "—"}</strong></p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <h3>Guest / Lead Client Details</h3>
          <p><strong>${leader ? formatPassengerName(leader) : "VALUED GUEST"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
          <p>Total Guests: <strong>${booking.passengers?.length || 1} Person(s)</strong></p>
        </div>
        <div class="info-box">
          <h3>Property &amp; Vendor Information</h3>
          <p style="font-size: 13px; font-weight: 700; color: #0F172A;">${hotel.hotelName}</p>
          <p>City/Region: ${hotel.city || "—"}</p>
          <p>Address: ${hotel.hotelAddress || "—"}</p>
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 8px 0;" />
          <p style="font-size: 9px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Fulfillment Vendor</p>
          <p><strong>Vendor Name:</strong> ${hotel.vendor?.name || "Terrific Travel Partner"}</p>
          <p><strong>Phone:</strong> ${hotel.vendor?.phoneNumber || "—"}</p>
          ${hotel.vendor?.supportEmail ? `<p><strong>Email:</strong> ${hotel.vendor.supportEmail}</p>` : ""}
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
              <td style="text-transform: uppercase;"><strong>${formatPassengerName(p)}</strong></td>
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
        <p>Terrific Travel Ltd | Accommodation confirmation program registration under CAA regulations</p>
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
          <p>Invoice No: <strong>${invoiceNo}</strong></p>
          <p>Issue Date: <strong>${issueDate}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <div class="info-box">
          <h3>Applicant / Client Info</h3>
          <p><strong>${leader ? formatPassengerName(leader) : "VALUED APPLICANT"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Services Desk</h3>
          <p><strong>Terrific Travel Visas & Consular Services</strong></p>
          <p>Consular Desk Support</p>
          <p>Total Visa Applications: <strong>${visas.length}</strong></p>
        </div>
        <div class="info-box">
          <h3>Consular Fulfillment Vendor</h3>
          <p><strong>Vendor Name:</strong> ${visas[0]?.vendor?.name || "Visa Consular Authority"}</p>
          <p><strong>Phone:</strong> ${visas[0]?.vendor?.phoneNumber || "—"}</p>
          ${visas[0]?.vendor?.supportEmail ? `<p><strong>Email:</strong> ${visas[0].vendor.supportEmail}</p>` : ""}
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Consular & Processing Services Summary</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>Consular Visa Category</th>
            <th>Issue Date</th>
            <th class="text-right">Visa Fee</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(
            visas.reduce((acc: any, v: any) => {
              const key = v.visaType || "Unknown Visa";
              if (!acc[key]) acc[key] = { ...v, count: 0, totalPrice: 0 };
              acc[key].count += 1;
              acc[key].totalPrice += Number(v.price) || 0;
              return acc;
            }, {}),
          )
            .map(
              (v: any) => `
            <tr>
              <td><strong>${v.visaType} ${v.count > 1 ? `(x${v.count})` : ""}</strong></td>
              <td>${v.issueDate ? formatDate(v.issueDate) : "—"}</td>
              <td class="text-right"><strong>${formatCurrency(v.totalPrice)}</strong></td>
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
        <p>Terrific Travel Ltd | Registered Consular and Travel Visa Processing Partner</p>
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
  const transfers = Array.isArray(transport)
    ? transport
    : transport === "all" || !transport
      ? booking.transportServices || []
      : [transport];

  const voucherNo =
    transport === "all" || !transport
      ? `TRN-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : Array.isArray(transport)
        ? `TRN-GRP-${booking.id.substring(0, 6).toUpperCase()}`
        : `TRN-${transport.id.substring(0, 8).toUpperCase()}`;

  const issueDate =
    transport === "all" || !transport || Array.isArray(transport)
      ? formatDate(new Date())
      : transport.issueDate
        ? formatDate(transport.issueDate)
        : formatDate(new Date());

  // Lead guest name
  const guestName = leader
    ? formatPassengerName(leader)
    : "VALUED PASSENGER";

  // Passenger count
  const paxCount = booking.passengers?.length || 1;

  // Primary vehicle type from first transfer
  const primaryVehicle = transfers[0]?.vehicleType || "—";

  // Vendor / agent ref
  const vendorRef = transfers[0]?.vendor?.name || "Terrific Travel Partner";

  // Agent name used as REF field (matching screenshot "Basma Travels" pattern)
  const agentRef =
    booking.agent?.name || booking.agentName || "Terrific Travel";

  return `
    <div class="document-container">
      <!-- Header -->
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.6;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            www.terrifictravel.co.uk<br>
            Phone: 0121 529 1630<br>
            Email: office@terrifictravel.co.uk
          </p>
        </div>
        <div style="display: flex; align-items: center; height: 60px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Transfer Voucher</h1>
        </div>
        <div class="doc-meta">
          <p>Voucher No: <strong>${voucherNo}</strong></p>
          <p>Issue Date: <strong>${issueDate}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <!-- Booking Information section (mirrors screenshot layout) -->
      <h3 style="font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 900; color: #0F172A; margin-bottom: 12px;">Booking Information</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 24px; font-size: 10px;">
        <div style="display: flex; flex-direction: column; border-right: 1px solid #E2E8F0;">
          <div style="display: flex; border-bottom: 1px solid #E2E8F0; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">Booking Date:</span>
            <span style="color: #0F172A;">${issueDate}</span>
          </div>
          <div style="display: flex; border-bottom: 1px solid #E2E8F0; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">Booking No:</span>
            <span style="color: #0F172A;">${booking.bookingReference}</span>
          </div>
          <div style="display: flex; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">REF:</span>
            <span style="color: #0F172A;">${agentRef}</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; border-bottom: 1px solid #E2E8F0; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">PAX MOBILE</span>
            <span style="color: #0F172A;">${leader?.phoneNumber || "—"}</span>
          </div>
          <div style="display: flex; border-bottom: 1px solid #E2E8F0; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">GUEST NAME</span>
            <span style="color: #0F172A;">${guestName.toUpperCase()}</span>
          </div>
          <div style="display: flex; border-bottom: 1px solid #E2E8F0; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">NO OF PAX</span>
            <span style="color: #0F172A;">${paxCount}</span>
          </div>
          <div style="display: flex; padding: 8px 12px; gap: 8px;">
            <span style="font-weight: 700; color: #334155; min-width: 110px;">VEHICLE</span>
            <span style="color: #0F172A;">${primaryVehicle.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <!-- Transport schedule table (NO pricing) -->
      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Transport Details &amp; Schedule</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Flight No</th>
            <th>Pick-Up</th>
            <th>Drop-Off</th>
            <th>No. of Guests</th>
            <th>Vehicle</th>
          </tr>
        </thead>
        <tbody>
          ${[...transfers]
            .sort((a: any, b: any) => {
              const dateDiff =
                new Date(a.date).getTime() - new Date(b.date).getTime();
              if (dateDiff !== 0) return dateDiff;
              return (
                parseTimeStr(a.departureTime) - parseTimeStr(b.departureTime)
              );
            })
            .map(
              (t: any) => `
            <tr>
              <td><strong>${formatDate(t.date)}</strong></td>
              <td>${t.departureTime || t.arrivalTime || "—"}</td>
              <td>${t.flightNo || "—"}</td>
              <td><strong>${t.departureDestination}</strong></td>
              <td><strong>${t.arrivalDestination}</strong></td>
              <td>${paxCount}</td>
              <td>${t.vehicleType || "—"}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <!-- Emergency Contact Details -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 900; color: #0F172A; margin-bottom: 8px;">Emergency Contact Details:</h3>
        <table style="font-size: 10px; border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 3px 0; min-width: 180px;"><strong>Contact Details:</strong></td>
            <td style="padding: 3px 0;">+441215291630</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;"><strong>Emergency WhatsApp:</strong></td>
            <td style="padding: 3px 0;">+44 7888 461474</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;"><strong>${vendorRef} Contact:</strong></td>
            <td style="padding: 3px 0;">${transfers[0]?.vendor?.phoneNumber || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;"><strong>Operations:</strong></td>
            <td style="padding: 3px 0;">24 Hours</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;"><strong>Reservations:</strong></td>
            <td style="padding: 3px 0;">Mon–Fri 9.30am to 5.30pm and Sat 10am to 3pm</td>
          </tr>
        </table>
      </div>

      <!-- Notes section -->
      <div style="font-size: 9.5px; line-height: 1.6; color: #1E293B; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 6px 0; font-weight: 900; color: #0F172A; font-size: 10px;">NOTE:</p>
        <p style="margin: 0;">1. Please print a copy of this Voucher &amp; carry with you throughout your Journey.</p>
        <p style="margin: 0;">2. Please send the copy of this Voucher to ${transfers[0]?.vendor?.name || "Transport supplier"} Transport contact no within 24 hours before departure for further confirmation.</p>
        <p style="margin: 0;">3. On arrival at Makkah / Madinah Airport, immediately contact to ${transfers[0]?.vendor?.name || "Transport supplier"} Transport at given contact details.</p>
        <p style="margin: 0;">4. If you will not reach to Vehicle/Transport on time, it will cost you more for extra waiting time. Company will not be responsible for anything.</p>
        <p style="margin: 0;">5. Please coordinate with Driver or ${transfers[0]?.vendor?.name || "Transport supplier"} Transport one day before, for your Pick-Up time.</p>
      </div>

      <!-- Footer -->
      <div class="doc-footer">
        <p>Address: Office 1, 11 Walford Road, Birmingham, B11 1NP</p>
        <p>Email: office@terrifictravel.co.uk | Phone: 01215291630 | WhatsApp: +44 7888 461474</p>
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
          <p>Invoice No: <strong>${invoiceNo}</strong></p>
          <p>Date: <strong>${formatDate(new Date())}</strong></p>
          <p>Booking Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
      </div>

      <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <div class="info-box">
          <h3>Lead Passenger / Guest</h3>
          <p><strong>${leader ? formatPassengerName(leader) : "VALUED PASSENGER"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Fulfillment Details</h3>
          <p>Special Service Type: Additional / Custom Element</p>
          <p>Total Items: <strong>${services.length}</strong></p>
        </div>
        <div class="info-box">
          <h3>Fulfillment Vendor Details</h3>
          <p><strong>Vendor Name:</strong> ${services[0]?.customVendorName || services[0]?.vendor?.name || "Terrific Travel Direct Office"}</p>
          <p><strong>Phone:</strong> ${services[0]?.vendor?.phoneNumber || "—"}</p>
          ${services[0]?.vendor?.supportEmail ? `<p><strong>Email:</strong> ${services[0].vendor.supportEmail}</p>` : ""}
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
        <p>Terrific Travel Ltd | Custom Travel Programs and Bespoke Luxury Services</p>
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
  const balanceDue = Math.max(0, totalPrice - paidAmount);

  const leadPassengerBlock = `
    <p><strong>${leader ? formatPassengerName(leader) : "VALUED CUSTOMER"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const agentBlock = `
    <p><strong>${booking.agent?.name || "Terrific Travel Direct Office"}</strong></p>
    ${booking.agent?.phoneNumber ? `<p>Phone: ${booking.agent.phoneNumber}</p>` : ""}
    ${booking.agent?.email ? `<p>Email: ${booking.agent.email}</p>` : ""}
  `;

  const passengersRows =
    booking.passengers && booking.passengers.length > 0
      ? booking.passengers
          .map(
            (p: any) => `
    <tr>
      <td><strong style="text-transform: uppercase;">${formatPassengerName(p)}</strong></td>
      <td>${p.age || "Adult"} (${p.role || "Passenger"})</td>
      <td>${p.nationality || "—"}</td>
    </tr>
  `,
          )
          .join("")
      : `
    <tr>
      <td colspan="3" class="text-center" style="color: #64748B;">No passenger info added.</td>
    </tr>
  `;

  const activeFlights = (booking.flightServices || []).filter(
    (f: any) => f.status !== "CANCELLED",
  );

  const servicesRows = [
    ...(activeFlights.map(
      (f: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #0284C7;">FLIGHT</span></td>
        <td>Flight No: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"}) - ${f.departedFrom} to ${f.arrivedAt} on ${formatDate(f.date)}</td>
      </tr>
    `,
    ) || []),
    ...(booking.accommodations?.map(
      (h: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #10B981;">HOTEL</span></td>
        <td><strong>${h.hotelName}</strong> (${h.city || "—"}) - Room: ${h.roomType} x${h.qty} (${h.mealType || "Room Only"}), Confirmation #: ${h.hotelConfirmationNumber || "—"}</td>
      </tr>
    `,
    ) || []),
    ...(booking.transportServices?.map(
      (t: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #F59E0B;">TRANSFER</span></td>
        <td>${t.vehicleType} - From: ${t.departureDestination} to ${t.arrivalDestination} on ${formatDate(t.date)}</td>
      </tr>
    `,
    ) || []),
    ...Object.values(
      (booking.visaServices || []).reduce((acc: any, v: any) => {
        const key = v.visaType || "Unknown Visa";
        if (!acc[key]) acc[key] = { ...v, count: 0 };
        acc[key].count += 1;
        return acc;
      }, {}),
    ).map(
      (v: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #8B5CF6;">VISA</span></td>
        <td>Visa Type: <strong>${v.visaType} ${v.count > 1 ? `(x${v.count})` : ""}</strong></td>
      </tr>
    `,
    ),
    ...(booking.additionalServices?.map(
      (a: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #EC4899;">SPECIAL SERVICE</span></td>
        <td><strong>${a.serviceName}</strong> ${a.serviceDescription ? ` - ${a.serviceDescription}` : ""} ${a.customVendorName ? `(Vendor: ${a.customVendorName})` : ""}</td>
      </tr>
    `,
    ) || []),
  ].join("");

  const safeServicesRows =
    servicesRows ||
    `
    <tr>
      <td colspan="2" class="text-center" style="color: #64748B;">No service components registered.</td>
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
  html = html.replace(/{{SERVICES_TIMELINE}}/g, generateTimelineHtml(booking));
  html = html.replace(/{{SERVICES_TABLE_ROWS}}/g, safeServicesRows);
  html = html.replace(/{{SUBTOTAL}}/g, formatCurrency(totalPrice));
  html = html.replace(/{{TOTAL_PRICE}}/g, formatCurrency(totalPrice));
  html = html.replace(/{{PAID_AMOUNT}}/g, formatCurrency(paidAmount));
  html = html.replace(/{{BALANCE_DUE}}/g, formatCurrency(balanceDue));

  // Dynamically inject the Cancelled Flights section if there are any cancelled flights
  const cancelledFlights = (booking.flightServices || []).filter(
    (f: any) => f.status === "CANCELLED",
  );
  if (cancelledFlights.length > 0) {
    const cancelledHtml = `
      <div class="cancelled-flights-section" style="margin-top: 24px; margin-bottom: 24px; padding: 16px; background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 8px; page-break-inside: avoid;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-family: 'Outfit', sans-serif; font-size: 11px; color: #991B1B; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #FCA5A5; padding-bottom: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #DC2626; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Cancelled Flight Services &amp; Routing
        </h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          ${cancelledFlights
            .map(
              (f: any) => `
              <div style="padding: 10px 12px; background: #FFFFFF; border: 1px solid #FEE2E2; border-radius: 6px; display: flex; align-items: center;">
                <div>
                  <span style="font-size: 8px; font-weight: 700; color: #DC2626; text-transform: uppercase; background: #FEE2E2; padding: 2px 6px; border-radius: 4px; margin-right: 8px; display: inline-block; vertical-align: middle;">Cancelled</span>
                  <strong style="font-size: 11px; color: #475569; display: inline-block; vertical-align: middle;">${f.flightType || "Outbound"} Flight: ${f.departedFrom} to ${f.arrivedAt}</strong>
                  <div style="font-size: 9px; color: #94A3B8; margin-top: 4px;">
                    Flight No: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"}) | 
                    Departure: <strong>${f.departTime || "—"}</strong> | Arrival: <strong>${f.arrivalTime || "—"}</strong> | 
                    Date: <strong>${formatDate(f.date)}</strong>
                  </div>
                </div>
              </div>
            `,
            )
            .join("")}
        </div>
      </div>
    `;
    html = html.replace(
      /(<div class="financial-panel">[\s\S]*?<\/div>)/i,
      `$1\n${cancelledHtml}`,
    );
  }

  return html;
}

export function renderFlightTicket(
  templateHtml: string,
  booking: any,
  flight: any,
  selectedPassengerId?: string | null,
  selectedAirline?: string | null,
  splitByAirline?: boolean,
  groupByNationality?: boolean,
  docType?: "eticket" | "full_package" | "hotel_voucher" | "agent_copy",
  selectedNationality?: string | null,
  splitByNationality?: boolean,
): string {
  return generateFlightTicketHtml(
    booking,
    flight,
    selectedPassengerId,
    selectedAirline,
    splitByAirline,
    groupByNationality,
    docType,
    selectedNationality,
    splitByNationality,
  );
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
    <p><strong>${leader ? formatPassengerName(leader) : "VALUED GUEST"}</strong></p>
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
      <td style="text-transform: uppercase;"><strong>${formatPassengerName(p)}</strong></td>
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
  html = html.replace(
    /{{VENDOR_NAME}}/g,
    hotel.vendor?.name || "Terrific Travel Partner",
  );
  html = html.replace(/{{VENDOR_PHONE}}/g, hotel.vendor?.phoneNumber || "—");
  html = html.replace(/{{VENDOR_EMAIL}}/g, hotel.vendor?.supportEmail || "—");
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
  const transfers = Array.isArray(transport)
    ? transport
    : transport === "all" || !transport
      ? booking.transportServices || []
      : [transport];

  const voucherNo =
    transport === "all" || !transport
      ? `TRN-ALL-${booking.id.substring(0, 6).toUpperCase()}`
      : Array.isArray(transport)
        ? `TRN-GRP-${booking.id.substring(0, 6).toUpperCase()}`
        : `TRN-${transport.id.substring(0, 8).toUpperCase()}`;

  const totalCost = transfers.reduce(
    (sum: number, t: any) => sum + (t.price || 0),
    0,
  );
  const issueDate =
    transport === "all" || !transport || Array.isArray(transport)
      ? formatDate(new Date())
      : transport.issueDate
        ? formatDate(transport.issueDate)
        : formatDate(new Date());

  const leadPassengerBlock = `
    <p><strong>${leader ? formatPassengerName(leader) : "VALUED PASSENGER"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const sortedTransports = [...transfers].sort((a: any, b: any) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return parseTimeStr(a.departureTime) - parseTimeStr(b.departureTime);
  });

  const transfersRows = sortedTransports
    .map(
      (t: any) => `
    <tr>
      <td>
        <strong>${formatDate(t.date)}</strong><br/>
        <span style="font-size: 9px; color: #64748B;">Time: ${t.departureTime || t.arrivalTime || "—"}</span>
      </td>
      <td><strong>${t.departureDestination}</strong></td>
      <td><strong>${t.arrivalDestination}</strong></td>
      <td>
        <span style="font-weight: 700; color: #0F172A;">${t.vehicleType}</span>
        ${t.flightNo ? `<br/><span style="font-size: 9px; color: #0284C7; font-weight: bold;">Flight: ${t.flightNo}</span>` : ""}
      </td>
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
  html = html.replace(/{{TOTAL_GROUND_COST}}/g, "");
  html = html.replace(
    /{{VENDOR_NAME}}/g,
    transfers[0]?.vendor?.name || "Terrific Travel Ground Partner",
  );
  html = html.replace(
    /{{VENDOR_PHONE}}/g,
    transfers[0]?.vendor?.phoneNumber || "—",
  );
  html = html.replace(
    /{{VENDOR_EMAIL}}/g,
    transfers[0]?.vendor?.supportEmail || "—",
  );

  // Dynamically strip any Price header and Total Ground Cost elements to ensure price is completely removed
  html = html.replace(/<th[^>]*>\s*Price\s*<\/th>/gi, "");
  html = html.replace(/<div class="financial-panel">[\s\S]*?<\/div>/gi, "");
  html = html.replace(/<tr class="total-row">[\s\S]*?<\/tr>/gi, "");

  // Force-update terms & conditions notes block in customized templates
  const vendorName = transfers[0]?.vendor?.name || "Transport supplier";
  const newNotesHtml = `
    <!-- Notes section -->
    <div style="font-size: 9.5px; line-height: 1.6; color: #1E293B; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
      <p style="margin: 0 0 6px 0; font-weight: 900; color: #0F172A; font-size: 10px;">NOTE:</p>
      <p style="margin: 0;">1. Please print a copy of this Voucher &amp; carry with you throughout your Journey.</p>
      <p style="margin: 0;">2. Please send the copy of this Voucher to ${vendorName} Transport contact no within 24 hours before departure for further confirmation.</p>
      <p style="margin: 0;">3. On arrival at Makkah / Madinah Airport, immediately contact to ${vendorName} Transport at given contact details.</p>
      <p style="margin: 0;">4. If you will not reach to Vehicle/Transport on time, it will cost you more for extra waiting time. Company will not be responsible for anything.</p>
      <p style="margin: 0;">5. Please coordinate with Driver or ${vendorName} Transport one day before, for your Pick-Up time.</p>
    </div>
  `;

  let replaced = false;

  // 1. If it contains "1. Please print a copy"
  if (html.includes("1. Please print a copy")) {
    const textIdx = html.indexOf("1. Please print a copy");
    const divStartIdx = html.lastIndexOf("<div", textIdx);
    const divEndIdx = html.indexOf("</div>", textIdx);
    if (divStartIdx !== -1 && divEndIdx !== -1) {
      html =
        html.substring(0, divStartIdx) +
        newNotesHtml +
        html.substring(divEndIdx + 6);
      replaced = true;
    }
  }

  // 2. If not replaced and it contains "Important Transfer Notices"
  if (!replaced && html.includes("Important Transfer Notices")) {
    const textIdx = html.indexOf("Important Transfer Notices");
    const divStartIdx = html.lastIndexOf("<div", textIdx);
    const divEndIdx = html.indexOf("</div>", textIdx);
    if (divStartIdx !== -1 && divEndIdx !== -1) {
      html =
        html.substring(0, divStartIdx) +
        newNotesHtml +
        html.substring(divEndIdx + 6);
      replaced = true;
    }
  }

  // 3. Fallback to append right before footer
  if (!replaced) {
    if (html.includes("doc-footer")) {
      html = html.replace(
        /<div class="doc-footer"/i,
        `${newNotesHtml}\n<div class="doc-footer"`,
      );
    } else if (html.includes("footer-bar")) {
      html = html.replace(
        /<div class="footer-bar"/i,
        `${newNotesHtml}\n<div class="footer-bar"`,
      );
    }
  }

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
    <p><strong>${leader ? formatPassengerName(leader) : "VALUED APPLICANT"}</strong></p>
    ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
    ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
  `;

  const visasRows = visas
    .map(
      (v: any) => `
    <tr>
      <td><strong>${v.visaType}</strong></td>
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
  html = html.replace(
    /{{VENDOR_NAME}}/g,
    visas[0]?.vendor?.name || "Visa Consular Authority",
  );
  html = html.replace(
    /{{VENDOR_PHONE}}/g,
    visas[0]?.vendor?.phoneNumber || "—",
  );
  html = html.replace(
    /{{VENDOR_EMAIL}}/g,
    visas[0]?.vendor?.supportEmail || "—",
  );

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
    <p><strong>${leader ? formatPassengerName(leader) : "VALUED PASSENGER"}</strong></p>
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
  html = html.replace(
    /{{VENDOR_NAME}}/g,
    services[0]?.customVendorName ||
      services[0]?.vendor?.name ||
      "Terrific Travel Direct Office",
  );
  html = html.replace(
    /{{VENDOR_PHONE}}/g,
    services[0]?.vendor?.phoneNumber || "—",
  );
  html = html.replace(
    /{{VENDOR_EMAIL}}/g,
    services[0]?.vendor?.supportEmail || "—",
  );

  return html;
}
