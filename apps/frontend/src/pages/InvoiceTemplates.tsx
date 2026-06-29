import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth.store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import {
  FileText,
  Ticket,
  RotateCcw,
  Save,
  Eye,
  Edit3,
  Printer,
  Hotel,
  Car,
  Globe,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { SHARED_CSS, BRAND_LOGOS } from "../utils/invoiceTemplates";

// ─────────────────────────────────────────────────
// TEMPLATE REGISTRY
// Each entry defines: id, label, icon, defaultHtml
// ─────────────────────────────────────────────────

const BOOKING_INVOICE_DEFAULT = `<!DOCTYPE html>
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
      <p style="margin-top:8px;margin-bottom:0;font-size:9px;color:#64748B;">
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
      <span class="section-badge" style="background:#DCFCE7;color:#15803D;">Status: PAID</span>
    </div>
    <div class="doc-meta">
      <p>Invoice No: <strong>INV-TT1100</strong></p>
      <p>Date: <strong>{{DATE}}</strong></p>
      <p>Booking Ref: <strong>TT1100</strong></p>
      <p>Departure Date: <strong>15 Jul 2026</strong></p>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <h3>Lead Passenger / Client</h3>
      <p><strong>Mr John Smith</strong></p>
      <p>Email: john.smith@example.com</p>
      <p>Phone: +44 7700 900000</p>
      <p>Passport No: AB123456</p>
    </div>
    <div class="info-box">
      <h3>Agent / Account Executive</h3>
      <p><strong>Sarah Johnson</strong></p>
      <p>GDS System: Galileo</p>
      <p>Assigned PCC: 3j63</p>
    </div>
  </div>

  <h3 style="font-size:11px;font-weight:800;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Booking Passenger List</h3>
  <table style="margin-bottom:20px;">
    <thead>
      <tr>
        <th>Passenger Name</th><th>Type/Age</th><th>Passport Number</th><th>Nationality</th><th>Passport Expiry</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Mr John Smith</td><td>Adult (Leader)</td><td>AB123456</td><td>United Kingdom</td><td>05 Jan 2033</td></tr>
      <tr><td>Mrs Jane Smith</td><td>Adult</td><td>AB654321</td><td>United Kingdom</td><td>12 Mar 2031</td></tr>
    </tbody>
  </table>

  <h3 style="font-size:11px;font-weight:800;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Itemized Services &amp; Booking Elements</h3>
  <table>
    <thead>
      <tr><th>Service</th><th>Details</th><th>Qty</th><th style="text-align:right;">Unit Cost</th><th style="text-align:right;">Total</th></tr>
    </thead>
    <tbody>
      <tr><td>✈ Flights</td><td>LHR → DXB → LHR</td><td>1</td><td style="text-align:right;">£800.00</td><td style="text-align:right;">£800.00</td></tr>
      <tr><td>🏨 Hotel</td><td>Burj Al Arab (3 nights)</td><td>1</td><td style="text-align:right;">£600.00</td><td style="text-align:right;">£600.00</td></tr>
      <tr><td>🚐 Transport</td><td>Airport Transfer</td><td>2</td><td style="text-align:right;">£50.00</td><td style="text-align:right;">£100.00</td></tr>
      <tr class="total-row"><td colspan="4" style="text-align:right;font-weight:800;">Sub-Total</td><td style="text-align:right;">£1,500.00</td></tr>
      <tr class="grand-total"><td colspan="4" style="text-align:right;">GRAND TOTAL</td><td style="text-align:right;">£1,500.00</td></tr>
      <tr><td colspan="4" style="text-align:right;color:#16A34A;font-weight:700;">Amount Paid</td><td style="text-align:right;color:#16A34A;font-weight:700;">£1,500.00</td></tr>
      <tr><td colspan="4" style="text-align:right;color:#DC2626;font-weight:800;">Balance Due</td><td style="text-align:right;color:#DC2626;font-weight:800;">£0.00</td></tr>
    </tbody>
  </table>

  <div class="footer-bar">
    Terrific Travel &amp; Tours Ltd | Registered in England &amp; Wales | Company No: 12345678 | ATOL No: 11492<br>
    Thank you for booking with us. All prices include applicable taxes unless stated otherwise.
  </div>
</div>
</body>
</html>`;

const FLIGHT_TICKET_DEFAULT = `<!DOCTYPE html>
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
      <div style="font-size:14px;font-weight:900;color:#0F172A;">TT1100</div>
      <div style="font-size:9px;color:#94A3B8;margin-top:2px;">Issued: {{DATE}}</div>
    </div>
  </div>

  <div class="ticket-card">
    <div class="airline-row">
      <div>
        <div class="airline-name">✈ Terrific Travel — Flight Itinerary</div>
        <div style="font-size:10px;opacity:0.7;margin-top:2px;">Economy Class · EK 001</div>
      </div>
      <div class="pnr-badge">
        <div class="pnr-label">PNR</div>
        <div class="pnr-value">ABC123</div>
      </div>
    </div>

    <div class="route-row">
      <div style="text-align:center;">
        <div class="airport-code">LHR</div>
        <div class="airport-city">London Heathrow</div>
        <div style="font-size:12px;font-weight:700;margin-top:6px;">09:00</div>
      </div>
      <div class="route-line">
        <div style="font-size:9px;opacity:0.6;text-transform:uppercase;letter-spacing:1px;">Direct · 7h 15m</div>
        <div class="route-dashes"></div>
        <div style="font-size:11px;opacity:0.7;">→</div>
      </div>
      <div style="text-align:center;">
        <div class="airport-code">DXB</div>
        <div class="airport-city">Dubai International</div>
        <div style="font-size:12px;font-weight:700;margin-top:6px;">19:15</div>
      </div>
    </div>

    <div class="flight-details-grid">
      <div class="detail-item"><label>Date</label><span>15 Jul 2026</span></div>
      <div class="detail-item"><label>Flight Class</label><span>Economy (Y)</span></div>
      <div class="detail-item"><label>Baggage</label><span>23 KG</span></div>
      <div class="detail-item"><label>Carry-On</label><span>7 KG</span></div>
    </div>
  </div>

  <div class="passenger-section">
    <h3>Passengers on this Itinerary</h3>
    <div class="passenger-row"><span><strong>Mr John Smith</strong></span><span>Adult · Passport: AB123456</span><span>Seat: 24A</span></div>
    <div class="passenger-row"><span><strong>Mrs Jane Smith</strong></span><span>Adult · Passport: AB654321</span><span>Seat: 24B</span></div>
  </div>

  <div class="footer-bar">
    Terrific Travel &amp; Tours Ltd | ATOL No: 11492 | accounts@terrifictravel.co.uk | +44 20 7946 0958<br>
    This is an e-ticket. Please present this document along with a valid passport at check-in.
  </div>
</div>
</body>
</html>`;

const HOTEL_VOUCHER_DEFAULT = `<!DOCTYPE html>
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
      <div style="font-size:10px;font-weight:700;opacity:0.7;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Hotel Accommodation Voucher</div>
      <div class="hotel-name">Burj Al Arab</div>
      <span class="badge">Confirmed · Ref: TT1100</span>
    </div>
    <div style="text-align:right;">
      ${BRAND_LOGOS.companyLogo.replace("height: 60px", "height: 40px")}
      <div style="font-size:8px;opacity:0.7;margin-top:4px;">accounts@terrifictravel.co.uk</div>
    </div>
  </div>

  <div class="voucher-body">
    <div class="checkin-row">
      <div class="date-box">
        <div class="date-label">Check-In</div>
        <div class="date-value">15 Jul 2026</div>
        <div style="font-size:9px;color:#64748B;margin-top:2px;">After 14:00</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;">
        <div>
          <div class="nights-badge">3</div>
          <div class="nights-label" style="text-align:center;font-size:8px;color:#64748B;">Nights</div>
        </div>
      </div>
      <div class="date-box">
        <div class="date-label">Check-Out</div>
        <div class="date-value">18 Jul 2026</div>
        <div style="font-size:9px;color:#64748B;margin-top:2px;">Before 12:00</div>
      </div>
    </div>

    <div class="info-row">
      <div class="info-cell"><label>Room Type</label><span>Deluxe Sea View Suite</span></div>
      <div class="info-cell"><label>Meal Plan</label><span>Bed &amp; Breakfast</span></div>
      <div class="info-cell"><label>Reservation No.</label><span>HV-98765432</span></div>
      <div class="info-cell"><label>Total Guests</label><span>2 Adults</span></div>
    </div>

    <h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 6px;">Guest List</h3>
    <table class="passenger-table">
      <thead><tr><th>Guest Name</th><th>Type</th><th>Passport</th></tr></thead>
      <tbody>
        <tr><td>Mr John Smith</td><td>Adult</td><td>AB123456</td></tr>
        <tr><td>Mrs Jane Smith</td><td>Adult</td><td>AB654321</td></tr>
      </tbody>
    </table>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · accounts@terrifictravel.co.uk<br>
      Please present this voucher at check-in. All special requests are subject to availability.
    </div>
  </div>
</div>
</body>
</html>`;

const TRANSPORT_VOUCHER_DEFAULT = `<!DOCTYPE html>
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
        <div style="font-size:20px;font-weight:900;">Al Sultan Transport</div>
        <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Confirmed · Ref: TT1100</span>
      </div>
      <div style="text-align:right;font-size:9px;opacity:0.8;">
        Terrific Travel &amp; Tours Ltd<br>
        accounts@terrifictravel.co.uk
      </div>
    </div>
  </div>

  <div class="transport-body">
    <div class="route-visual">
      <div class="route-point">
        <label>Pickup Location</label>
        <span>Dubai International Airport (DXB)</span>
      </div>
      <div class="route-arrow">→</div>
      <div class="route-point">
        <label>Drop-Off Location</label>
        <span>Burj Al Arab, Dubai</span>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-box"><label>Date</label><span>15 Jul 2026</span></div>
      <div class="detail-box"><label>Pickup Time</label><span>19:45</span></div>
      <div class="detail-box"><label>Vehicle Type</label><span>Luxury Coach</span></div>
      <div class="detail-box"><label>Passengers</label><span>2 Adults</span></div>
      <div class="detail-box"><label>Driver Contact</label><span>+971 50 000 0000</span></div>
      <div class="detail-box"><label>Booking Ref</label><span>TV-123456</span></div>
    </div>

    <h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 6px;">Passenger List</h3>
    <table class="passenger-table">
      <thead><tr><th>Name</th><th>Type</th><th>Passport</th></tr></thead>
      <tbody>
        <tr><td>Mr John Smith</td><td>Adult</td><td>AB123456</td></tr>
        <tr><td>Mrs Jane Smith</td><td>Adult</td><td>AB654321</td></tr>
      </tbody>
    </table>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · accounts@terrifictravel.co.uk<br>
      Please have this voucher ready. The driver will meet you at arrivals with a name board.
    </div>
  </div>
</div>
</body>
</html>`;

const VISA_INVOICE_DEFAULT = `<!DOCTYPE html>
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
      <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Ref: TT1100</span>
    </div>
    <div style="text-align:right;font-size:9px;opacity:0.8;">
      Terrific Travel &amp; Tours Ltd<br>
      accounts@terrifictravel.co.uk<br>
      Date: {{DATE}}
    </div>
  </div>

  <div class="visa-body">
    <table>
      <thead>
        <tr><th>Passport No.</th><th>Passenger</th><th>Visa Type</th><th>Visa No.</th><th>Issue Date</th><th>Expiry Date</th><th style="text-align:right;">Fee</th></tr>
      </thead>
      <tbody>
        <tr><td>AB123456</td><td>Mr John Smith</td><td>Tourist Visa</td><td>UAE-2026-001</td><td>10 Jul 2026</td><td>10 Oct 2026</td><td style="text-align:right;">£35.00</td></tr>
        <tr><td>AB654321</td><td>Mrs Jane Smith</td><td>Tourist Visa</td><td>UAE-2026-002</td><td>10 Jul 2026</td><td>10 Oct 2026</td><td style="text-align:right;">£35.00</td></tr>
        <tr class="total-row"><td colspan="6" style="text-align:right;font-weight:800;">Total Visa Fees</td><td style="text-align:right;font-weight:800;">£70.00</td></tr>
      </tbody>
    </table>

    <div style="margin-top:16px;background:#EDE9FE;border:1px solid #DDD6FE;border-radius:8px;padding:12px 16px;font-size:10px;">
      <strong>Important:</strong> Visa processing times are subject to embassy working days. Please ensure all documents submitted are valid.
    </div>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · ATOL Protected · Reg No: 11492 · accounts@terrifictravel.co.uk
    </div>
  </div>
</div>
</body>
</html>`;

const SPECIAL_SERVICES_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Special Services Invoice Template</title>
<style>
${SHARED_CSS}
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
      <span style="font-size:8px;font-weight:800;background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:99px;text-transform:uppercase;">Ref: TT1100</span>
    </div>
    <div style="text-align:right;font-size:9px;opacity:0.8;">
      Terrific Travel &amp; Tours Ltd<br>
      accounts@terrifictravel.co.uk<br>
      Date: {{DATE}}
    </div>
  </div>

  <div class="special-body">
    <table>
      <thead>
        <tr><th>Vendor</th><th>Service Name</th><th>Description</th><th style="text-align:right;">Price</th></tr>
      </thead>
      <tbody>
        <tr><td>Turkish Airlines</td><td>Special Seat</td><td>Exit row seat with extra legroom</td><td style="text-align:right;">£15.00</td></tr>
        <tr><td>Turkish Airlines</td><td>Special Meal</td><td>Vegetarian meal pre-order</td><td style="text-align:right;">£10.00</td></tr>
        <tr><td>Hotel</td><td>Airport Greeter</td><td>Meet &amp; greet at arrival terminal</td><td style="text-align:right;">£25.00</td></tr>
        <tr class="total-row"><td colspan="3" style="text-align:right;font-weight:800;">Total Special Services</td><td style="text-align:right;font-weight:800;">£50.00</td></tr>
      </tbody>
    </table>

    <div class="footer-bar">
      Terrific Travel &amp; Tours Ltd · accounts@terrifictravel.co.uk<br>
      All special service requests are subject to vendor availability and confirmation.
    </div>
  </div>
</div>
</body>
</html>`;

// ─────────────────────────────────────────────
// Template definitions
// ─────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "booking_invoice",
    label: "Booking Invoice",
    icon: FileText,
    color: "from-blue-600 to-indigo-700",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description:
      "Main client-facing booking invoice with passenger list, itemized services and totals.",
    defaultHtml: BOOKING_INVOICE_DEFAULT,
  },
  {
    id: "flight_ticket",
    label: "Flight Ticket",
    icon: Ticket,
    color: "from-slate-700 to-slate-900",
    iconColor: "text-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
    description:
      "E-ticket itinerary card with route visualization, PNR, baggage allowance and passenger list.",
    defaultHtml: FLIGHT_TICKET_DEFAULT,
  },
  {
    id: "hotel_voucher",
    label: "Hotel Voucher",
    icon: Hotel,
    color: "from-cyan-700 to-teal-800",
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    description:
      "Hotel accommodation voucher with check-in/out dates, room type and guest list.",
    defaultHtml: HOTEL_VOUCHER_DEFAULT,
  },
  {
    id: "transport_voucher",
    label: "Transport Voucher",
    icon: Car,
    color: "from-emerald-700 to-green-800",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    description:
      "Transfer and transport voucher with route, pickup time and vehicle details.",
    defaultHtml: TRANSPORT_VOUCHER_DEFAULT,
  },
  {
    id: "visa_invoice",
    label: "Visa Processing Invoice",
    icon: Globe,
    color: "from-violet-700 to-purple-800",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    description:
      "Per-passenger visa fee invoice with passport numbers, visa type and expiry details.",
    defaultHtml: VISA_INVOICE_DEFAULT,
  },
  {
    id: "special_services",
    label: "Special / Additional Services Invoice",
    icon: Sparkles,
    color: "from-orange-700 to-red-800",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    description:
      "Invoice for ancillary and special services like extra baggage, meals, greeters.",
    defaultHtml: SPECIAL_SERVICES_DEFAULT,
  },
];

// ─────────────────────────────────────────────
// Single template editor panel
// ─────────────────────────────────────────────
// PLACEHOLDERS LEGEND BY TEMPLATE TYPE
// ─────────────────────────────────────────────
const PLACEHOLDERS_BY_TYPE: Record<
  string,
  Array<{ key: string; description: string }>
> = {
  booking_invoice: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{INVOICE_NO}}", description: "Invoice number" },
    { key: "{{TODAY}}", description: "Current date formatted" },
    { key: "{{DEPARTURE_DATE}}", description: "Date of first departure" },
    { key: "{{PAYMENT_STATUS}}", description: "Booking payment status" },
    {
      key: "{{LEAD_PASSENGER_BLOCK}}",
      description: "HTML card of lead passenger details",
    },
    { key: "{{AGENT_BLOCK}}", description: "HTML card of agent details" },
    {
      key: "{{PASSENGERS_TABLE_ROWS}}",
      description: "HTML rows of passengers list",
    },
    {
      key: "{{SERVICES_TABLE_ROWS}}",
      description: "HTML rows of itemized booking services",
    },
    { key: "{{SUBTOTAL}}", description: "Sum cost of all service items" },
    { key: "{{TOTAL_PRICE}}", description: "Total price of the booking" },
    { key: "{{PAID_AMOUNT}}", description: "Total client payments received" },
    { key: "{{BALANCE_DUE}}", description: "Remaining balance client owes" },
  ],
  flight_ticket: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{DATE}}", description: "Date ticket generated" },
    { key: "{{FLIGHT_NO}}", description: "Flight segment flight number" },
    { key: "{{PNR}}", description: "GDS Passenger Name Record code" },
    { key: "{{DEPART_CODE}}", description: "Airport code departed from" },
    { key: "{{DEPART_CITY}}", description: "Departure city/region" },
    { key: "{{DEPART_TIME}}", description: "Scheduled departure date/time" },
    { key: "{{ARRIVE_CODE}}", description: "Airport code arrived at" },
    { key: "{{ARRIVE_CITY}}", description: "Arrival city/region" },
    { key: "{{ARRIVE_TIME}}", description: "Scheduled arrival date/time" },
    { key: "{{FLIGHT_DATE}}", description: "Date of flight segment" },
    { key: "{{FLIGHT_CLASS}}", description: "Class code (e.g. Economy)" },
    { key: "{{BAGGAGE}}", description: "Checked baggage allowance limit" },
    { key: "{{CARRY_ON}}", description: "Carry-on cabin baggage allowance" },
    { key: "{{PASSENGER_NAME}}", description: "Full passenger name" },
    {
      key: "{{PASSENGER_DETAILS}}",
      description: "Age class and passport number",
    },
    { key: "{{SEAT}}", description: "Assigned seat number" },
  ],
  hotel_voucher: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{HOTEL_NAME}}", description: "Name of hotel accommodation" },
    {
      key: "{{HOTEL_CONFIRMATION_NO}}",
      description: "Hotel confirmation code",
    },
    { key: "{{GDS_CODE}}", description: "Reservation Code" },
    {
      key: "{{LEAD_PASSENGER_BLOCK}}",
      description: "HTML snippet of lead guest info",
    },
    { key: "{{TOTAL_GUESTS}}", description: "Count of all checked-in guests" },
    { key: "{{HOTEL_CITY}}", description: "City or destination region" },
    { key: "{{HOTEL_ADDRESS}}", description: "Exact property address" },
    {
      key: "{{HOTEL_STAY_ROW}}",
      description: "HTML layout row of stay details",
    },
    {
      key: "{{GUESTS_TABLE_ROWS}}",
      description: "HTML table rows of registered guests",
    },
  ],
  transport_voucher: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{VOUCHER_NO}}", description: "Unique transport voucher ID" },
    { key: "{{ISSUE_DATE}}", description: "Date voucher generated" },
    {
      key: "{{LEAD_PASSENGER_BLOCK}}",
      description: "HTML snippet of lead passenger info",
    },
    { key: "{{TOTAL_TRANSFERS}}", description: "Count of transfer legs" },
    {
      key: "{{TRANSFERS_TABLE_ROWS}}",
      description: "HTML table rows of pick-up and drop-off",
    },
    { key: "{{TOTAL_GROUND_COST}}", description: "Total ground cost price" },
  ],
  visa_invoice: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{INVOICE_NO}}", description: "Unique visa invoice ID" },
    { key: "{{ISSUE_DATE}}", description: "Date visa processed" },
    {
      key: "{{LEAD_PASSENGER_BLOCK}}",
      description: "HTML snippet of lead passenger info",
    },
    { key: "{{TOTAL_VISAS}}", description: "Count of visas in list" },
    {
      key: "{{VISAS_TABLE_ROWS}}",
      description: "HTML table rows of applicant visas",
    },
    { key: "{{TOTAL_VISA_COST}}", description: "Sum of visa fees" },
  ],
  special_services: [
    { key: "{{BOOKING_REF}}", description: "Booking unique reference" },
    { key: "{{INVOICE_NO}}", description: "Unique services invoice ID" },
    { key: "{{TODAY}}", description: "Current date formatted" },
    {
      key: "{{LEAD_PASSENGER_BLOCK}}",
      description: "HTML snippet of lead guest info",
    },
    {
      key: "{{TOTAL_SERVICES}}",
      description: "Count of special service items",
    },
    {
      key: "{{SERVICES_TABLE_ROWS}}",
      description: "HTML table rows of custom service details",
    },
    { key: "{{TOTAL_COST}}", description: "Total price of special services" },
  ],
};

interface TemplateEditorPanelProps {
  template: (typeof TEMPLATES)[0];
  isAdmin: boolean;
  initialHtml: string;
  onSave: (htmlContent: string) => Promise<void>;
  onReset: () => Promise<void>;
}

function TemplateEditorPanel({
  template,
  isAdmin,
  initialHtml,
  onSave,
  onReset,
}: TemplateEditorPanelProps) {
  const [html, setHtml] = useState<string>(initialHtml);
  const [isDirty, setIsDirty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isSaved, setIsSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertPlaceholder = (key: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newHtml = before + key + after;
    handleChange(newHtml);

    // Put focus back and place cursor after inserted text
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + key.length;
    }, 0);
  };

  // Sync with initialHtml from parent query state
  useEffect(() => {
    setHtml(initialHtml);
    setIsDirty(false);
  }, [initialHtml]);

  // Update iframe whenever html changes and preview tab is active
  useEffect(() => {
    if (activeTab === "preview" && iframeRef.current) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html, activeTab, isOpen]);

  const handleChange = (val: string) => {
    setHtml(val);
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      await onSave(html);
      setIsDirty(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      // toast is shown in parent mutation
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset to the default template? Any custom edits will be lost.",
      )
    )
      return;
    try {
      await onReset();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      // toast is shown in parent mutation
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 600);
    }
  };

  const Icon = template.icon;

  return (
    <div
      className={`bg-card border ${template.borderColor} rounded-xl overflow-hidden shadow-sm transition-all`}
    >
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/20 transition-all text-left"
      >
        <div
          className={`p-2.5 rounded-lg ${template.bgColor} ${template.iconColor} shrink-0`}
        >
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground">{template.label}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {template.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Unsaved
            </span>
          )}
          {isSaved && (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check size={9} /> Saved
            </span>
          )}
          {isOpen ? (
            <ChevronUp size={15} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={15} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="border-t border-border">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-secondary/10 border-b border-border">
            {/* Tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  activeTab === "editor"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Edit3 size={11} /> Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                title="Print preview"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 transition-all"
              >
                <Printer size={11} /> Print
              </button>
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    title="Reset to default"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-all"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty}
                    title="Save template"
                    className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Save size={11} /> Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Editor / Preview */}
          <div className="h-[600px] flex">
            {activeTab === "editor" ? (
              <div className="flex-1 flex divide-x divide-border">
                {/* Editor Textarea */}
                <div className="flex-1 relative">
                  {!isAdmin && (
                    <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <ShieldAlert size={16} className="text-amber-500" />
                        Admin access required to edit templates.
                      </div>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={html}
                    onChange={(e) => handleChange(e.target.value)}
                    readOnly={!isAdmin}
                    spellCheck={false}
                    className="w-full h-full p-4 font-mono text-[11px] bg-background border-0 focus:outline-none resize-none text-foreground leading-relaxed"
                    style={{
                      fontFamily:
                        "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
                    }}
                  />
                </div>

                {/* Placeholders Legend Sidebar */}
                <div className="w-80 bg-secondary/15 p-4 overflow-y-auto flex flex-col gap-3 select-none">
                  <div>
                    <h4 className="font-bold text-[10px] uppercase tracking-wider text-foreground">
                      Available Placeholders
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Use these tags inside your HTML layout to dynamically
                      render booking data:
                    </p>
                  </div>
                  <div className="divide-y divide-border/50">
                    {(PLACEHOLDERS_BY_TYPE[template.id] || []).map(
                      (placeholder) => (
                        <button
                          type="button"
                          key={placeholder.key}
                          onClick={() => insertPlaceholder(placeholder.key)}
                          disabled={!isAdmin}
                          className="py-2 text-left w-full hover:bg-secondary/35 rounded px-1.5 transition-all flex flex-col gap-0.5 group focus:outline-none focus:bg-secondary/45 border-0 bg-transparent cursor-pointer disabled:cursor-default"
                          title={
                            isAdmin
                              ? `Click to insert ${placeholder.key} at cursor`
                              : ""
                          }
                        >
                          <span className="font-mono text-[10px] text-primary font-bold transition-colors flex items-center justify-between w-full">
                            <span>{placeholder.key}</span>
                            {isAdmin && (
                              <span className="text-[8px] bg-primary/10 text-primary px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-wider">
                                + Insert
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {placeholder.description}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white overflow-hidden">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title={`Preview: ${template.label}`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function InvoiceTemplatesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.roles?.includes("Admin") ||
    user?.roles?.includes("Manager") ||
    user?.roles?.includes("SUPER_ADMIN") ||
    user?.roles?.includes("ADMIN") ||
    false;

  // Query templates from database
  const { data: dbTemplates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await apiClient.get("/templates");
      return res.data.data; // Array of templates
    },
  });

  // Mutation to save/update template
  const saveMutation = useMutation({
    mutationFn: async ({
      type,
      htmlContent,
    }: {
      type: string;
      htmlContent: string;
    }) => {
      const res = await apiClient.put(`/templates/${type}`, { htmlContent });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      const tpl = TEMPLATES.find(
        (t) => t.id.toUpperCase() === variables.type.toUpperCase(),
      );
      toast.success(
        `"${tpl?.label || variables.type}" template saved successfully!`,
      );
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save template");
    },
  });

  // Mutation to reset template
  const resetMutation = useMutation({
    mutationFn: async (type: string) => {
      const res = await apiClient.post(`/templates/${type}/reset`);
      return res.data.data;
    },
    onSuccess: (_, type) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      const tpl = TEMPLATES.find(
        (t) => t.id.toUpperCase() === type.toUpperCase(),
      );
      toast.success(`"${tpl?.label || type}" reset to default factory shell!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset template");
    },
  });

  const handleResetAll = async () => {
    if (
      !window.confirm(
        "Reset ALL templates to their defaults? All custom edits will be lost!",
      )
    )
      return;
    try {
      for (const tpl of TEMPLATES) {
        await resetMutation.mutateAsync(tpl.id.toUpperCase());
      }
      toast.success("All templates successfully reset to defaults.");
    } catch {
      // errors handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium text-muted-foreground">
          Loading templates from database...
        </p>
      </div>
    );
  }

  // Helper to find custom content or fall back to default registry html
  const getTemplateHtml = (id: string, defaultHtml: string) => {
    const matched = dbTemplates?.find(
      (t: any) => t.templateType.toUpperCase() === id.toUpperCase(),
    );
    return matched ? matched.htmlContent : defaultHtml;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Invoice &amp; Voucher Templates
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Customise the HTML/CSS templates used for printing invoices, tickets
            and vouchers. Changes are saved in the central database.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all shrink-0"
          >
            <RotateCcw size={13} /> Reset All Defaults
          </button>
        )}
      </div>

      {/* Role notice for non-admins */}
      {!isAdmin && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm text-amber-700 dark:text-amber-300">
          <ShieldAlert size={16} className="shrink-0 text-amber-500" />
          <span>
            You are in <strong>read-only</strong> mode. Only{" "}
            <strong>Admin</strong> and <strong>Super Admin</strong> users can
            edit and save templates.
          </span>
        </div>
      )}

      {/* Templates */}
      <div className="space-y-3">
        {TEMPLATES.map((tpl) => (
          <TemplateEditorPanel
            key={tpl.id}
            template={tpl}
            isAdmin={isAdmin}
            initialHtml={getTemplateHtml(tpl.id, tpl.defaultHtml)}
            onSave={(htmlContent) =>
              saveMutation.mutateAsync({
                type: tpl.id.toUpperCase(),
                htmlContent,
              })
            }
            onReset={() => resetMutation.mutateAsync(tpl.id.toUpperCase())}
          />
        ))}
      </div>
    </div>
  );
}
