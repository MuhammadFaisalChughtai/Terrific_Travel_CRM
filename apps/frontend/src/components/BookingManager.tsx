import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import { toast } from "sonner";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Building2,
  BadgePercent,
  Plus,
  Plane,
  Hotel,
  Car,
  FileText,
  HeartHandshake,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlaneTakeoff,
  PlaneLanding,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Users,
  Trash2,
  Save,
  Search,
  CalendarRange,
  X,
  Printer,
  RotateCcw,
} from "lucide-react";
import Modal from "./Modal";
import HtmlEditorModal from "./HtmlEditorModal";
import PnrFlightModal from "./PnrFlightModal";
import PassengerModal from "./PassengerModal";
import HotelReservationModal from "./HotelReservationModal";
import TransportReservationModal from "./TransportReservationModal";
import VisaReservationModal from "./VisaReservationModal";
import AdditionalServiceModal from "./AdditionalServiceModal";
import BookingTransactionModal from "./BookingTransactionModal";
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

interface BookingManagerProps {
  isOpen: boolean;
  bookingId?: string | null;
  bookingReference?: string;
  onClose: () => void;
}

export default function BookingManager({
  isOpen,
  bookingId,
  bookingReference,
  onClose,
}: BookingManagerProps) {
  const queryClient = useQueryClient();
  const [isPnrModalOpen, setIsPnrModalOpen] = useState(false);
  const [pnrModalStep, setPnrModalStep] = useState<"pnr" | "form" | "search">(
    "pnr",
  );
  const [editingFlight, setEditingFlight] = useState<any | null>(null);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<any | null>(null);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<any | null>(
    null,
  );
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<any | null>(null);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<any | null>(null);
  const [isAdditionalModalOpen, setIsAdditionalModalOpen] = useState(false);
  const [editingAdditional, setEditingAdditional] = useState<any | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const handleDeletePassenger = async (passengerId: string) => {
    if (!booking) return;
    const passenger = booking.passengers?.find(
      (p: any) => p.id === passengerId,
    );
    if (!passenger) return;

    const isLeader = passenger.role === "Leader";
    const msg = isLeader
      ? "Warning: You are deleting the Lead Passenger. This booking will no longer have a leader. Are you sure you want to proceed?"
      : "Are you sure you want to delete this passenger?";

    if (!window.confirm(msg)) return;

    const toastId = toast.loading("Deleting passenger...");
    try {
      await apiClient.delete(
        `/bookings/${booking.id}/passengers/${passengerId}`,
      );
      toast.success("Passenger deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete passenger", {
        id: toastId,
      });
    }
  };

  const handleDeleteFlight = async (flightServiceId: string) => {
    if (!booking) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this flight service segment?",
      )
    )
      return;

    const toastId = toast.loading("Deleting flight service...");
    try {
      await apiClient.delete(
        `/bookings/${booking.id}/flights/${flightServiceId}`,
      );
      toast.success("Flight service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete flight service",
        { id: toastId },
      );
    }
  };

  const handleDeleteAccommodation = async (accommodationId: string) => {
    if (!booking) return;
    if (
      !window.confirm("Are you sure you want to delete this hotel reservation?")
    )
      return;

    const toastId = toast.loading("Deleting hotel reservation...");
    try {
      await apiClient.delete(
        `/bookings/${booking.id}/accommodations/${accommodationId}`,
      );
      toast.success("Hotel reservation deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete hotel reservation",
        { id: toastId },
      );
    }
  };

  const handleDeleteTransport = async (transportId: string) => {
    if (!booking) return;
    if (
      !window.confirm("Are you sure you want to delete this transport service?")
    )
      return;

    const toastId = toast.loading("Deleting transport service...");
    try {
      await apiClient.delete(
        `/bookings/${booking.id}/transports/${transportId}`,
      );
      toast.success("Transport service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete transport service",
        { id: toastId },
      );
    }
  };

  const handleDeleteVisa = async (visaServiceId: string) => {
    if (!booking) return;
    if (!window.confirm("Are you sure you want to delete this visa service?"))
      return;

    const toastId = toast.loading("Deleting visa service...");
    try {
      await apiClient.delete(`/bookings/${booking.id}/visas/${visaServiceId}`);
      toast.success("Visa service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete visa service",
        { id: toastId },
      );
    }
  };

  const handleDeleteAdditional = async (serviceId: string) => {
    if (!booking) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this additional service?",
      )
    )
      return;

    const toastId = toast.loading("Deleting additional service...");
    try {
      await apiClient.delete(
        `/bookings/${booking.id}/additional-services/${serviceId}`,
      );
      toast.success("Additional service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete additional service",
        { id: toastId },
      );
    }
  };

  const [openSections, setOpenSections] = useState({
    financial: true,
    editDetails: true,
    transactions: true,
    vendorPayments: true,
    flights: true,
    passengers: true,
    accommodation: true,
    transportation: true,
    visa: true,
    additional: true,
    documents: true,
  });

  const toggle = (sec: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

  // Edit booking details state
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isPrintTicketModalOpen, setIsPrintTicketModalOpen] = useState(false);
  const [printTicketSelectedFlight, setPrintTicketSelectedFlight] = useState<
    any | null
  >(null);
  const [printTicketSelectedPassenger, setPrintTicketSelectedPassenger] = useState<string>("all");
  const [expandedTx, setExpandedTx] = useState<Record<string, boolean>>({});
  const [isHtmlEditorOpen, setIsHtmlEditorOpen] = useState(false);
  const [htmlEditorContent, setHtmlEditorContent] = useState("");
  const [htmlEditorTitle, setHtmlEditorTitle] = useState("");
  const [editTotalPrice, setEditTotalPrice] = useState("");
  const [editAgentId, setEditAgentId] = useState("");
  const [editDepartureDate, setEditDepartureDate] = useState("");

  const startEditing = () => {
    if (booking) {
      setEditTotalPrice(String(booking.totalPrice ?? ""));
      setEditAgentId(booking.agentId ?? "");
      setEditDepartureDate(
        booking.departureDate
          ? new Date(booking.departureDate).toISOString().split("T")[0]
          : "",
      );
    }
    setIsEditingDetails(true);
  };

  const cancelEditing = () => {
    setIsEditingDetails(false);
  };

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

  // Fetch agents for the agent selector
  const { data: agentsList } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items || [];
    },
    enabled: isOpen,
  });

  // Fetch real booking information
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const res = await apiClient.get(`/bookings/${bookingId}`);
      return res.data.data;
    },
    enabled: !!bookingId && isOpen,
  });

  // Sync edit state when booking loads
  useEffect(() => {
    if (booking) {
      setEditTotalPrice(String(booking.totalPrice ?? ""));
      setEditAgentId(booking.agentId ?? "");
      setEditDepartureDate(
        booking.departureDate
          ? new Date(booking.departureDate).toISOString().split("T")[0]
          : "",
      );
    }
  }, [booking?.id]);

  // Mutation: update booking details
  const updateDetailsMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {};
      if (
        editTotalPrice !== "" &&
        editTotalPrice !== String(booking?.totalPrice)
      ) {
        payload.totalPrice = parseFloat(editTotalPrice);
      }
      if (editAgentId !== (booking?.agentId ?? "")) {
        payload.agentId = editAgentId || null;
      }
      const originalDate = booking?.departureDate
        ? new Date(booking.departureDate).toISOString().split("T")[0]
        : "";
      if (editDepartureDate !== originalDate) {
        payload.departureDate = editDepartureDate || null;
      }
      const res = await apiClient.patch(`/bookings/${bookingId}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking details updated!");
      setIsEditingDetails(false);
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to update booking details.",
      );
    },
  });

  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Booking #${bookingReference || "Details"}`}
        maxWidth="4xl"
      >
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
          <p className="text-[13px] font-bold text-muted-foreground">
            Fetching booking details...
          </p>
        </div>
      </Modal>
    );
  }

  if (error || !booking) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Error Loading Booking"
        maxWidth="4xl"
      >
        <div className="flex flex-col items-center justify-center py-16 text-center px-4 space-y-3">
          <AlertCircle className="text-destructive w-10 h-10" />
          <div>
            <h3 className="font-bold text-foreground text-[13px]">
              Failed to load booking information
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Please try again or contact your administrator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-secondary text-foreground rounded-lg font-bold text-[13px] hover:bg-secondary/80 transition-all"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  // Helper functions for matching slabs and calculating margins
  const getCommissionRate = (price: number, slabs: any[]) => {
    const slab = slabs?.find(
      (s: any) =>
        price >= s.minSales && (s.maxSales === null || price <= s.maxSales),
    );
    return slab ? slab.commissionRate : 0;
  };

  const calculateMargin = (price: number, profit: number, slabs: any[]) => {
    const rate = getCommissionRate(price, slabs);
    return profit * (rate / 100);
  };

  // Financial Calculations
  const totalPrice = booking.totalPrice || 0;
  const paidAmount = booking.paidAmount || 0;
  const remainingAmount = Math.max(0, totalPrice - paidAmount);

  // Vendor Cost Calculations
  const accommodationsCost =
    booking.accommodations?.reduce(
      (sum: number, acc: any) => sum + acc.price,
      0,
    ) || 0;
  const flightsCost =
    booking.flightServices?.reduce(
      (sum: number, fs: any) => sum + fs.price,
      0,
    ) || 0;
  const transportsCost =
    booking.transportServices?.reduce(
      (sum: number, ts: any) => sum + ts.price,
      0,
    ) || 0;
  const visasCost =
    booking.visaServices?.reduce((sum: number, vs: any) => sum + vs.price, 0) ||
    0;
  const additionalServicesCost =
    booking.additionalServices?.reduce(
      (sum: number, as: any) => sum + as.servicePrice,
      0,
    ) || 0;

  const totalVendorCost =
    accommodationsCost +
    flightsCost +
    transportsCost +
    visasCost +
    additionalServicesCost;

  // Refund Calculations
  const accommodationsRefund =
    booking.accommodations?.reduce(
      (sum: number, acc: any) => sum + (acc.refundAmount || 0),
      0,
    ) || 0;
  const flightsRefund =
    booking.flightServices?.reduce(
      (sum: number, fs: any) => sum + (fs.refundAmount || 0),
      0,
    ) || 0;
  const transportsRefund =
    booking.transportServices?.reduce(
      (sum: number, ts: any) => sum + (ts.refundAmount || 0),
      0,
    ) || 0;
  const visasRefund =
    booking.visaServices?.reduce(
      (sum: number, vs: any) => sum + (vs.refundAmount || 0),
      0,
    ) || 0;

  const totalVendorRefund =
    accommodationsRefund + flightsRefund + transportsRefund + visasRefund;

  const clientRefund = booking.refundAmount || 0;

  const rawProfit = (totalPrice - clientRefund) - (totalVendorCost - totalVendorRefund);

  // Potential Margin
  const potentialMargin =
    booking.agentId && booking.agent
      ? calculateMargin(totalPrice, rawProfit, booking.agent.slabs)
      : 0;

  const potentialRate =
    booking.agentId && booking.agent
      ? getCommissionRate(totalPrice, booking.agent.slabs)
      : 0;

  // Calculate Agent Margin: if rawProfit <= 0 or if deducting commission would make profit negative/zero, margin is 0
  let agentMargin = 0;
  let agentCommissionRate = 0;

  if (rawProfit > 0) {
    if (rawProfit - potentialMargin <= 0) {
      agentMargin = 0;
      agentCommissionRate = 0;
    } else {
      agentMargin = potentialMargin;
      agentCommissionRate = potentialRate;
    }
  }

  // Total Profit
  const profit = rawProfit - agentMargin;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking #${booking.bookingReference || bookingReference || "Details"}`}
      maxWidth="4xl"
    >
      <div className="bg-secondary/15 text-foreground pb-6 font-sans -mx-5 -mb-5 -mt-5">
        {/* Header Actions */}
        {/* <div className="bg-card border-b border-border px-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground">
              Booking Management Dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-lg text-[13px] border border-border shadow-sm transition-all"
            >
              Close
            </button>
          </div>
        </div> */}

        <div className="px-5 mt-4 space-y-4 w-full">
          {/* 0. Booking Details — view / edit */}
          <section>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              {/* Left accent stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

              {/* ── VIEW MODE ── */}
              {!isEditingDetails && (
                <div className="pl-5 pr-4 py-4 flex items-center justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 flex-1">
                    {/* Total Amount */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Wallet size={10} className="text-muted-foreground" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Total Amount
                        </span>
                      </div>
                      <span className="text-[15px] font-black text-foreground">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>

                    {/* Agent */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <Users size={10} className="text-muted-foreground" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Assigned Agent
                        </span>
                      </div>
                      <span className="text-[14px] font-bold text-foreground">
                        {booking.agent?.name || (
                          <span className="text-muted-foreground italic text-[12px] font-normal">
                            No agent assigned
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Departure Date */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <CalendarRange
                          size={10}
                          className="text-muted-foreground"
                        />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Departure / Travel Date
                        </span>
                      </div>
                      <span className="text-[14px] font-bold text-foreground">
                        {booking.departureDate ? (
                          new Date(booking.departureDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "long", year: "numeric" },
                          )
                        ) : (
                          <span className="text-muted-foreground italic text-[12px] font-normal">
                            Not set
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Print Invoice Button */}
                  <button
                    type="button"
                    onClick={() =>
                      printDocument(
                        renderBookingInvoice(getTemplateContent("BOOKING_INVOICE"), booking),
                        `Booking_Invoice_${booking.bookingReference}`,
                      )
                    }
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold transition-all"
                  >
                    <FileText size={12} />
                    Print Invoice
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={startEditing}
                    className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-secondary hover:bg-primary/10 border border-border hover:border-primary/30 text-foreground hover:text-primary rounded-lg text-xs font-bold transition-all group/edit"
                  >
                    <Pencil
                      size={12}
                      className="group-hover/edit:scale-110 transition-transform"
                    />
                    Edit
                  </button>
                </div>
              )}

              {/* ── EDIT MODE ── */}
              {isEditingDetails && (
                <div className="pl-5 pr-4 pt-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Total Amount */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Wallet size={10} className="text-primary" />
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Total Amount
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black text-sm pointer-events-none">
                          £
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editTotalPrice}
                          onChange={(e) => setEditTotalPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 bg-secondary/20 border border-border/60 rounded-lg text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all"
                          placeholder="0.00"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Agent */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users size={10} className="text-primary" />
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Assigned Agent
                        </label>
                      </div>
                      <select
                        value={editAgentId}
                        onChange={(e) => setEditAgentId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-secondary/20 border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all cursor-pointer"
                      >
                        <option value="">— No Agent —</option>
                        {agentsList?.map((agent: any) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} ({agent.client})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Departure / Travel Date */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <CalendarRange size={10} className="text-primary" />
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Departure / Travel Date
                        </label>
                      </div>
                      <input
                        type="date"
                        value={editDepartureDate}
                        onChange={(e) => setEditDepartureDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-secondary/20 border border-border/60 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background transition-all"
                      />
                    </div>
                  </div>

                  {/* Edit Mode Footer */}
                  <div className="mt-4 pt-3.5 border-t border-border/40 flex items-center justify-between">
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-1.5 px-4 py-2 bg-secondary hover:bg-secondary/70 border border-border text-foreground font-bold rounded-lg text-xs transition-all"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                    <button
                      onClick={() => updateDetailsMutation.mutate()}
                      disabled={updateDetailsMutation.isPending}
                      className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary/90 active:scale-95 text-primary-foreground font-bold rounded-lg text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updateDetailsMutation.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      {updateDetailsMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 1. Financial Overview */}
          <section className="space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 p-1 rounded transition-all"
              onClick={() => toggle("financial")}
            >
              <h2 className="text-[13px] font-bold text-foreground uppercase tracking-wider">
                Financial Overview
              </h2>
              <button className="text-muted-foreground hover:text-foreground">
                {openSections.financial ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {openSections.financial && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Total Payment */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Wallet size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Total Payment
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-foreground">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  {/* Total Pending */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-orange-500 mb-1">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                        Client Pending
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>

                  {/* Total Received */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-emerald-500 mb-1">
                      <ArrowDownRight size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                        Client Received
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(paidAmount)}
                    </span>
                  </div>

                  {/* Total Spent */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-red-500 mb-1">
                      <ArrowUpRight size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Vendor Cost
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalVendorCost)}
                    </span>
                  </div>

                  {/* Agent Margin */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-blue-500 mb-1">
                      <BadgePercent size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                        Agent Margin
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[15px] font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(agentMargin)}
                      </span>
                      {booking.agentId && booking.agent && (
                        <span className="text-[12px] font-semibold text-blue-500/70">
                          ({agentCommissionRate}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total Profit */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-emerald-600 mb-1">
                      <TrendingUp size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        Total Profit
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(profit)}
                    </span>
                  </div>

                  {/* Refund from Vendors */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-violet-500 mb-1">
                      <RotateCcw size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">
                        Refund from Vendors
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-violet-600 dark:text-violet-400">
                      {formatCurrency(totalVendorRefund)}
                    </span>
                  </div>

                  {/* Refund to Client */}
                  <div className="bg-card p-3.5 rounded-lg shadow-sm border border-border flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-rose-400 mb-1">
                      <RotateCcw size={12} className="scale-x-[-1]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Refund to Client
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-rose-500 dark:text-rose-400">
                      {formatCurrency(clientRefund)}
                    </span>
                  </div>
                </div>

                {/* Expected Margin Warning Banner */}
                {booking.agentId &&
                  booking.agent &&
                  (() => {
                    const agentSlabs = booking.agent.slabs || [];
                    const sortedSlabs = [...agentSlabs].sort(
                      (a: any, b: any) => a.minSales - b.minSales,
                    );
                    const tier1 = sortedSlabs[0];
                    if (!tier1) return null;
                    return (
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/15 rounded-lg text-[10.5px] text-amber-700 dark:text-amber-300 shadow-sm">
                        <AlertCircle
                          size={13}
                          className="shrink-0 text-amber-500"
                        />
                        <span>
                          This is expected agent margin. If this month's total
                          profit is less than{" "}
                          <strong className="font-bold underline decoration-wavy decoration-amber-500/35">
                            {formatCurrency(tier1.minSales)}
                          </strong>
                          , then this agent margin should be subject to void.
                        </span>
                      </div>
                    );
                  })()}
              </div>
            )}
          </section>

          {/* 2. Transaction Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("transactions")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Building2 className="text-primary" size={15} />
                Transaction History
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTransactionModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
                <button className="text-muted-foreground">
                  {openSections.transactions ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.transactions && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-secondary/10 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Method</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground divide-y divide-border">
                    {(() => {
                      const clientTransactions = booking.transactions?.filter((tx: any) => {
                        if (!tx.notes) return true;
                        const notesLower = tx.notes.toLowerCase();
                        if (notesLower.includes("vendor payment") || 
                            notesLower.includes("discount received") || 
                            notesLower.includes("vendor refund") ||
                            notesLower.includes("refund from vendor") ||
                            tx.paymentMethod === "Discount") {
                          return false;
                        }
                        return true;
                      }) || [];

                      if (clientTransactions.length === 0) {
                        return (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-4 text-muted-foreground italic text-[12px]"
                            >
                              No transactions recorded.
                            </td>
                          </tr>
                        );
                      }

                      return clientTransactions.map((tx: any) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                            {new Date(tx.paidOn).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-2 font-semibold uppercase">
                            {tx.paymentMethod}
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-emerald-600">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {(() => {
                              if (!tx.notes) return "—";
                              const receiptMatch = tx.notes.match(
                                /(.*)Receipt:\s*(https?:\/\/[^|]+)(.*)/i,
                              );

                              let mainText = tx.notes;
                              let receiptLink: React.ReactNode = null;

                              if (receiptMatch) {
                                const before = receiptMatch[1].trim();
                                const url = encodeURI(receiptMatch[2].trim());
                                const after = receiptMatch[3].trim();
                                mainText = [before, after].filter(Boolean).join(" ") || "No additional notes";
                                receiptLink = (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 hover:underline font-semibold"
                                  >
                                    <FileText size={12} className="shrink-0" />
                                    View Receipt
                                  </a>
                                );
                              }

                              const isExpanded = expandedTx[tx.id] || false;
                              const shouldTruncate = mainText.length > 100;
                              const displayedText = (shouldTruncate && !isExpanded) 
                                ? `${mainText.substring(0, 100)}...` 
                                : mainText;

                              return (
                                <div className="flex flex-col gap-1 max-w-[500px]">
                                  <span>{displayedText}</span>
                                  {shouldTruncate && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedTx(prev => ({ ...prev, [tx.id]: !isExpanded }));
                                      }}
                                      className="text-primary hover:underline text-[10px] font-bold text-left self-start mt-0.5"
                                    >
                                      {isExpanded ? "Show Less" : "Show More"}
                                    </button>
                                  )}
                                  {receiptLink}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 3. Vendor Payments & Status Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("vendorPayments")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Wallet className="text-primary" size={15} />
                Vendor Payments & Balances
              </h2>
              <button className="text-muted-foreground">
                {openSections.vendorPayments ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {openSections.vendorPayments && (
              <div className="p-4 space-y-4">
                {/* Vendor Outstanding summary per vendor on this booking */}
                <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary/15">
                        <th className="py-2 px-3">Vendor</th>
                        <th className="py-2 px-3 text-right">Original Cost</th>
                        <th className="py-2 px-3 text-right">Amount Paid</th>
                        <th className="py-2 px-3 text-right">
                          Remaining Balance
                        </th>
                        <th className="py-2 px-3 text-center">
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-medium">
                      {booking.bookingVendorPayments &&
                      booking.bookingVendorPayments.length > 0 ? (
                        booking.bookingVendorPayments.map((vp: any) => (
                          <tr key={vp.id} className="hover:bg-secondary/5">
                            <td className="py-2.5 px-3 font-semibold text-primary">
                              {vp.vendor.name}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-foreground/80">
                              {formatCurrency(vp.originalCost)}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(vp.amountPaid)}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums font-bold text-foreground">
                              {formatCurrency(vp.remainingBalance)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  vp.status === "PAID"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : vp.status === "PARTIAL"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                                }`}
                              >
                                {vp.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-4 text-center text-muted-foreground text-[11px]"
                          >
                            No vendor payment allocations initialized.
                            assignment services to vendors first.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Allocation Timeline / Payment History */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Payment Allocation History
                  </h3>
                  <div className="space-y-2">
                    {booking.vendorPaymentAllocations &&
                    booking.vendorPaymentAllocations.length > 0 ? (
                      booking.vendorPaymentAllocations.map((alloc: any) => (
                        <div
                          key={alloc.id}
                          className={`flex items-start justify-between gap-3 p-3 border rounded-lg text-[11px] ${
                            alloc.isReversed
                              ? "border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400"
                              : "border-border bg-secondary/15 text-foreground"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold">
                              <span className="text-primary font-mono">
                                {alloc.vendorPayment.referenceNumber}
                              </span>
                              <span>•</span>
                              <span className="text-muted-foreground">
                                {alloc.vendorPayment.paymentMethod}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Processed By:{" "}
                              {alloc.vendorPayment.createdBy
                                ? `${alloc.vendorPayment.createdBy.firstName} ${alloc.vendorPayment.createdBy.lastName}`
                                : "System"}{" "}
                              • {new Date(alloc.createdAt).toLocaleString()}
                            </p>
                            {alloc.vendorPayment.notes && (
                              <p className="text-[10px] italic text-muted-foreground/80">
                                Notes: {alloc.vendorPayment.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="block font-black text-xs">
                              {alloc.isReversed ? "-" : "+"}
                              {formatCurrency(alloc.amount)}
                            </span>
                            {alloc.isReversed && (
                              <span className="block text-[8px] font-bold uppercase tracking-wider text-red-500 mt-0.5">
                                Reversed
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-muted-foreground text-[11px] border border-dashed rounded-lg">
                        No payment allocations found for this booking.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── Passenger Details Section ──────────────────────── */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border bg-card cursor-pointer hover:bg-secondary/20 transition-all flex justify-between items-center"
              onClick={() => toggle("passengers")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Users className="text-primary" size={15} />
                Passenger Details
                {booking.passengers?.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {booking.passengers.length}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingPassenger(null);
                    setIsPassengerModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add Passenger
                </button>
                <button className="text-muted-foreground">
                  {openSections.passengers ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.passengers && (
              <div className="overflow-x-auto">
                {booking.passengers?.length > 0 ? (
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-secondary/10 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Age / DOB</th>
                        <th className="px-3 py-2 text-left">Contact</th>
                        <th className="px-3 py-2 text-left">Passport</th>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th className="px-3 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {booking.passengers.map((p: any) => {
                        const ageCat = p.age || "";
                        let ageBadge =
                          "bg-emerald-100 text-emerald-700 border-emerald-200";
                        if (ageCat.startsWith("Infant"))
                          ageBadge =
                            "bg-pink-100 text-pink-700 border-pink-200";
                        else if (ageCat.startsWith("Child"))
                          ageBadge =
                            "bg-blue-100 text-blue-700 border-blue-200";
                        else if (ageCat.startsWith("Youth"))
                          ageBadge =
                            "bg-amber-100 text-amber-700 border-amber-200";
                        return (
                          <tr
                            key={p.id}
                            className="hover:bg-secondary/10 transition-all"
                          >
                            {/* Name */}
                            <td className="px-3 py-2">
                              <div className="font-bold text-foreground">
                                {p.title} {p.firstName} {p.lastName}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {p.nationality || "—"}
                              </div>
                            </td>
                            {/* Age */}
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${ageBadge}`}
                              >
                                {ageCat || "Adult"}
                              </span>
                              {p.dateOfBirth && (
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {new Date(p.dateOfBirth).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}
                                </div>
                              )}
                            </td>
                            {/* Contact */}
                            <td className="px-3 py-2">
                              <div className="text-foreground">
                                {p.email || "—"}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {p.phoneNumber || "—"}
                              </div>
                            </td>
                            {/* Passport */}
                            <td className="px-3 py-2">
                              <div className="font-mono text-foreground">
                                {p.passportNumber || "—"}
                              </div>
                              {p.passportExpiryDate && (
                                <div className="text-[10px] text-muted-foreground">
                                  Exp:{" "}
                                  {new Date(
                                    p.passportExpiryDate,
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              )}
                            </td>
                            {/* Role */}
                            <td className="px-3 py-2">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {p.role}
                              </span>
                            </td>
                            {/* Actions */}
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingPassenger(p);
                                    setIsPassengerModalOpen(true);
                                  }}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                                  title="Edit Passenger"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  onClick={() => handleDeletePassenger(p.id)}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                                  title="Delete Passenger"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-4 text-muted-foreground italic text-[12px]">
                    No passengers added yet.
                  </p>
                )}
              </div>
            )}
          </section>
          {/* 3. Flight Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border bg-card cursor-pointer hover:bg-secondary/20 transition-all flex justify-between items-center"
              onClick={() => toggle("flights")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Plane className="text-primary" size={15} />
                Flights & PNR
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFlight(null);
                    setPnrModalStep("form");
                    setIsPnrModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add Flight
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFlight(null);
                    setPnrModalStep("pnr");
                    setIsPnrModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> PNR Converter
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFlight(null);
                    setPnrModalStep("search");
                    setIsPnrModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Search size={12} /> Add Existing Flight
                </button>
                {/* <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (booking) {
                      printDocument(generateBookingInvoiceHtml(booking), `Invoice_${booking.bookingReference || booking.id}`);
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 font-bold rounded text-[12px] transition-colors"
                >
                  <FileText size={12} /> Print Invoice
                </button> */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      booking &&
                      booking.flightServices &&
                      booking.flightServices.length > 0
                    ) {
                      setPrintTicketSelectedFlight(booking.flightServices[0]);
                      setPrintTicketSelectedPassenger("all");
                      setIsPrintTicketModalOpen(true);
                    } else {
                      toast.error(
                        "No flights registered in this booking to print.",
                      );
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-sky-600/10 text-sky-600 hover:bg-sky-600/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Printer size={12} /> Print Tickets
                </button>
                <button className="text-muted-foreground">
                  {openSections.flights ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.flights && (
              <div className="px-4 py-3 bg-card space-y-3">
                <div className="space-y-2">
                  {booking.flightServices?.length > 0 ? (
                    [...booking.flightServices]
                      .sort(
                        (a: any, b: any) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime(),
                      )
                      .map((fs: any) => (
                        <div
                          key={fs.id}
                          className="border border-border rounded-lg p-2.5 flex justify-between items-center gap-2 hover:border-primary/20 transition-all text-[12px]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-secondary rounded flex items-center justify-center font-bold text-muted-foreground text-[10px]">
                              FLT
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground text-[13px]">
                                {fs.flightNo}
                              </h4>
                              <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                                PNR: {fs.pnr || "—"}
                              </p>
                              {fs.date && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  Date:{" "}
                                  {new Date(fs.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              )}
                              {fs.issueDate && (
                                <p className="text-[10px] text-muted-foreground">
                                  Issued:{" "}
                                  {new Date(fs.issueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-1 justify-center">
                            <div className="text-right">
                              <p className="font-semibold text-foreground text-[13px]">
                                {fs.departTime || "—"}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-bold">
                                {fs.departedFrom}
                              </p>
                            </div>
                            <div className="flex flex-col items-center w-12 relative">
                              <div className="h-[1px] w-full bg-border absolute top-1/2 -translate-y-1/2"></div>
                              <PlaneTakeoff
                                size={10}
                                className="text-primary absolute top-1/2 -translate-y-1/2 bg-card px-0.5"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-foreground text-[13px]">
                                {fs.arrivalTime || "—"}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-bold">
                                {fs.arrivedAt}
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex items-center gap-2">
                            <div className="text-right">
                              <p className="font-bold text-foreground text-[13px]">
                                {formatCurrency(fs.price)}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase">
                                {fs.flightClass || "Y"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrintTicketSelectedFlight(fs);
                                setPrintTicketSelectedPassenger("all");
                                setIsPrintTicketModalOpen(true);
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-emerald-600 transition-all"
                              title="Print E-Ticket"
                            >
                              <FileText size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingFlight(fs);
                                setPnrModalStep("form");
                                setIsPnrModalOpen(true);
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                              title="Edit Flight"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFlight(fs.id);
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                              title="Delete Flight"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center py-3 text-muted-foreground italic text-[12px]">
                      No flights registered.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* 4. Accommodation Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("accommodation")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Hotel className="text-primary" size={15} />
                Hotel Details
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAccommodation(null);
                    setIsHotelModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
                <button className="text-muted-foreground">
                  {openSections.accommodation ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.accommodation && (
              <div className="p-3">
                {booking.accommodations?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {booking.accommodations.map((acc: any) => (
                      <div
                        key={acc.id}
                        className="border border-border rounded-lg p-2.5 relative text-[12px]"
                      >
                        <span className="absolute -top-2.5 left-2 bg-card px-1 text-[8px] font-bold text-emerald-600 border border-emerald-200 rounded uppercase">
                          Confirmed
                        </span>

                        <div className="flex justify-between items-start mt-0.5">
                          <h4 className="font-bold text-foreground">
                            {acc.hotelName} {acc.city ? `(${acc.city})` : ""}
                          </h4>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                printDocument(
                                  renderHotelVoucher(getTemplateContent("HOTEL_VOUCHER"), booking, acc),
                                  `Hotel_Voucher_${acc.hotelName.replace(/\s+/g, "_")}`,
                                );
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-emerald-600 transition-all"
                              title="Print Hotel Voucher"
                            >
                              <FileText size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAccommodation(acc);
                                setIsHotelModalOpen(true);
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                              title="Edit Hotel"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAccommodation(acc.id);
                              }}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                              title="Delete Hotel"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-0.5 mt-1.5">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-[12px]">
                              In:
                            </span>
                            <span className="font-medium text-foreground text-[12px]">
                              {new Date(acc.checkInDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}{" "}
                              {acc.checkInTime ? `@ ${acc.checkInTime}` : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-[12px]">
                              Out:
                            </span>
                            <span className="font-medium text-foreground text-[12px]">
                              {new Date(acc.checkOutDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}{" "}
                              {acc.checkOutTime ? `@ ${acc.checkOutTime}` : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-[12px]">
                              Room:
                            </span>
                            <span className="font-medium text-foreground text-[12px]">
                              {acc.roomType} x {acc.qty || 1} (
                              {acc.mealType || "Room Only"})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground font-bold text-[12px]">
                              Price:
                            </span>
                            <span className="font-bold text-foreground text-[12px]">
                              {formatCurrency(acc.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-3 text-muted-foreground italic text-[12px]">
                    No hotels registered.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* 5. Transportation Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("transportation")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <Car className="text-primary" size={15} />
                Transfers
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTransport(null);
                    setIsTransportModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
                {booking.transportServices?.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      printDocument(
                        renderTransportVoucher(getTemplateContent("TRANSPORT_VOUCHER"), booking, "all"),
                        `Combined_Transfers_${booking.bookingReference || booking.id.substring(0, 8)}`,
                      );
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 font-bold rounded text-[12px] transition-colors"
                  >
                    <Printer size={12} /> Print All
                  </button>
                )}
                <button className="text-muted-foreground">
                  {openSections.transportation ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.transportation && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-secondary/10 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="px-4 py-2">Vehicle</th>
                      <th className="px-4 py-2">Route / Details</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground divide-y divide-border">
                    {booking.transportServices?.length > 0 ? (
                      booking.transportServices.map((ts: any) => (
                        <tr
                          key={ts.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="px-4 py-2.5 font-medium flex items-center gap-1 text-[12px]">
                            <Car size={12} className="text-muted-foreground" />
                            {ts.vehicleType}
                          </td>
                          <td className="px-4 py-2.5 text-[12px]">
                            <p className="font-semibold text-foreground text-[13px]">
                              {ts.departureDestination} &rarr;{" "}
                              {ts.arrivalDestination}
                            </p>
                            <div className="flex flex-col gap-0.5 mt-0.5 text-[10px] text-muted-foreground">
                              <p>
                                Date:{" "}
                                {new Date(ts.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                {ts.departureTime
                                  ? `at ${ts.departureTime}`
                                  : ""}
                                {ts.arrivalTime ? ` - ${ts.arrivalTime}` : ""}
                              </p>
                              {ts.flightNo && (
                                <p className="text-primary font-medium">
                                  Flight: {ts.flightNo}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold text-[12px]">
                            {formatCurrency(ts.price)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-[12px]">
                            <div className="flex gap-1 justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  printDocument(
                                    renderTransportVoucher(getTemplateContent("TRANSPORT_VOUCHER"), booking, ts),
                                    `Transfer_Voucher_${ts.id.substring(0, 4)}`,
                                  );
                                }}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-emerald-600 transition-all"
                                title="Print Transport Voucher"
                              >
                                <FileText size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTransport(ts);
                                  setIsTransportModalOpen(true);
                                }}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                                title="Edit Transport"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTransport(ts.id);
                                }}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                                title="Delete Transport"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground italic text-[12px]"
                        >
                          No transfers registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 6. Visa Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("visa")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <FileText className="text-primary" size={15} />
                Visa Processing
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingVisa(null);
                    setIsVisaModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
                {booking.visaServices?.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      printDocument(
                        renderVisaInvoice(getTemplateContent("VISA_INVOICE"), booking, "all"),
                        `Combined_Visa_Invoice_${booking.bookingReference || booking.id.substring(0, 8)}`,
                      );
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 font-bold rounded text-[12px] transition-colors"
                  >
                    <Printer size={12} /> Print All
                  </button>
                )}
                <button className="text-muted-foreground">
                  {openSections.visa ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.visa && (
              <div className="p-3 space-y-2">
                {booking.visaServices?.length > 0 ? (
                  booking.visaServices.map((vs: any) => (
                    <div
                      key={vs.id}
                      className="border border-border rounded-lg p-2 flex items-center justify-between hover:bg-secondary/10 transition-colors text-[12px]"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Passport
                          </p>
                          <p className="font-semibold text-foreground font-mono text-[13px]">
                            {vs.passportNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Type
                          </p>
                          <p className="font-semibold text-foreground text-[13px]">
                            {vs.visaType}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Price
                          </p>
                          <p className="font-semibold text-foreground text-[13px]">
                            {formatCurrency(vs.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            printDocument(
                              renderVisaInvoice(getTemplateContent("VISA_INVOICE"), booking, vs),
                              `Visa_Invoice_${vs.passportNumber}`,
                            );
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-emerald-600 transition-all"
                          title="Print Visa Invoice"
                        >
                          <FileText size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingVisa(vs);
                            setIsVisaModalOpen(true);
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                          title="Edit Visa"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVisa(vs.id);
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                          title="Delete Visa"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-3 text-muted-foreground italic text-[12px]">
                    No visa services registered.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* 7. Additional Services Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("additional" as any)}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <HeartHandshake className="text-primary" size={15} />
                Additional Services
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAdditional(null);
                    setIsAdditionalModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
                {booking.additionalServices?.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      printDocument(
                        renderSpecialServicesInvoice(getTemplateContent("SPECIAL_SERVICES"), booking, "all"),
                        `Combined_Special_Services_${booking.bookingReference || booking.id.substring(0, 8)}`,
                      );
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 font-bold rounded text-[12px] transition-colors"
                  >
                    <Printer size={12} /> Print All
                  </button>
                )}
                <button className="text-muted-foreground">
                  {openSections.additional ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>

            {openSections.additional && (
              <div className="p-3 space-y-2">
                {booking.additionalServices?.length > 0 ? (
                  booking.additionalServices.map((as: any) => (
                    <div
                      key={as.id}
                      className="border border-border rounded-lg p-2 flex items-center justify-between hover:bg-secondary/10 transition-colors text-[12px]"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Vendor
                          </p>
                          <p className="font-semibold text-foreground text-[13px]">
                            {as.vendor?.name || as.customVendorName || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Service Name
                          </p>
                          <p className="font-semibold text-foreground text-[13px]">
                            {as.serviceName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                            Price
                          </p>
                          <p className="font-semibold text-foreground text-[13px]">
                            {formatCurrency(as.servicePrice)}
                          </p>
                        </div>
                        {as.serviceDescription && (
                          <div className="hidden md:block">
                            <p className="text-[8px] text-muted-foreground font-bold uppercase mb-0.5">
                              Description
                            </p>
                            <p className="text-muted-foreground text-[12px] truncate max-w-[200px]">
                              {as.serviceDescription}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            printDocument(
                              renderSpecialServicesInvoice(getTemplateContent("SPECIAL_SERVICES"), booking, as),
                              `Special_Service_${as.id.substring(0, 4)}`,
                            );
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-emerald-600 transition-all"
                          title="Print Service Invoice"
                        >
                          <FileText size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAdditional(as);
                            setIsAdditionalModalOpen(true);
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-all"
                          title="Edit Service"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAdditional(as.id);
                          }}
                          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-rose-600 transition-all"
                          title="Delete Service"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-3 text-muted-foreground italic text-[12px]">
                    No additional services registered.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <PnrFlightModal
        isOpen={isPnrModalOpen}
        onClose={() => {
          setIsPnrModalOpen(false);
          setEditingFlight(null);
        }}
        bookingId={booking.id}
        bookingYear={
          booking.departureDate
            ? new Date(booking.departureDate).getFullYear()
            : new Date().getFullYear()
        }
        flightToEdit={editingFlight}
        initialStep={pnrModalStep}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <PassengerModal
        isOpen={isPassengerModalOpen}
        onClose={() => {
          setIsPassengerModalOpen(false);
          setEditingPassenger(null);
        }}
        bookingId={booking.id}
        passengerToEdit={editingPassenger}
        bookingPassengers={booking.passengers}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <HotelReservationModal
        isOpen={isHotelModalOpen}
        onClose={() => {
          setIsHotelModalOpen(false);
          setEditingAccommodation(null);
        }}
        bookingId={booking.id}
        accommodationToEdit={editingAccommodation}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <TransportReservationModal
        isOpen={isTransportModalOpen}
        onClose={() => {
          setIsTransportModalOpen(false);
          setEditingTransport(null);
        }}
        bookingId={booking.id}
        booking={booking}
        transportToEdit={editingTransport}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <VisaReservationModal
        isOpen={isVisaModalOpen}
        onClose={() => {
          setIsVisaModalOpen(false);
          setEditingVisa(null);
        }}
        bookingId={booking.id}
        booking={booking}
        visaToEdit={editingVisa}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <AdditionalServiceModal
        isOpen={isAdditionalModalOpen}
        onClose={() => {
          setIsAdditionalModalOpen(false);
          setEditingAdditional(null);
        }}
        bookingId={booking.id}
        serviceToEdit={editingAdditional}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <BookingTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        bookingId={booking.id}
        bookingReference={booking.bookingReference}
        booking={booking}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        }}
      />

      <Modal
        isOpen={isPrintTicketModalOpen}
        onClose={() => setIsPrintTicketModalOpen(false)}
        title="Select Ticket Print Option"
      >
        <div className="p-4 flex flex-col gap-4 text-left font-sans">
          <p className="text-xs text-muted-foreground">
            Choose whether to print a consolidated ticket for all passengers or
            select an individual passenger.
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
              <option value="all">
                Full Family / All Passengers (One page per passenger)
              </option>
              {booking?.passengers?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.title || ""} {p.firstName} {p.lastName} (
                  {p.role || "Passenger"})
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
                if (booking && printTicketSelectedFlight) {
                  printDocument(
                    renderFlightTicket(
                      getTemplateContent("FLIGHT_TICKET"),
                      booking,
                      printTicketSelectedFlight,
                      printTicketSelectedPassenger === "all"
                        ? null
                        : printTicketSelectedPassenger,
                    ),
                    `E-Ticket_${printTicketSelectedFlight.flightNo}`,
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
    </Modal>
  );
}
