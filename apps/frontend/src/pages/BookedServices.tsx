import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import Pagination from "../components/Pagination";
import BookingManager from "../components/BookingManager";
import { toast } from "sonner";
import {
  Plane,
  Building,
  Search,
  AlertTriangle,
  Filter,
  Loader2,
  ArrowRightLeft,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface FlightServiceItem {
  id: string;
  bookingId: string;
  date: string;
  flightNo: string;
  pnr: string;
  departedFrom: string;
  arrivedAt: string;
  departTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  booking: {
    bookingReference: string;
    lockedStatus?: string;
    agent?: {
      name: string;
    } | null;
  };
  vendor?: {
    id: string;
    name: string;
  } | null;
  combinedRoute?: string;
  segmentsCount?: number;
  isDone?: boolean;
  status?: string;
  pnrMissing?: boolean;
  vendorPaymentStatus?: string;
}

interface AccommodationServiceItem {
  id: string;
  bookingId: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  mealType: string;
  reservationNumber: string | null;
  qty: number;
  price: number;
  currency: string;
  isDone?: boolean;
  booking: {
    bookingReference: string;
    lockedStatus?: string;
    agent?: {
      name: string;
    } | null;
  };
  vendor?: {
    id: string;
    name: string;
  } | null;
  vendorPaymentStatus?: string;
}

export default function BookedServicesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(
    null,
  );
  const isAllowed = user?.roles?.some((r) => {
    const up = r.toUpperCase();
    return [
      "SUPER_ADMIN",
      "ADMIN",
      "AGENT",
      "TRAVEL_AGENT",
      "MANAGER",
      "BRANCH_MANAGER",
    ].includes(up);
  });

  const isAgentOnly = !user?.roles?.some((r) => {
    const up = r.toUpperCase();
    return ["SUPER_ADMIN", "ADMIN", "MANAGER", "BRANCH_MANAGER"].includes(up);
  });

  const handleOpenBooking = (bookingId: string, bookingRef: string, lockedStatus?: string) => {
    if (isAgentOnly && lockedStatus === "LOCKED") {
      toast.error(
        "This booking is locked by the administrator and cannot be accessed.",
        { duration: 4000 }
      );
      return;
    }
    setSelectedBookingId(bookingId);
    setSelectedBookingRef(bookingRef);
  };

  if (!isAllowed) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl max-w-xl mx-auto mt-12">
        Access Denied: This monitor page is only accessible to Admin, Manager or
        Agent users.
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<"flights" | "hotels">("flights");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [flightsPage, setFlightsPage] = useState(1);
  const [hotelsPage, setHotelsPage] = useState(1);
  const limit = 10;

  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorSortDir, setVendorSortDir] = useState<"asc" | "desc" | null>(null);

  const handleToggleVendorSort = () => {
    if (vendorSortDir === null) {
      setVendorSortDir("asc");
    } else if (vendorSortDir === "asc") {
      setVendorSortDir("desc");
    } else {
      setVendorSortDir(null);
    }
    setFlightsPage(1);
    setHotelsPage(1);
  };

  const isFlightPnrMissing = (flight: FlightServiceItem) => {
    if (flight.isDone) return false;
    return !!flight.pnrMissing;
  };

  const isHotelResMissing = (hotel: AccommodationServiceItem) => {
    if (hotel.isDone) return false;
    return (
      !hotel.reservationNumber ||
      hotel.reservationNumber.trim() === "" ||
      hotel.reservationNumber.toLowerCase() === "pending" ||
      hotel.reservationNumber.toLowerCase() === "n/a"
    );
  };

  const handleToggleDone = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/booked-services/${id}/toggle-done`);
      queryClient.invalidateQueries({ queryKey: ["booked-flights"] });
      queryClient.invalidateQueries({ queryKey: ["booked-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["booked-services-summary"] });
      toast.success("Status updated successfully!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update status");
    }
  };

  const handleUpdateVendorPaymentStatus = async (
    bookingId: string,
    vendorId: string | undefined,
    status: string
  ) => {
    if (!vendorId) {
      toast.error("No vendor associated with this service.");
      return;
    }
    try {
      await apiClient.patch("/bookings/booked-services/vendor-payment-status", {
        bookingId,
        vendorId,
        status,
      });
      queryClient.invalidateQueries({ queryKey: ["booked-flights"] });
      queryClient.invalidateQueries({ queryKey: ["booked-hotels"] });
      toast.success("Vendor payment status updated successfully!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to update vendor payment status");
    }
  };

  // Fetch all vendors for the filter dropdown
  const { data: vendors } = useQuery({
    queryKey: ["vendors-list-booked-services"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors?limit=1000");
      return res.data.data.items as any[];
    },
  });

  // Fetch Flights query
  const { data: flightsData, isLoading: flightsLoading } = useQuery({
    queryKey: [
      "booked-flights", 
      flightsPage, 
      searchTerm, 
      showMissingOnly, 
      selectedVendor, 
      vendorSortDir
    ],
    queryFn: async () => {
      const offset = (flightsPage - 1) * limit;
      const res = await apiClient.get(
        `/bookings/booked-services?type=flights&limit=100&search=${searchTerm}`,
      );
      const data = res.data.data.flights;

      // Client-side filter for "missing only"
      let items = data.items as FlightServiceItem[];
      if (showMissingOnly) {
        items = items.filter((f) => isFlightPnrMissing(f));
      }

      // Client-side filter for selected vendor
      if (selectedVendor) {
        items = items.filter((f) => f.vendor?.name === selectedVendor);
      }

      // Client-side sorting by vendor name
      if (vendorSortDir) {
        items.sort((a, b) => {
          const nameA = a.vendor?.name || "";
          const nameB = b.vendor?.name || "";
          if (vendorSortDir === "asc") {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        });
      }

      // Client-side pagination slice
      const paginatedItems = items.slice(offset, offset + limit);
      return {
        items: paginatedItems,
        total: items.length,
      };
    },
    enabled: activeTab === "flights",
  });

  // Fetch Hotels query
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: [
      "booked-hotels", 
      hotelsPage, 
      searchTerm, 
      showMissingOnly, 
      selectedVendor, 
      vendorSortDir
    ],
    queryFn: async () => {
      const offset = (hotelsPage - 1) * limit;
      const res = await apiClient.get(
        `/bookings/booked-services?type=hotels&limit=100&search=${searchTerm}`,
      );
      const data = res.data.data.accommodations;

      // Client-side filter for "missing only"
      let items = data.items as AccommodationServiceItem[];
      if (showMissingOnly) {
        items = items.filter((h) => isHotelResMissing(h));
      }

      // Client-side filter for selected vendor
      if (selectedVendor) {
        items = items.filter((h) => h.vendor?.name === selectedVendor);
      }

      // Client-side sorting by vendor name
      if (vendorSortDir) {
        items.sort((a, b) => {
          const nameA = a.vendor?.name || "";
          const nameB = b.vendor?.name || "";
          if (vendorSortDir === "asc") {
            return nameA.localeCompare(nameB);
          } else {
            return nameB.localeCompare(nameA);
          }
        });
      }

      // Client-side pagination slice
      const paginatedItems = items.slice(offset, offset + limit);
      return {
        items: paginatedItems,
        total: items.length,
      };
    },
    enabled: activeTab === "hotels",
  });  // Aggregate totals (non-paginated quick counts)
  const { data: summaryCounts } = useQuery({
    queryKey: ["booked-services-summary"],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/booked-services?limit=1000`);
      const flights = res.data.data.flights.items as FlightServiceItem[];
      const hotels = res.data.data.accommodations
        .items as AccommodationServiceItem[];

      const missingFlightsCount = flights.filter(
        (f) =>
          !f.isDone &&
          (!f.pnr ||
            f.pnr.trim() === "" ||
            f.pnr.toLowerCase() === "pending" ||
            f.pnr.toLowerCase() === "n/a"),
      ).length;

      const missingHotelsCount = hotels.filter(
        (h) =>
          !h.isDone &&
          (!h.reservationNumber ||
            h.reservationNumber.trim() === "" ||
            h.reservationNumber.toLowerCase() === "pending" ||
            h.reservationNumber.toLowerCase() === "n/a"),
      ).length;

      return {
        totalFlights: flights.length,
        missingFlights: missingFlightsCount,
        totalHotels: hotels.length,
        missingHotels: missingHotelsCount,
      };
    },
  });

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency:
          currency && currency.length === 3 ? currency.toUpperCase() : "GBP",
      }).format(amount);
    } catch (e) {
      return `${currency || "GBP"} ${amount.toFixed(2)}`;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysLeftLabel = (dateStr: string) => {
    if (!dateStr) return null;
    const travelDate = new Date(dateStr);
    const today = new Date();
    travelDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = travelDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-[10px] text-muted-foreground/60 block">
          Passed
        </span>
      );
    }
    if (diffDays === 0) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 block mt-0.5 w-max">
          Today
        </span>
      );
    }
    if (diffDays === 1) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 block mt-0.5 w-max font-black">
          1 day left
        </span>
      );
    }
    if (diffDays <= 7) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 block mt-0.5 w-max">
          {diffDays} days left
        </span>
      );
    }
    return (
      <span className="text-[10px] text-muted-foreground block mt-0.5">
        {diffDays} days left
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string | undefined) => {
    const s = (status || "UNPAID").toUpperCase();
    if (s === "PAID") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
          Paid
        </span>
      );
    }
    if (s === "PARTIALLY_PAID" || s === "PARTIAL") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
          Partial
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
        Unpaid
      </span>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFlightsPage(1);
    setHotelsPage(1);
  };

  const handleMissingToggle = () => {
    setShowMissingOnly(!showMissingOnly);
    setFlightsPage(1);
    setHotelsPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowRightLeft className="text-primary" size={24} />
            {isAgentOnly ? "My Booked Services" : "Booked Services Monitor"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAgentOnly
              ? "View and manage flight PNRs and hotel reservation confirmations for your bookings."
              : "Operations desk to audit flights and hotel bookings."}
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Total Booked Flights
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Plane size={16} />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">
            {summaryCounts?.totalFlights ?? 0}
          </p>
        </div>

        <div className="bg-rose-500/5 rounded-xl p-4 border border-rose-500/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-rose-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase">
              Missing Flight PNRs
            </span>
            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-rose-600 dark:text-rose-400">
            {summaryCounts?.missingFlights ?? 0}
          </p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Total Booked Hotels
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Building size={16} />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">
            {summaryCounts?.totalHotels ?? 0}
          </p>
        </div>

        <div className="bg-rose-500/5 rounded-xl p-4 border border-rose-500/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-rose-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 uppercase">
              Missing Hotel Res Nos
            </span>
            <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-2xl font-black mt-2 text-rose-600 dark:text-rose-400">
            {summaryCounts?.missingHotels ?? 0}
          </p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "flights"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane size={14} />
            Booked Flights ({summaryCounts?.totalFlights ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "hotels"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building size={14} />
            Booked Hotels ({summaryCounts?.totalHotels ?? 0})
          </button>
        </div>

        {/* Search & Missing filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Missing Toggle */}
          <button
            onClick={handleMissingToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMissingOnly
                ? "bg-rose-500/10 border-rose-500/30 text-rose-600"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter size={13} />
            {showMissingOnly ? "Showing Missing Only" : "Show Missing Only"}
          </button>

          {/* Vendor Filter */}
          <select
            value={selectedVendor}
            onChange={(e) => {
              setSelectedVendor(e.target.value);
              setFlightsPage(1);
              setHotelsPage(1);
            }}
            className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground min-w-[150px]"
          >
            <option value="">All Vendors</option>
            {vendors?.map((v: any) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative w-64">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <input
              type="text"
              placeholder="Search ref, name, PNR..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {activeTab === "flights" ? (
          <div>
            {flightsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Loading flight list...</span>
              </div>
            ) : !flightsData?.items || flightsData.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No flights found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="px-4 py-3">REF</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Flight No</th>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">PNR</th>
                      <th 
                        className="px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
                        onClick={handleToggleVendorSort}
                      >
                        <div className="flex items-center gap-1">
                          Vendor
                          {vendorSortDir === "asc" && <span className="text-[10px]">▲</span>}
                          {vendorSortDir === "desc" && <span className="text-[10px]">▼</span>}
                          {vendorSortDir === null && <span className="text-[10px] opacity-40">⇅</span>}
                        </div>
                      </th>
                      {!isAgentOnly && <th className="px-4 py-3">Agent</th>}
                      <th className="px-4 py-3 text-center">Payment</th>
                      <th className="px-4 py-3 text-center">Fine</th>
                      <th className="px-4 py-3 text-right">Cost</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {flightsData.items.map((flight) => {
                      const pnrMissing = isFlightPnrMissing(flight);
                      return (
                        <tr
                          key={flight.id}
                          className={`hover:bg-secondary/10 transition-colors ${
                            pnrMissing
                              ? "bg-rose-500/[0.07] dark:bg-rose-950/[0.18] border-l-4 border-l-rose-500"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-bold text-foreground">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  flight.bookingId,
                                  flight.booking.bookingReference,
                                  flight.booking.lockedStatus
                                );
                              }}
                              className={`hover:underline font-bold text-left flex items-center gap-1.5 ${
                                isAgentOnly && flight.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed"
                                  : "text-primary"
                              }`}
                            >
                              {flight.booking.bookingReference}
                              {isAgentOnly && flight.booking.lockedStatus === "LOCKED" && <Lock size={11} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDate(flight.date)}
                            {getDaysLeftLabel(flight.date)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">
                              {flight.flightNo}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              {flight.status === "CANCELLED" ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 uppercase">
                                  Cancelled
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 uppercase">
                                  Confirmed
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {flight.combinedRoute ? (
                              <>
                                <span>{flight.combinedRoute}</span>
                                {flight.segmentsCount &&
                                  flight.segmentsCount > 1 && (
                                    <span className="text-[10px] text-muted-foreground block mt-0.5 font-bold text-primary">
                                      {flight.segmentsCount} segments
                                    </span>
                                  )}
                              </>
                            ) : (
                              <>
                                <span className="font-semibold">
                                  {flight.departedFrom}
                                </span>
                                <span className="mx-1 text-muted-foreground">
                                  →
                                </span>
                                <span className="font-semibold">
                                  {flight.arrivedAt}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  {flight.departTime} - {flight.arrivalTime}
                                </span>
                              </>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {!flight.pnr ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                <AlertTriangle size={10} />
                                MISSING PNR
                              </span>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">
                                  {flight.pnr}
                                </span>
                                {flight.pnrMissing && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 w-max uppercase">
                                    <AlertTriangle size={9} />
                                    Missing other PNR
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {flight.vendor?.name || "-"}
                          </td>
                          {!isAgentOnly && (
                            <td className="px-4 py-3 text-muted-foreground">
                              {flight.booking.agent?.name || "-"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {!isAgentOnly ? (
                              <select
                                value={flight.vendorPaymentStatus || "PENDING"}
                                onChange={(e) =>
                                  handleUpdateVendorPaymentStatus(
                                    flight.bookingId,
                                    flight.vendor?.id,
                                    e.target.value
                                  )
                                }
                                className="bg-background border border-border rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground cursor-pointer"
                              >
                                <option value="PENDING">UNPAID</option>
                                <option value="PARTIAL">PARTIAL</option>
                                <option value="PAID">PAID</option>
                              </select>
                            ) : (
                              getPaymentStatusBadge(flight.vendorPaymentStatus)
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!flight.isDone}
                              onChange={() => handleToggleDone(flight.id)}
                              disabled={isAgentOnly}
                              className={`w-4 h-4 rounded border-border text-primary focus:ring-primary ${
                                isAgentOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(flight.price, flight.currency)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  flight.bookingId,
                                  flight.booking.bookingReference,
                                  flight.booking.lockedStatus
                                );
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                isAgentOnly && flight.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed opacity-60"
                                  : "text-primary"
                              }`}
                            >
                              Manage <ExternalLink size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {flightsData && flightsData.total > limit && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={flightsPage}
                  totalItems={flightsData.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setFlightsPage(p)}
                  itemName="flights"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            {hotelsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Loading hotel list...</span>
              </div>
            ) : !hotelsData?.items || hotelsData.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No hotels found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="px-4 py-3">REF</th>
                      <th className="px-4 py-3">Hotel Name</th>
                      <th className="px-4 py-3">Room Type</th>
                      <th className="px-4 py-3">Check-In / Out</th>
                      <th className="px-4 py-3">Reservation No</th>
                      <th 
                        className="px-4 py-3 cursor-pointer select-none hover:text-foreground transition-colors"
                        onClick={handleToggleVendorSort}
                      >
                        <div className="flex items-center gap-1">
                          Vendor
                          {vendorSortDir === "asc" && <span className="text-[10px]">▲</span>}
                          {vendorSortDir === "desc" && <span className="text-[10px]">▼</span>}
                          {vendorSortDir === null && <span className="text-[10px] opacity-40">⇅</span>}
                        </div>
                      </th>
                      {!isAgentOnly && <th className="px-4 py-3">Agent</th>}
                      <th className="px-4 py-3 text-center">Payment</th>
                      <th className="px-4 py-3 text-center">Fine</th>
                      <th className="px-4 py-3 text-right">Cost</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {hotelsData.items.map((hotel) => {
                      const resMissing = isHotelResMissing(hotel);
                      return (
                        <tr
                          key={hotel.id}
                          className={`hover:bg-secondary/10 transition-colors ${
                            resMissing
                              ? "bg-rose-500/[0.07] dark:bg-rose-950/[0.18] border-l-4 border-l-rose-500"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-bold text-foreground">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  hotel.bookingId,
                                  hotel.booking.bookingReference,
                                  hotel.booking.lockedStatus
                                );
                              }}
                              className={`hover:underline font-bold text-left flex items-center gap-1.5 ${
                                isAgentOnly && hotel.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed"
                                  : "text-primary"
                              }`}
                            >
                              {hotel.booking.bookingReference}
                              {isAgentOnly && hotel.booking.lockedStatus === "LOCKED" && <Lock size={11} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {hotel.hotelName}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {hotel.roomType}
                            <span className="text-[10px] block text-muted-foreground/80">
                              Qty: {hotel.qty} | {hotel.mealType || "No Meal"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {formatDate(hotel.checkInDate)}
                            <span className="mx-1 text-muted-foreground">
                              →
                            </span>
                            {formatDate(hotel.checkOutDate)}
                            {getDaysLeftLabel(hotel.checkInDate)}
                          </td>
                          <td className="px-4 py-3">
                            {resMissing ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                <AlertTriangle size={10} />
                                MISSING CONFIRMATION
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                                {hotel.reservationNumber}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {hotel.vendor?.name || "-"}
                          </td>
                          {!isAgentOnly && (
                            <td className="px-4 py-3 text-muted-foreground">
                              {hotel.booking.agent?.name || "-"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {!isAgentOnly ? (
                              <select
                                value={hotel.vendorPaymentStatus || "PENDING"}
                                onChange={(e) =>
                                  handleUpdateVendorPaymentStatus(
                                    hotel.bookingId,
                                    hotel.vendor?.id,
                                    e.target.value
                                  )
                                }
                                className="bg-background border border-border rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground cursor-pointer"
                              >
                                <option value="PENDING">UNPAID</option>
                                <option value="PARTIAL">PARTIAL</option>
                                <option value="PAID">PAID</option>
                              </select>
                            ) : (
                              getPaymentStatusBadge(hotel.vendorPaymentStatus)
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!hotel.isDone}
                              onChange={() => handleToggleDone(hotel.id)}
                              disabled={isAgentOnly}
                              className={`w-4 h-4 rounded border-border text-primary focus:ring-primary ${
                                isAgentOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(hotel.price, hotel.currency)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  hotel.bookingId,
                                  hotel.booking.bookingReference,
                                  hotel.booking.lockedStatus
                                );
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                isAgentOnly && hotel.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed opacity-60"
                                  : "text-primary"
                              }`}
                            >
                              Manage <ExternalLink size={11} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {hotelsData && hotelsData.total > limit && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={hotelsPage}
                  totalItems={hotelsData.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setHotelsPage(p)}
                  itemName="hotels"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Booking Dashboard Modal */}
      <BookingManager
        isOpen={!!selectedBookingId}
        bookingId={selectedBookingId}
        bookingReference={selectedBookingRef || undefined}
        onClose={() => {
          setSelectedBookingId(null);
          setSelectedBookingRef(null);
          queryClient.invalidateQueries({ queryKey: ["booked-flights"] });
          queryClient.invalidateQueries({ queryKey: ["booked-hotels"] });
          queryClient.invalidateQueries({
            queryKey: ["booked-services-summary"],
          });
        }}
      />
    </div>
  );
}
