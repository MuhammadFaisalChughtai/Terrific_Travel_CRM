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

  // Flights
  if (booking.flightServices && booking.flightServices.length > 0) {
    const sortedFlights = [...booking.flightServices].sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    sortedFlights.forEach((f: any, idx: number) => {
      const nextFlight = sortedFlights[idx + 1];
      const isConnecting = getIsConnecting(f, nextFlight);
      const layoverStr =
        isConnecting && nextFlight ? calculateLayover(f, nextFlight) : "";

      const extractCode = (str: string) => {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1].toUpperCase() : str.toUpperCase();
      };
      const transitHub = extractCode(f.arrivedAt || "");

      items.push({
        type: "FLIGHT",
        date: f.date ? new Date(f.date) : new Date(booking.createdAt),
        title: `Outbound Flight: ${f.departedFrom} to ${f.arrivedAt}`,
        icon: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.4.5l-.3.3c-.4.4-.4 1.1 0 1.5L9 12l-5.5 5.5H2v2l2 2h2v-1.5L11.5 15l3.5 5.7c.4.4 1.1.4 1.5 0l.3-.3c.4-.3.6-.9.5-1.4Z"/></svg>`,
        badgeClass: "flight",
        details: `
          <div class="timeline-detail-item">Flight: <strong>${f.flightNo}</strong> (PNR: ${f.pnr || "—"})</div>
          <div class="timeline-detail-item">Departure: <strong>${f.departTime || "—"}</strong> | Arrival: <strong>${f.arrivalTime || "—"}</strong></div>
          <div class="timeline-detail-item">Class: <strong>${f.flightClass || "Economy"}</strong> | Baggage: <strong>${f.baggage || "23 KG"}</strong></div>
        `,
        notes: f.notes,
      });

      if (isConnecting && layoverStr) {
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
        });
      }
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
          <div class="timeline-detail-item">Vehicle: <strong>${t.vehicleType}</strong> | Pickup Time: <strong>${t.departureTime || "—"}</strong></div>
          <div class="timeline-detail-item">Flight Ref: <strong>${t.flightNo || "—"}</strong></div>
        `,
        notes: t.notes,
      });
    });
  }

  // Visas
  if (booking.visaServices && booking.visaServices.length > 0) {
    booking.visaServices.forEach((v: any) => {
      items.push({
        type: "VISA",
        date: v.issueDate ? new Date(v.issueDate) : new Date(booking.createdAt),
        title: `Visa Application: ${v.visaType}`,
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

  // Separate layover cards from regular items so that chronological sort
  // does not move them away from their adjacent flight segments.
  const layoverCards = items.filter((i) => i.isLayoverCard);
  const regularItems = items.filter((i) => !i.isLayoverCard);

  // Sort only the non-layover items chronologically
  regularItems.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Re-insert each layover card immediately AFTER the flight it belongs to.
  // Each layover card's `date` is set to its preceding flight's date + 1 ms,
  // so we match it to the regular item whose date is closest-just-before it.
  const orderedItems: any[] = [];
  regularItems.forEach((item) => {
    orderedItems.push(item);
    // Check if there's a layover card that should follow this item
    const associatedLayover = layoverCards.find(
      (lc) =>
        lc.date.getTime() > item.date.getTime() &&
        // Make sure it belongs right after this item (not a later flight)
        !regularItems.some(
          (ri) =>
            ri !== item &&
            ri.date.getTime() > item.date.getTime() &&
            ri.date.getTime() < lc.date.getTime(),
        ),
    );
    if (associatedLayover) {
      orderedItems.push(associatedLayover);
    }
  });

  return `
    <div class="timeline-container">
      ${orderedItems
        .map((item) => {
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
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
          <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
            <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
            <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
          </svg>
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
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Customer"}</strong></p>
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
              <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
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
      const arrDate = new Date(currentFlight.date);
      const depDate = new Date(nextFlight.date);

      const [arrH, arrM] = (currentFlight.arrivalTime || "00:00")
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
  };
  return airlines[code] || `${code} Air`;
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

  return `
    <div class="document-container">
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
        </div>
      </div>

      <div class="doc-title-section">
        <div>
          <h1 class="doc-title">Flight Ticket / Itinerary</h1>
          <span class="section-badge" style="background: #E0F2FE; color: #0369A1;">Status: Issued</span>
        </div>
        <div class="doc-meta">
          <p>Booking Ref: <strong>${booking.bookingReference || "—"}</strong></p>
          <p>Supplier Ref (PNR): <strong style="font-family: monospace; font-size: 13px; color: #0EA5E9;">${pnr}</strong></p>
          <p>Issue Date: <strong>${issueDate}</strong></p>
        </div>
      </div>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 12px;">Passenger Details</h3>
      <table class="data-table" style="margin-bottom: 24px;">
        <thead>
          <tr>
            <th>PAX Type</th>
            <th>Passenger Name</th>
            <th>E-Ticket Number</th>
            <th>Agency IATA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-transform: uppercase; font-weight: bold;">${passenger.role || deriveAgeCategory(passenger.dateOfBirth)}</td>
            <td><strong>${passenger.title || ""} ${passenger.firstName} ${passenger.lastName}</strong></td>
            <td style="color: #0284C7; font-family: monospace; font-size: 12px; font-weight: bold;">${ticketNo}</td>
            <td>91263712</td>
          </tr>
        </tbody>
      </table>

      <h3 style="font-family: 'Outfit', sans-serif; text-transform: uppercase; font-size: 11px; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 16px;">Flight Itinerary Segments</h3>

      ${flights
        .map((f: any, idx: number) => {
          const nextFlight = flights[idx + 1];
          const isConnecting = getIsConnecting(f, nextFlight);
          const layoverStr =
            isConnecting && nextFlight ? calculateLayover(f, nextFlight) : "";

          const depDateStr = formatDate(f.date);
          const arrDateStr = formatDate(f.date);

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

          return `
          <div class="ticket-card" style="border: 1px solid #E2E8F0; margin-bottom: 20px;">
            <div class="ticket-card-header" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #0F172A;">
              <div style="font-weight: 900; color: #FFFFFF; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                <span style="background: #0EA5E9; color: #FFFFFF; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; text-transform: uppercase;">Segment #${idx + 1}</span>
                <span>${f.flightNo}</span>
              </div>
              <div style="font-size: 11px; font-weight: 800; font-family: monospace; color: #38BDF8; background: rgba(56, 189, 248, 0.1); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2);">
                PNR: ${f.pnr || "—"}
              </div>
            </div>
            <div class="ticket-card-body" style="padding: 16px; display: grid; grid-template-cols: 2fr 1.2fr 2fr; align-items: center; gap: 15px;">
              <div style="text-align: left;">
                <p class="airport-code">${depCode}</p>
                <p class="airport-name" style="font-size: 10px; font-weight: bold; color: #475569; margin-top: 2px;">${depName}</p>
                ${depTerminal ? `<p style="font-size: 9px; font-weight: bold; color: #E11D48; margin-top: 2px;">Terminal: ${depTerminal}</p>` : ""}
                <p style="font-size: 13px; font-weight: bold; color: #0F172A; margin-top: 4px;">${f.departTime || "—"}</p>
                <p style="font-size: 9px; color: #64748B;">Date: ${depDateStr}</p>
              </div>
              <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-width: 80px;">
                <div style="font-size: 9px; text-transform: uppercase; color: #94A3B8; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px;">NON-STOP</div>
                <div style="width: 100%; display: flex; align-items: center; position: relative;">
                  <div style="height: 1px; flex-grow: 1; border-top: 1.5px dashed #E2E8F0;"></div>
                  <div style="color: #0EA5E9; font-size: 14px; transform: rotate(90deg); margin: 0 4px; line-height: 1;">✈</div>
                  <div style="height: 1px; flex-grow: 1; border-top: 1.5px dashed #E2E8F0;"></div>
                </div>
              </div>
              <div style="text-align: right;">
                <p class="airport-code">${arrCode}</p>
                <p class="airport-name" style="font-size: 10px; font-weight: bold; color: #475569; margin-top: 2px;">${arrName}</p>
                ${arrTerminal ? `<p style="font-size: 9px; font-weight: bold; color: #E11D48; margin-top: 2px;">Terminal: ${arrTerminal}</p>` : ""}
                <p style="font-size: 13px; font-weight: bold; color: #0F172A; margin-top: 4px;">${f.arrivalTime || "—"}</p>
                <p style="font-size: 9px; color: #64748B;">Date: ${arrDateStr}</p>
              </div>
            </div>
            
            <div class="flight-meta-grid">
              <div class="meta-item">
                <h5>Operating Carrier</h5>
                <p>${getAirlineName(f.flightNo)}</p>
              </div>
              <div class="meta-item">
                <h5>Baggage Allowance</h5>
                <p>${f.baggage || "23 KG"}</p>
              </div>
              <div class="meta-item">
                <h5>Cabin Class</h5>
                <p>${f.flightClass || "Economy"}</p>
              </div>
              <div class="meta-item">
                <h5>Fare Basis</h5>
                <p>OLGBN1RE</p>
              </div>
            </div>
          </div>

          ${
            layoverStr
              ? `
            <div class="layover-divider">
              <div style="position: absolute; left: 0; right: 0; top: 50%; height: 2px; border-top: 2px dashed #E2E8F0; z-index: 1;"></div>
              <div style="position: relative; z-index: 2; background: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: 99px; padding: 6px 18px; font-size: 11px; font-weight: 700; color: #B45309; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <span style="font-size: 12px;">⏱️</span>
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
      <div style="font-size: 8px; line-height: 1.4; color: #64748B; border-top: 1px dashed #E2E8F0; padding-top: 10px; margin-top: 20px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #334155;">Foreign &amp; Commonwealth Office Travel Advice:</p>
        <p style="margin: 0 0 10px 0;">The Foreign &amp; Commonwealth Office (FCO) issues travel advice on destinations, which includes information on passports, visas, health, safety, and security. For more information refer to link: https://www.gov.uk/foreign-travel-advice</p>
        
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #0F172A;">NOTES &amp; REGULATORY DISCLOSURES :</p>
        <p style="margin: 0;">1. Reconfirmation of any onward / return journey is passenger responsibility.</p>
        <p style="margin: 0;">2. Timings are subject to change. Please reconfirm with your airline operator before you fly.</p>
        <p style="margin: 0;">3. Present your e-ticket along with your original valid passport at check-in counter to obtain boarding passes.</p>
        <p style="margin: 0;">4. All flight ticket bookings are protected under the UK Civil Aviation Authority ATOL scheme (Reg 11492) and fully backed by our IATA credentials.</p>
      </div>

      <div style="text-align: center; font-size: 9px; font-weight: bold; color: #94A3B8; margin-top: 15px; border-top: 1px solid #E2E8F0; padding-top: 8px;">
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
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
          <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
            <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
            <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
          </svg>
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
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
          <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
            <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
            <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
          </svg>
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
          ${visas
            .map(
              (v: any) => `
            <tr>
              <td><strong>${v.visaType}</strong></td>
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
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
          <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
            <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
            <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
          </svg>
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

      <div class="info-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <div class="info-box">
          <h3>Lead Passenger / Guest</h3>
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
          ${leader && leader.email ? `<p>Email: ${leader.email}</p>` : ""}
          ${leader && leader.phoneNumber ? `<p>Phone: ${leader.phoneNumber}</p>` : ""}
        </div>
        <div class="info-box">
          <h3>Booking Summary</h3>
          <p>Total Scheduled Transfers: <strong>${transfers.length} Leg(s)</strong></p>
          <p>Ground Status: <strong>Confirmed &amp; Secured</strong></p>
        </div>
        <div class="info-box">
          <h3>Fulfillment Vendor Details</h3>
          <p><strong>Vendor Name:</strong> ${transfers[0]?.vendor?.name || "Terrific Travel Ground Partner"}</p>
          <p><strong>Phone:</strong> ${transfers[0]?.vendor?.phoneNumber || "—"}</p>
          ${transfers[0]?.vendor?.supportEmail ? `<p><strong>Email:</strong> ${transfers[0].vendor.supportEmail}</p>` : ""}
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
      <div class="doc-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E2E8F0; padding-bottom: 16px; margin-bottom: 24px;">
        <div class="brand-block">
          ${BRAND_LOGOS.companyLogo}
          <p style="margin-top: 8px; margin-bottom: 0; font-size: 9px; color: #64748B; line-height: 1.4;">
            <strong>Terrific Travel &amp; Tours Ltd</strong><br>
            Address: Office 1, 11 Walford Road, Birmingham, B11 1NP, UK<br>
            Phone: 0121 529 1630 | Emergency: +44 77 0090 0077<br>
            Email: office@terrifictravel.co.uk | Web: www.terrifictravel.co.uk<br>
            ATOL: 11492 | IATA: 91263712 | Reg No: 09384812
          </p>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <div class="logos-block">
            ${BRAND_LOGOS.iataLogo}
            ${BRAND_LOGOS.atolLogo}
          </div>
          <svg width="50" height="50" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #E2E8F0; padding: 4px; border-radius: 4px; background: white; margin-top: 4px;">
            <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm8 0h1v1H9V1zm1 1h1v1h-1V2zm-1 1h1v1H9V3zm3-3h7v7h-7V0zm1 1v5h5V1h-5zm-5 7h1v1H9V8zm1 1h1v1h-1V9zm-1 1h1v1H9v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm4-2h1v1h-1V8zm1 1h1v1h-1V9zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
            <path d="M0 9h7v7H0V9zm1 1v5h5v-5H1zm8 0h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm3-3h7v7h-7V9zm1 1v5h5v-5h-5zm-5 7h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-9 3h1v1H9v-1zm1 1h1v1h-1v-1zm-1 1h1v1H9v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm4-2h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="#0F172A"/>
          </svg>
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
          <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Passenger"}</strong></p>
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
  const balanceDue = Math.max(0, totalPrice - paidAmount);

  const leadPassengerBlock = `
    <p><strong>${leader ? `${leader.title || ""} ${leader.firstName} ${leader.lastName}` : "Valued Customer"}</strong></p>
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
      <td><strong>${p.title || ""} ${p.firstName} ${p.lastName}</strong></td>
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

  const servicesRows = [
    ...(booking.flightServices?.map(
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
    ...(booking.visaServices?.map(
      (v: any) => `
      <tr>
        <td><span style="font-weight: 700; color: #8B5CF6;">VISA</span></td>
        <td>Visa Type: <strong>${v.visaType}</strong></td>
      </tr>
    `,
    ) || []),
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
    html = html.replace(/{{ARRIVE_TIME}}/g, mainFlight.arrivalTime || "—");
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
      /{{VENDOR_NAME}}/g,
      mainFlight.vendor?.name || "Terrific Travel Partner",
    );
    html = html.replace(
      /{{VENDOR_PHONE}}/g,
      mainFlight.vendor?.phoneNumber || "—",
    );
    html = html.replace(
      /{{VENDOR_EMAIL}}/g,
      mainFlight.vendor?.supportEmail || "—",
    );

    html = html.replace(
      /{{PASSENGER_NAME}}/g,
      `${p.title || ""} ${p.firstName} ${p.lastName}`,
    );
    html = html.replace(/{{PASSENGER_DETAILS}}/g, `${p.age || "Adult"}`);
    html = html.replace(/{{SEAT}}/g, p.seat || "—");

    const passengerListHtml = passengers
      .map(
        (pass: any) => `
      <div class="passenger-row">
        <span><strong>${pass.title || ""} ${pass.firstName} ${pass.lastName}</strong></span>
        <span>${pass.age || "Adult"}</span>
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
