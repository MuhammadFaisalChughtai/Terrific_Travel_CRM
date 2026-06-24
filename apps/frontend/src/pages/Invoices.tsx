import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  FileText,
  Search,
  Filter,
  Printer,
  Edit3,
  Calendar,
  User,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Plane,
  Hotel,
  Car,
  HeartHandshake,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import BookingManager from "../components/BookingManager";
import Modal from "../components/Modal";
import {
  printDocument,
  generateBookingInvoiceHtml,
  generateFlightTicketHtml,
  generateHotelVoucherHtml,
  generateVisaInvoiceHtml,
  generateTransportVoucherHtml,
  generateSpecialServiceInvoiceHtml,
  renderBookingInvoice,
  renderFlightTicket,
  renderHotelVoucher,
  renderTransportVoucher,
  renderVisaInvoice,
  renderSpecialServicesInvoice,
} from "../utils/invoiceTemplates";

export default function InvoicesPage() {
  const queryClient = useQueryClient();

  // Fetch templates for print rendering
  const { data: dbTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await apiClient.get("/templates");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const getTemplateContent = (type: string) => {
    const t = dbTemplates?.find((x: any) => x.templateType.toUpperCase() === type.toUpperCase());
    return t?.htmlContent || "";
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("Any");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  const [isPrintTicketModalOpen, setIsPrintTicketModalOpen] = useState(false);
  const [printTicketSelectedFlight, setPrintTicketSelectedFlight] = useState<any | null>(null);
  const [printTicketSelectedBooking, setPrintTicketSelectedBooking] = useState<any | null>(null);
  const [printTicketSelectedPassenger, setPrintTicketSelectedPassenger] = useState<string>("all");

  // Fetch all bookings (invoices)
  const { data: bookingsResult, isLoading } = useQuery({
    queryKey: ["invoices-list"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings");
      return res.data.data.items || [];
    },
  });

  // Filter bookings on client side
  const filteredBookings = (bookingsResult || []).filter((booking: any) => {
    const refMatch = booking.bookingReference
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    // Check passengers
    const leadPassenger = booking.passengers?.find((p: any) => p.role === "Leader") || booking.passengers?.[0];
    const clientName = leadPassenger 
      ? `${leadPassenger.firstName} ${leadPassenger.lastName}`.toLowerCase()
      : "";
    const nameMatch = clientName.includes(searchTerm.toLowerCase());

    const matchesSearch = refMatch || nameMatch;

    if (paymentStatusFilter === "Any") return matchesSearch;
    return matchesSearch && booking.paymentStatus === paymentStatusFilter;
  });

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeDropdownId === id) {
      setActiveDropdownId(null);
    } else {
      setActiveDropdownId(id);
    }
  };

  React.useEffect(() => {
    const closeDropdowns = () => setActiveDropdownId(null);
    window.addEventListener("click", closeDropdowns);
    return () => window.removeEventListener("click", closeDropdowns);
  }, []);

  return (
    <div className="space-y-6 font-sans text-xs pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border border-border/80 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            Invoicing & Vouchers Center
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Track consolidated customer billing, manage booking invoices, and edit/print travel vouchers.
          </p>
        </div>
      </div>

      {/* Filters & Actions Panel */}
      <div className="bg-card p-4 rounded-xl border border-border/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Booking Ref or Client Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/20 border border-border/80 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
            <Filter size={12} />
            <span>Status:</span>
          </div>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="px-3 py-2 bg-secondary/20 border border-border/80 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="Any">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="UNPAID">UNPAID</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="animate-spin text-primary h-8 w-8" />
            <p className="text-muted-foreground font-medium">Loading invoices list...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground italic">
            No invoices found matching the filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/15 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="px-5 py-3">Booking Ref</th>
                  <th className="px-5 py-3">Client / Passenger</th>
                  <th className="px-5 py-3">Departure Date</th>
                  <th className="px-5 py-3 text-right">Total price</th>
                  <th className="px-5 py-3 text-right">Amount Paid</th>
                  <th className="px-5 py-3 text-right">Balance Due</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBookings.map((booking: any) => {
                  const leadPassenger = booking.passengers?.find((p: any) => p.role === "Leader") || booking.passengers?.[0];
                  const clientName = leadPassenger 
                    ? `${leadPassenger.title || ""} ${leadPassenger.firstName} ${leadPassenger.lastName}`
                    : "No passengers";
                  const clientEmail = leadPassenger?.email || "—";
                  
                  const totalPrice = booking.totalPrice || 0;
                  const paidAmount = booking.paidAmount || 0;
                  const balanceDue = totalPrice - paidAmount;

                  // Render payment status badge
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 uppercase">
                      Unpaid
                    </span>
                  );
                  if (booking.paymentStatus === "PAID") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                        Paid
                      </span>
                    );
                  } else if (booking.paymentStatus === "PARTIAL") {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                        Partial
                      </span>
                    );
                  }

                  return (
                    <tr key={booking.id} className="hover:bg-secondary/5 transition-colors text-[11.5px]">
                      <td className="px-5 py-3.5 font-bold text-foreground">
                        {booking.bookingReference}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{clientName}</span>
                          <span className="text-[10px] text-muted-foreground">{clientEmail}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {booking.departureDate ? new Date(booking.departureDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-foreground">
                        {formatCurrency(totalPrice)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCurrency(paidAmount)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-rose-600 dark:text-rose-400 font-semibold">
                        {formatCurrency(balanceDue)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {statusBadge}
                      </td>
                      <td className="px-5 py-3.5 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Booking & Vouchers */}
                          <button
                            onClick={() => setSelectedBookingId(booking.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-secondary hover:bg-primary/10 text-foreground hover:text-primary rounded-lg border border-border font-bold text-[11px] transition-all"
                            title="Edit invoice, flight tickets, hotel vouchers, transfers, visas, and special services"
                          >
                            <Edit3 size={11} />
                            <span>Edit Voucher</span>
                          </button>

                          {/* Print Invoice */}
                          <button
                            onClick={() => printDocument(renderBookingInvoice(getTemplateContent("BOOKING_INVOICE"), booking), `Booking_Invoice_${booking.bookingReference}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 text-[11px] transition-all"
                            title="Print master booking invoice"
                          >
                            <Printer size={11} />
                            <span>Invoice</span>
                          </button>

                          {/* Vouchers Dropdown */}
                          <div className="relative">
                            <button
                              onClick={(e) => toggleDropdown(booking.id, e)}
                              className="inline-flex items-center gap-1 px-2 py-1.5 bg-secondary text-foreground hover:bg-secondary/85 rounded-lg border border-border font-bold text-[11px]"
                            >
                              <span>Vouchers</span>
                              <ChevronDown size={11} />
                            </button>

                            {activeDropdownId === booking.id && (
                              <div className="absolute right-0 mt-1.5 w-60 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 divide-y divide-border/50 text-left">
                                {/* Flight tickets */}
                                <div className="py-1 px-2">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground px-2 py-1 flex items-center gap-1">
                                    <Plane size={9} />
                                    <span>Flights & Tickets</span>
                                  </div>
                                  {booking.flightServices?.length > 0 ? (
                                    booking.flightServices.map((fs: any) => (
                                      <button
                                        key={fs.id}
                                        onClick={() => {
                                          setPrintTicketSelectedBooking(booking);
                                          setPrintTicketSelectedFlight(fs);
                                          setPrintTicketSelectedPassenger("all");
                                          setIsPrintTicketModalOpen(true);
                                        }}
                                        className="w-full text-left px-2 py-1 hover:bg-secondary rounded text-[11px] truncate"
                                      >
                                        Print {fs.flightNo} (PNR: {fs.pnr || "—"})
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-muted-foreground italic px-2 py-0.5">No flights</div>
                                  )}
                                </div>

                                {/* Hotel vouchers */}
                                <div className="py-1 px-2">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground px-2 py-1 flex items-center gap-1">
                                    <Hotel size={9} />
                                    <span>Hotels</span>
                                  </div>
                                  {booking.accommodations?.length > 0 ? (
                                    booking.accommodations.map((acc: any) => (
                                      <button
                                        key={acc.id}
                                        onClick={() => printDocument(renderHotelVoucher(getTemplateContent("HOTEL_VOUCHER"), booking, acc), `Hotel_Voucher_${acc.id.substring(0,4)}`)}
                                        className="w-full text-left px-2 py-1 hover:bg-secondary rounded text-[11px] truncate"
                                      >
                                        Print {acc.hotelName}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-muted-foreground italic px-2 py-0.5">No hotels</div>
                                  )}
                                </div>
 
                                {/* Visa Invoices */}
                                <div className="py-1 px-2">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground px-2 py-1 flex items-center gap-1">
                                    <FileText size={9} />
                                    <span>Visas</span>
                                  </div>
                                  {booking.visaServices?.length > 0 ? (
                                    booking.visaServices.map((vs: any) => (
                                      <button
                                        key={vs.id}
                                        onClick={() => printDocument(renderVisaInvoice(getTemplateContent("VISA_INVOICE"), booking, vs), `Visa_Invoice_${vs.passportNumber}`)}
                                        className="w-full text-left px-2 py-1 hover:bg-secondary rounded text-[11px] truncate"
                                      >
                                        Print {vs.visaType} ({vs.passportNumber})
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-muted-foreground italic px-2 py-0.5">No visas</div>
                                  )}
                                </div>
 
                                {/* Transport vouchers */}
                                <div className="py-1 px-2">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground px-2 py-1 flex items-center gap-1">
                                    <Car size={9} />
                                    <span>Transfers</span>
                                  </div>
                                  {booking.transportServices?.length > 0 ? (
                                    booking.transportServices.map((ts: any) => (
                                      <button
                                        key={ts.id}
                                        onClick={() => printDocument(renderTransportVoucher(getTemplateContent("TRANSPORT_VOUCHER"), booking, ts), `Transfer_Voucher_${ts.id.substring(0,4)}`)}
                                        className="w-full text-left px-2 py-1 hover:bg-secondary rounded text-[11px] truncate"
                                      >
                                        Print {ts.vehicleType} Transfer
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-muted-foreground italic px-2 py-0.5">No transfers</div>
                                  )}
                                </div>
 
                                {/* Special Services */}
                                <div className="py-1 px-2">
                                  <div className="text-[9px] uppercase font-bold text-muted-foreground px-2 py-1 flex items-center gap-1">
                                    <HeartHandshake size={9} />
                                    <span>Special Services</span>
                                  </div>
                                  {booking.additionalServices?.length > 0 ? (
                                    booking.additionalServices.map((as: any) => (
                                      <button
                                        key={as.id}
                                        onClick={() => printDocument(renderSpecialServicesInvoice(getTemplateContent("SPECIAL_SERVICES"), booking, as), `Special_Service_${as.id.substring(0,4)}`)}
                                        className="w-full text-left px-2 py-1 hover:bg-secondary rounded text-[11px] truncate"
                                      >
                                        Print {as.serviceName}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="text-[10px] text-muted-foreground italic px-2 py-0.5">No special services</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Manager Edit Modal */}
      {selectedBookingId && (
        <BookingManager
          isOpen={!!selectedBookingId}
          bookingId={selectedBookingId}
          onClose={() => {
            setSelectedBookingId(null);
            queryClient.invalidateQueries({ queryKey: ["invoices-list"] });
          }}
        />
      )}
      {/* Print Option Modal */}
      <Modal
        isOpen={isPrintTicketModalOpen}
        onClose={() => setIsPrintTicketModalOpen(false)}
        title="Select Ticket Print Option"
      >
        <div className="p-4 flex flex-col gap-4 text-left font-sans">
          <p className="text-xs text-muted-foreground">
            Choose whether to print a consolidated ticket for all passengers or select an individual passenger.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Select Passenger
            </label>
            <select
              value={printTicketSelectedPassenger}
              onChange={(e) => setPrintTicketSelectedPassenger(e.target.value)}
              className="text-xs py-2 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full"
            >
              <option value="all">Full Family / All Passengers (One page per passenger)</option>
              {printTicketSelectedBooking?.passengers?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.title || ""} {p.firstName} {p.lastName} ({p.role || "Passenger"})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => setIsPrintTicketModalOpen(false)}
              className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-lg text-xs hover:bg-secondary/80 transition-all border border-border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (printTicketSelectedBooking && printTicketSelectedFlight) {
                  printDocument(
                    renderFlightTicket(getTemplateContent("FLIGHT_TICKET"), printTicketSelectedBooking, printTicketSelectedFlight, printTicketSelectedPassenger === "all" ? null : printTicketSelectedPassenger),
                    `E-Ticket_${printTicketSelectedFlight.flightNo}`
                  );
                }
                setIsPrintTicketModalOpen(false);
              }}
              className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
