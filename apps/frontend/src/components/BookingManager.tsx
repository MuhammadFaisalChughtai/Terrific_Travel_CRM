import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "lucide-react";
import Modal from "./Modal";
import PnrFlightModal from "./PnrFlightModal";
import PassengerModal from "./PassengerModal";
import HotelReservationModal from "./HotelReservationModal";
import TransportReservationModal from "./TransportReservationModal";

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
  const [editingFlight, setEditingFlight] = useState<any | null>(null);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<any | null>(null);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<any | null>(null);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<any | null>(null);

  const handleDeletePassenger = async (passengerId: string) => {
    if (!booking) return;
    const passenger = booking.passengers?.find((p: any) => p.id === passengerId);
    if (!passenger) return;

    const isLeader = passenger.role === "Leader";
    const msg = isLeader
      ? "Warning: You are deleting the Lead Passenger. This booking will no longer have a leader. Are you sure you want to proceed?"
      : "Are you sure you want to delete this passenger?";

    if (!window.confirm(msg)) return;

    const toastId = toast.loading("Deleting passenger...");
    try {
      await apiClient.delete(`/bookings/${booking.id}/passengers/${passengerId}`);
      toast.success("Passenger deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete passenger", { id: toastId });
    }
  };

  const handleDeleteFlight = async (flightServiceId: string) => {
    if (!booking) return;
    if (!window.confirm("Are you sure you want to delete this flight service segment?")) return;

    const toastId = toast.loading("Deleting flight service...");
    try {
      await apiClient.delete(`/bookings/${booking.id}/flights/${flightServiceId}`);
      toast.success("Flight service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete flight service", { id: toastId });
    }
  };

  const handleDeleteAccommodation = async (accommodationId: string) => {
    if (!booking) return;
    if (!window.confirm("Are you sure you want to delete this hotel reservation?")) return;

    const toastId = toast.loading("Deleting hotel reservation...");
    try {
      await apiClient.delete(`/bookings/${booking.id}/accommodations/${accommodationId}`);
      toast.success("Hotel reservation deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete hotel reservation", { id: toastId });
    }
  };

  const handleDeleteTransport = async (transportId: string) => {
    if (!booking) return;
    if (!window.confirm("Are you sure you want to delete this transport service?")) return;

    const toastId = toast.loading("Deleting transport service...");
    try {
      await apiClient.delete(`/bookings/${booking.id}/transports/${transportId}`);
      toast.success("Transport service deleted successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete transport service", { id: toastId });
    }
  };

  const [openSections, setOpenSections] = useState({
    financial: true,
    transactions: true,
    flights: true,
    passengers: true,
    accommodation: true,
    transportation: true,
    visa: true,
    special: true,
  });

  const toggle = (sec: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

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

  const calculateMargin = (price: number, slabs: any[]) => {
    const rate = getCommissionRate(price, slabs);
    return price * (rate / 100);
  };

  // Financial Calculations
  const totalPrice = booking.totalPrice || 0;
  const paidAmount = booking.paidAmount || 0;
  const remainingAmount = booking.remainingAmount || 0;

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

  const totalVendorCost =
    accommodationsCost + flightsCost + transportsCost + visasCost;

  // Agent Margin
  const agentMargin =
    booking.agentId && booking.agent
      ? calculateMargin(totalPrice, booking.agent.slabs)
      : 0;

  const agentCommissionRate =
    booking.agentId && booking.agent
      ? getCommissionRate(totalPrice, booking.agent.slabs)
      : 0;

  // Total Profit
  const profit = totalPrice - totalVendorCost - agentMargin;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking #${booking.bookingReference || bookingReference || "Details"}`}
      maxWidth="4xl"
    >
      <div className="bg-secondary/15 text-foreground pb-6 font-sans -mx-5 -mb-5 -mt-5">
        {/* Header Actions */}
        <div className="bg-card border-b border-border px-5 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
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
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold rounded-lg text-[13px] shadow-md transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="px-5 mt-4 space-y-4 w-full">
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
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-0.5 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
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
                    {booking.transactions?.length > 0 ? (
                      booking.transactions.map((tx: any) => (
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
                            {tx.notes || "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground italic text-[12px]"
                        >
                          No transactions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[10px] transition-colors"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPnrModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Open Converter
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
                                setEditingFlight(fs);
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
                  className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 border border-border text-foreground hover:bg-secondary font-bold rounded text-[12px] transition-colors"
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
                            {acc.hotelName} {acc.city ? `(${acc.city})` : ''}
                          </h4>
                          <div className="flex gap-1">
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
                              )} {acc.checkInTime ? `@ ${acc.checkInTime}` : ''}
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
                              )} {acc.checkOutTime ? `@ ${acc.checkOutTime}` : ''}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-[12px]">
                              Room:
                            </span>
                            <span className="font-medium text-foreground text-[12px]">
                              {acc.roomType} x {acc.qty || 1} ({acc.mealType || 'Room Only'})
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
                  className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 border border-border text-foreground hover:bg-secondary font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
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
                                Date: {new Date(ts.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                {ts.departureTime ? `at ${ts.departureTime}` : ''}
                                {ts.arrivalTime ? ` - ${ts.arrivalTime}` : ''}
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
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 border border-border text-foreground hover:bg-secondary font-bold rounded text-[12px] transition-colors"
                >
                  <Plus size={12} /> Add
                </button>
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
                      <div>
                        <button className="flex items-center gap-1 px-2 py-0.5 border border-primary/20 text-primary hover:bg-primary/5 font-bold rounded text-[12px] transition-colors">
                          <Upload size={10} /> Upload
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

          {/* 7. Special Services Section */}
          <section className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
            <div
              className="px-4 py-3 border-b border-border flex justify-between items-center bg-card cursor-pointer hover:bg-secondary/20 transition-all"
              onClick={() => toggle("special")}
            >
              <h2 className="text-[13px] font-bold text-foreground flex items-center gap-1">
                <HeartHandshake className="text-primary" size={15} />
                Special Requests
              </h2>
              <button className="text-muted-foreground">
                {openSections.special ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
            </div>

            {openSections.special && (
              <div className="p-3">
                <div className="flex items-start gap-2 p-2.5 border border-border rounded-lg bg-secondary/10 text-[13px]">
                  <AlertCircle size={14} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground">Remarks</h4>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed text-[13px]">
                      Status is {booking.status.toLowerCase()}. Created by user
                      ID {booking.userId.substring(0, 8)}...
                    </p>
                  </div>
                </div>
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
    </Modal>
  );
}
