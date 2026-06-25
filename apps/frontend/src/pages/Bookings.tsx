import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useBookingStore } from "../store/booking.store";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency } from "@tms/shared-utils";
import {
  CalendarRange,
  Plane,
  Hotel,
  Compass,
  Trash2,
  CreditCard,
  Receipt,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wallet,
  Eye,
  Edit,
  Filter,
  Lock,
  Unlock,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import BookingManager from "../components/BookingManager";
import CreateBookingInitModal from "../components/CreateBookingInitModal";
import {
  printDocument,
  renderBookingInvoice,
  generateBookingInvoiceHtml,
} from "../utils/invoiceTemplates";

export default function Bookings() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // Checkout cart Zustand state
  const { flight, hotel, room, tour, clearCart } = useBookingStore();

  const toggleLockMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await apiClient.patch(`/bookings/${bookingId}/lock`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking lock status updated!");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to update booking lock status",
      );
    },
  });

  // Finalize Margin Modal states
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  // Booking Management state
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filters State
  const [filterDepartureDateFrom, setFilterDepartureDateFrom] = useState("");
  const [filterDepartureDateTo, setFilterDepartureDateTo] = useState("");

  const [filterRefVal, setFilterRefVal] = useState("");

  const [filterAgentId, setFilterAgentId] = useState("Any");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterCustomerEmail, setFilterCustomerEmail] = useState("");

  const [filterStatus, setFilterStatus] = useState("Any");
  const [filterLockedStatus, setFilterLockedStatus] = useState("Any");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("Any");

  const [filterPhoneVal, setFilterPhoneVal] = useState("");

  const [filterCreatedAtFrom, setFilterCreatedAtFrom] = useState("");
  const [filterCreatedAtTo, setFilterCreatedAtTo] = useState("");

  // Applied parameters
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  // Query existing bookings with dynamic parameters
  const { data: bookingsResult, isLoading } = useQuery({
    queryKey: ["bookings", JSON.stringify(appliedFilters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFilters.departureDateFrom)
        params.append("departureDateFrom", appliedFilters.departureDateFrom);
      if (appliedFilters.departureDateTo)
        params.append("departureDateTo", appliedFilters.departureDateTo);
      if (appliedFilters.bookingReference) {
        params.append("bookingReference", appliedFilters.bookingReference);
        params.append("bookingReferenceOp", "contains");
      }
      if (appliedFilters.agentId && appliedFilters.agentId !== "Any") {
        params.append("agentId", appliedFilters.agentId);
      }
      if (appliedFilters.customerName)
        params.append("customerName", appliedFilters.customerName);
      if (appliedFilters.customerEmail)
        params.append("customerEmail", appliedFilters.customerEmail);
      if (appliedFilters.status && appliedFilters.status !== "Any") {
        params.append("status", appliedFilters.status);
      }
      if (
        appliedFilters.lockedStatus &&
        appliedFilters.lockedStatus !== "Any"
      ) {
        params.append("lockedStatus", appliedFilters.lockedStatus);
      }
      if (
        appliedFilters.paymentStatus &&
        appliedFilters.paymentStatus !== "Any"
      ) {
        params.append("paymentStatus", appliedFilters.paymentStatus);
      }
      if (appliedFilters.customerPhone) {
        params.append("customerPhone", appliedFilters.customerPhone);
      }
      if (appliedFilters.createdAtFrom)
        params.append("createdAtFrom", appliedFilters.createdAtFrom);
      if (appliedFilters.createdAtTo)
        params.append("createdAtTo", appliedFilters.createdAtTo);

      params.append("limit", "1000");

      const res = await apiClient.get(`/bookings?${params.toString()}`);
      return res.data.data;
    },
  });

  // Query agents list for margin finalization selection
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items || [];
    },
  });

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
    const t = dbTemplates?.find(
      (x: any) => x.templateType.toUpperCase() === type.toUpperCase()
    );
    return t?.htmlContent || "";
  };

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/bookings", data);
      return res.data;
    },
    onSuccess: (res: any) => {
      toast.success("Booking reservation created successfully!");
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create booking.");
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // Finalize booking margin mutation
  const finalizeMarginMutation = useMutation({
    mutationFn: async ({
      bookingId,
      agentId,
    }: {
      bookingId: string;
      agentId: string;
    }) => {
      const res = await apiClient.patch(
        `/bookings/${bookingId}/finalize-margin`,
        { agentId },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Booking margin finalized and agent wallet credited!");
      setIsFinalizeModalOpen(false);
      setSelectedBooking(null);
      setSelectedAgentId("");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to finalize margin.");
    },
  });

  const handleCheckout = async (bookingId: string, amount: number) => {
    try {
      toast.info("Redirecting to payment gateway checkout...");
      const res = await apiClient.post("/payments/checkout", {
        bookingId,
        amount,
        provider: "STRIPE",
      });

      // Mock payment trigger hook
      toast.success("Payment successfully processed! Receipt generated.");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } catch (err: any) {
      toast.error("Payment checkout failed.");
    }
  };

  const handleReserve = () => {
    const items: any[] = [];
    if (flight) {
      items.push({
        itemType: "FLIGHT",
        flightId: flight.id,
        price: flight.price,
      });
    }
    if (room) {
      items.push({ itemType: "HOTEL", roomId: room.id, price: room.price });
    }
    if (tour) {
      items.push({ itemType: "TOUR", tourId: tour.id, price: tour.price });
    }

    if (items.length === 0) {
      toast.error("Your cart is empty! Select a flight, room, or tour first.");
      return;
    }

    createBookingMutation.mutate(items);
  };

  // Helper functions for matching slabs and calculating margins
  const getCommissionRate = (price: number, slabs: any[]) => {
    const slab = slabs?.find(
      (s: any) =>
        price >= s.minSales && (s.maxSales === null || price <= s.maxSales),
    );
    return slab ? slab.commissionRate : 0;
  };

  const calculateMargin = (price: number, slabs: any[]) => {
    const rate = getCommissionRate(price, slabs);
    return price * (rate / 100);
  };

  const bookings = bookingsResult?.items || [];
  const cartPrice =
    (flight?.price || 0) + (room?.price || 0) + (tour?.price || 0);

  const selectedAgent = agents?.find((a: any) => a.id === selectedAgentId);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      departureDateFrom: filterDepartureDateFrom,
      departureDateTo: filterDepartureDateTo,
      bookingReference: filterRefVal,
      agentId: filterAgentId,
      customerName: filterCustomerName,
      customerEmail: filterCustomerEmail,
      status: filterStatus,
      lockedStatus: filterLockedStatus,
      paymentStatus: filterPaymentStatus,
      customerPhone: filterPhoneVal,
      createdAtFrom: filterCreatedAtFrom,
      createdAtTo: filterCreatedAtTo,
    });
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilterDepartureDateFrom("");
    setFilterDepartureDateTo("");
    setFilterRefVal("");
    setFilterAgentId("Any");
    setFilterCustomerName("");
    setFilterCustomerEmail("");
    setFilterStatus("Any");
    setFilterLockedStatus("Any");
    setFilterPaymentStatus("Any");
    setFilterPhoneVal("");
    setFilterCreatedAtFrom("");
    setFilterCreatedAtTo("");
    setAppliedFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Receipt size={28} className="text-primary" />
          Bookings Management
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["bookings"] });
              queryClient.invalidateQueries({ queryKey: ["templates"] });
              toast.success("Booking list refreshed!");
            }}
            className="bg-card text-foreground border border-border p-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center hover:bg-secondary/40"
            title="Refresh Bookings"
          >
            <RotateCw size={15} />
          </button>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-card text-foreground border border-border px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 hover:bg-secondary/40"
          >
            <Filter size={15} />
            Filter Bookings
            {Object.keys(appliedFilters).filter(
              (k) => appliedFilters[k] && appliedFilters[k] !== "Any",
            ).length > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-black ml-1">
                {
                  Object.keys(appliedFilters).filter(
                    (k) => appliedFilters[k] && appliedFilters[k] !== "Any",
                  ).length
                }
              </span>
            )}
          </button>
          <button
            onClick={() => setIsInitModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-1.5"
          >
            <CalendarRange size={15} />
            Create New Booking
          </button>
        </div>
      </div>

      {/* Main Bookings List */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <h3 className="text-base font-bold flex items-center gap-2">
          Active Travel Reservations
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-primary" size={28} />
            <span className="text-sm font-medium">Loading itineraries...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center bg-secondary/10 border border-dashed border-border rounded-2xl text-muted-foreground">
            No historical reservations logged.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-border table-auto text-left">
                <thead>
                  <tr className="bg-secondary/20 text-[11px] uppercase tracking-wider text-muted-foreground font-black border-b border-border">
                    <th className="px-4 py-3 w-12 text-center">No.</th>
                    <th className="px-4 py-3">Ref</th>
                    <th className="px-4 py-3">Booking Date</th>
                    <th className="px-4 py-3">Travel Date</th>
                    <th className="px-4 py-3">Passenger</th>
                    <th className="px-4 py-3">Agent</th>
                    <th className="px-4 py-3 text-right">Total Price</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Remaining</th>
                    <th className="px-4 py-3 text-right">Agent Margin</th>
                    <th className="px-4 py-3 text-right">Vendor Due</th>
                    <th className="px-4 py-3 text-center">Lock</th>
                    <th className="px-4 py-3 text-center">Payment</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/65 text-xs text-foreground bg-card">
                  {bookings.map((booking: any, index: number) => {
                    const firstPassenger = booking.passengers?.[0];
                    const passengerName = firstPassenger
                      ? `${firstPassenger.firstName} ${firstPassenger.lastName}`
                      : booking.user
                        ? `${booking.user.firstName} ${booking.user.lastName} (Account)`
                        : "—";

                    const formatDate = (dateString: any) => {
                      if (!dateString) return "—";
                      const date = new Date(dateString);
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      });
                    };
                    const bookingDate = formatDate(booking.createdAt);
                    const travelDate = formatDate(booking.departureDate);

                    // Dynamic Vendor Payment calculations
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
                      booking.visaServices?.reduce(
                        (sum: number, vs: any) => sum + vs.price,
                        0,
                      ) || 0;

                    const totalVendorCost =
                      accommodationsCost +
                      flightsCost +
                      transportsCost +
                      visasCost;
                    const totalPaidToVendors =
                      booking.vendorPayments?.reduce(
                        (sum: number, vp: any) => sum + vp.amount,
                        0,
                      ) || 0;
                    const vendorRemaining =
                      totalVendorCost - totalPaidToVendors;

                    // Agent Margin calculation
                    const agentMargin =
                      booking.agentId && booking.agent
                        ? calculateMargin(
                            booking.totalPrice,
                            booking.agent.slabs,
                          )
                        : null;

                    // Lock Status Styling - matching user image (dark teal-green or rose-red block)
                    const isLocked = booking.lockedStatus === "LOCKED";
                    const lockBadge = isLocked
                      ? "bg-[#be123c] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                      : "bg-[#0f766e] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]";

                    // Payment Status Styling - matching user image (UNPAID gold block)
                    const payStatus = booking.paymentStatus;
                    const paymentBadge =
                      payStatus === "PAID"
                        ? "bg-[#0f766e] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                        : payStatus === "PARTIALLY_PAID"
                          ? "bg-[#c2410c] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                          : "bg-[#b45309] text-white font-bold px-2.5 py-0.5 rounded-full text-[10px]";

                    // Booking Status
                    const statusText = (booking.status || "").toLowerCase();
                    const statusBadge =
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                        : booking.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                          : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 font-bold px-2.5 py-0.5 rounded-full text-[10px]";

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-secondary/5 transition-colors"
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap text-center text-muted-foreground font-mono align-middle">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold font-mono text-primary align-middle">
                          {booking.bookingReference ||
                            booking.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground align-middle">
                          {bookingDate}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground align-middle">
                          {travelDate}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-medium text-foreground align-middle">
                          {passengerName}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-primary hover:underline cursor-pointer font-medium align-middle">
                          {booking.agent?.name || "—"}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right font-bold text-foreground align-middle">
                          {formatCurrency(booking.totalPrice)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right font-semibold text-emerald-600 dark:text-emerald-400 align-middle">
                          {formatCurrency(booking.paidAmount)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right font-semibold text-muted-foreground align-middle">
                          {formatCurrency(
                            Math.max(
                              0,
                              (booking.totalPrice || 0) -
                                (booking.paidAmount || 0),
                            ),
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right font-semibold text-blue-600 dark:text-blue-400 align-middle">
                          {agentMargin !== null
                            ? formatCurrency(agentMargin)
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right font-semibold text-rose-600 dark:text-rose-400 align-middle">
                          {formatCurrency(vendorRemaining)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-center align-middle">
                          <span
                            className={`inline-block text-[9px] uppercase tracking-wider ${lockBadge}`}
                          >
                            {booking.lockedStatus || "UNLOCKED"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-center align-middle">
                          <span
                            className={`inline-block text-[9px] uppercase tracking-wider ${paymentBadge}`}
                          >
                            {booking.paymentStatus || "UNPAID"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-center align-middle">
                          <span
                            className={`inline-block text-[9px] uppercase tracking-wider ${statusBadge}`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right align-middle pr-6">
                          <div className="inline-flex items-center gap-2 justify-end w-full">
                            <button
                              onClick={() => setSelectedBookingId(booking.id)}
                              className="text-primary hover:text-primary-hover p-1 rounded hover:bg-secondary/35 transition-all"
                              title="View Booking"
                            >
                              <Eye size={15} />
                            </button>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                              onClick={() => setSelectedBookingId(booking.id)}
                              className="text-foreground hover:text-foreground/80 p-1 rounded hover:bg-secondary/35 transition-all"
                              title="Edit Booking"
                            >
                              <Edit size={15} />
                            </button>
                            <span className="text-muted-foreground/30">|</span>
                            <button
                              onClick={() =>
                                toggleLockMutation.mutate(booking.id)
                              }
                              className={`${
                                booking.lockedStatus === "LOCKED"
                                  ? "text-rose-600 hover:text-rose-700"
                                  : "text-emerald-600 hover:text-emerald-700"
                              } p-1 rounded hover:bg-secondary/35 transition-all`}
                              title={
                                booking.lockedStatus === "LOCKED"
                                  ? "Unlock Booking"
                                  : "Lock Booking"
                              }
                              disabled={toggleLockMutation.isPending}
                            >
                              {booking.lockedStatus === "LOCKED" ? (
                                <Lock size={15} />
                              ) : (
                                <Unlock size={15} />
                              )}
                            </button>
                            {booking.status === "CONFIRMED" &&
                              !booking.agentId && (
                                <>
                                  <span className="text-muted-foreground/30">
                                    |
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setIsFinalizeModalOpen(true);
                                    }}
                                    className="text-amber-600 hover:text-amber-700 font-bold text-xs inline-flex items-center gap-1 hover:underline"
                                    title="Finalize Margin"
                                  >
                                    <Receipt size={14} />
                                    <span>Finalize</span>
                                  </button>
                                </>
                              )}

                            {booking.status === "CONFIRMED" && (
                              <>
                                <span className="text-muted-foreground/30">
                                  |
                                </span>
                                <button
                                  onClick={() => {
                                    const template = getTemplateContent("BOOKING_INVOICE");
                                    const html = template
                                      ? renderBookingInvoice(template, booking)
                                      : generateBookingInvoiceHtml(booking);
                                    printDocument(
                                      html,
                                      `Booking_Invoice_${booking.bookingReference || booking.id.substring(0, 8)}`
                                    );
                                  }}
                                  className="text-muted-foreground hover:text-foreground font-bold text-xs inline-flex items-center gap-1 hover:underline"
                                  title="Print Invoice"
                                >
                                  <FileText size={14} />
                                  <span>Invoice</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Finalize Margin Modal */}
      <Modal
        isOpen={isFinalizeModalOpen}
        onClose={() => {
          setIsFinalizeModalOpen(false);
          setSelectedBooking(null);
          setSelectedAgentId("");
        }}
        title="Finalize Booking Margin"
        maxWidth="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-secondary/20 p-3 rounded-lg border border-border/80 text-xs space-y-1">
              <p className="font-semibold text-foreground">
                Booking Reference:{" "}
                <span className="font-mono font-bold text-primary">
                  {selectedBooking.id.toUpperCase()}
                </span>
              </p>
              <p className="text-muted-foreground">
                Booking Total Price:{" "}
                <span className="font-bold text-foreground">
                  {formatCurrency(selectedBooking.totalPrice)}
                </span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                Select Agent
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/20 border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              >
                <option value="">-- Choose an Agent --</option>
                {agents?.map((agent: any) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.client} - {agent.gdsSystem})
                  </option>
                ))}
              </select>
            </div>

            {selectedAgentId && selectedAgent && (
              <div className="border border-border/80 rounded-xl p-4 bg-secondary/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-foreground">
                      {selectedAgent.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Client: {selectedAgent.client} | PCC: {selectedAgent.pcc}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      Wallet Balance
                    </span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedAgent.walletBalance || 0)}
                    </p>
                  </div>
                </div>

                {/* Slabs list with matching one highlighted */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                    Agent Commission Slabs
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    {selectedAgent.slabs?.map((slab: any) => {
                      const isMatched =
                        selectedBooking.totalPrice >= slab.minSales &&
                        (slab.maxSales === null ||
                          selectedBooking.totalPrice <= slab.maxSales);
                      return (
                        <div
                          key={slab.id}
                          className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                            isMatched
                              ? "bg-emerald-500/10 border-emerald-500/40 font-bold text-emerald-800 dark:text-emerald-300"
                              : "bg-background border-border/50 text-muted-foreground"
                          }`}
                        >
                          <span>
                            {slab.maxSales !== null
                              ? `${formatCurrency(slab.minSales)} - ${formatCurrency(slab.maxSales)}`
                              : `${formatCurrency(slab.minSales)}+`}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isMatched
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {slab.commissionRate}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="border-t border-border pt-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-semibold uppercase text-muted-foreground">
                      Calculated Commission
                    </span>
                    <p className="text-foreground">
                      {formatCurrency(selectedBooking.totalPrice)} &times;{" "}
                      {getCommissionRate(
                        selectedBooking.totalPrice,
                        selectedAgent.slabs,
                      )}
                      %
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-semibold uppercase text-muted-foreground">
                      Margin to Deposit
                    </span>
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      +
                      {formatCurrency(
                        calculateMargin(
                          selectedBooking.totalPrice,
                          selectedAgent.slabs,
                        ),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-3 border-t border-border/60 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsFinalizeModalOpen(false);
                  setSelectedBooking(null);
                  setSelectedAgentId("");
                }}
                className="py-1.5 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-lg text-xs transition-all border border-border"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAgentId || finalizeMarginMutation.isPending}
                onClick={() => {
                  if (selectedBooking && selectedAgentId) {
                    finalizeMarginMutation.mutate({
                      bookingId: selectedBooking.id,
                      agentId: selectedAgentId,
                    });
                  }
                }}
                className="py-1.5 px-5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-lg text-xs transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 disabled:opacity-50"
              >
                {finalizeMarginMutation.isPending && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                Finalize & Fund Wallet
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Bookings Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Bookings"
        maxWidth="2xl"
      >
        <form
          onSubmit={handleApplyFilters}
          className="space-y-5 text-xs text-muted-foreground p-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BOOKING REFERENCE */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                BOOKING REFERENCE
              </label>
              <input
                type="text"
                placeholder="Reference"
                value={filterRefVal}
                onChange={(e) => setFilterRefVal(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              />
            </div>

            {/* CUSTOMER NAME CONTAINS */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                CUSTOMER NAME CONTAINS
              </label>
              <input
                type="text"
                placeholder="Name pattern"
                value={filterCustomerName}
                onChange={(e) => setFilterCustomerName(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              />
            </div>

            {/* CUSTOMER EMAIL CONTAINS */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                CUSTOMER EMAIL CONTAINS
              </label>
              <input
                type="text"
                placeholder="Email pattern"
                value={filterCustomerEmail}
                onChange={(e) => setFilterCustomerEmail(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              />
            </div>

            {/* CUSTOMER PHONE NUMBER */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                CUSTOMER PHONE NUMBER
              </label>
              <input
                type="text"
                placeholder="Phone"
                value={filterPhoneVal}
                onChange={(e) => setFilterPhoneVal(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              />
            </div>

            {/* AGENT */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                AGENT
              </label>
              <select
                value={filterAgentId}
                onChange={(e) => setFilterAgentId(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              >
                <option value="Any">Any</option>
                {agents?.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                STATUS
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              >
                <option value="Any">Any</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            {/* LOCKED STATUS */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                LOCKED STATUS
              </label>
              <select
                value={filterLockedStatus}
                onChange={(e) => setFilterLockedStatus(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              >
                <option value="Any">Any</option>
                <option value="LOCKED">LOCKED</option>
                <option value="UNLOCKED">UNLOCKED</option>
              </select>
            </div>

            {/* PAYMENT STATUS */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                PAYMENT STATUS
              </label>
              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
              >
                <option value="Any">Any</option>
                <option value="PAID">PAID</option>
                <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                <option value="UNPAID">UNPAID</option>
              </select>
            </div>

            {/* DEPARTURE DATE */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                DEPARTURE DATE (FROM / TO)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="From"
                  value={filterDepartureDateFrom}
                  onChange={(e) => setFilterDepartureDateFrom(e.target.value)}
                  className="flex-1 bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={filterDepartureDateTo}
                  onChange={(e) => setFilterDepartureDateTo(e.target.value)}
                  className="flex-1 bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
                />
              </div>
            </div>

            {/* CREATED AT */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block">
                CREATED AT (FROM / TO)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="From"
                  value={filterCreatedAtFrom}
                  onChange={(e) => setFilterCreatedAtFrom(e.target.value)}
                  className="flex-1 bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
                />
                <input
                  type="date"
                  placeholder="To"
                  value={filterCreatedAtTo}
                  onChange={(e) => setFilterCreatedAtTo(e.target.value)}
                  className="flex-1 bg-secondary/20 border border-border/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-all focus:bg-background"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={handleClearFilters}
              className="py-1.5 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-lg text-xs transition-all border border-border"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="py-1.5 px-5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold rounded-lg text-xs transition-all shadow-md shadow-primary/10"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </Modal>

      {/* Initial Create Booking Modal */}
      <CreateBookingInitModal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        agents={agents || []}
        onSuccess={(id) => {
          setIsInitModalOpen(false);
          setSelectedBookingId(id);
        }}
      />

      {/* Full Screen Booking Dashboard Modal */}
      <BookingManager
        isOpen={!!selectedBookingId}
        bookingId={selectedBookingId}
        bookingReference={
          bookings.find((b: any) => b.id === selectedBookingId)
            ?.bookingReference
        }
        onClose={() => {
          setSelectedBookingId(null);
        }}
      />
    </div>
  );
}
