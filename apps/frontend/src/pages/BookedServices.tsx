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
  Car,
  Shield,
  PlusCircle,
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
  hotelConfirmationNumber?: string | null;
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

interface TransportServiceItem {
  id: string;
  bookingId: string;
  vehicleType: string;
  departureDestination: string;
  arrivalDestination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  flightNo: string | null;
  passengerName?: string | null;
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

interface VisaServiceItem {
  id: string;
  bookingId: string;
  passportNumber: string;
  visaType: string;
  visaNumber: string | null;
  price: number;
  currency: string;
  issueDate?: string | null;
  expiryDate?: string | null;
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

interface AdditionalServiceItem {
  id: string;
  bookingId: string;
  serviceName: string;
  servicePrice: number;
  price: number;
  currency: string;
  serviceDescription: string | null;
  createdAt: string;
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

  const [activeTab, setActiveTab] = useState<"flights" | "hotels" | "transports" | "visas" | "additionals">("flights");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [flightsPage, setFlightsPage] = useState(1);
  const [hotelsPage, setHotelsPage] = useState(1);
  const [transportsPage, setTransportsPage] = useState(1);
  const [visasPage, setVisasPage] = useState(1);
  const [additionalsPage, setAdditionalsPage] = useState(1);
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
    setTransportsPage(1);
    setVisasPage(1);
    setAdditionalsPage(1);
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

  const isTransportDetailsMissing = (transport: TransportServiceItem) => {
    if (transport.isDone) return false;
    return (
      !transport.vehicleType ||
      transport.vehicleType.trim() === "" ||
      transport.vehicleType.toLowerCase() === "pending" ||
      transport.vehicleType.toLowerCase() === "n/a"
    );
  };

  const isVisaNumberMissing = (visa: VisaServiceItem) => {
    if (visa.isDone) return false;
    return (
      !visa.visaNumber ||
      visa.visaNumber.trim() === "" ||
      visa.visaNumber.toLowerCase() === "pending" ||
      visa.visaNumber.toLowerCase() === "n/a"
    );
  };

  const isAdditionalDetailsMissing = (additional: AdditionalServiceItem) => {
    if (additional.isDone) return false;
    return (
      !additional.serviceName ||
      additional.serviceName.trim() === "" ||
      additional.serviceName.toLowerCase() === "pending" ||
      additional.serviceName.toLowerCase() === "n/a"
    );
  };

  const handleToggleDone = async (id: string) => {
    try {
      await apiClient.patch(`/bookings/booked-services/${id}/toggle-done`);
      queryClient.invalidateQueries({ queryKey: ["booked-flights"] });
      queryClient.invalidateQueries({ queryKey: ["booked-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["booked-transports"] });
      queryClient.invalidateQueries({ queryKey: ["booked-visas"] });
      queryClient.invalidateQueries({ queryKey: ["booked-additionals"] });
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
      queryClient.invalidateQueries({ queryKey: ["booked-transports"] });
      queryClient.invalidateQueries({ queryKey: ["booked-visas"] });
      queryClient.invalidateQueries({ queryKey: ["booked-additionals"] });
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
  });  // Fetch Transports query
  const { data: transportsData, isLoading: transportsLoading } = useQuery({
    queryKey: [
      "booked-transports", 
      transportsPage, 
      searchTerm, 
      showMissingOnly, 
      selectedVendor, 
      vendorSortDir
    ],
    queryFn: async () => {
      const offset = (transportsPage - 1) * limit;
      const res = await apiClient.get(
        `/bookings/booked-services?type=transports&limit=100&search=${searchTerm}`,
      );
      const data = res.data.data.transports;

      // Client-side filter for "missing only"
      let items = data.items as TransportServiceItem[];
      if (showMissingOnly) {
        items = items.filter((t) => isTransportDetailsMissing(t));
      }

      // Client-side filter for selected vendor
      if (selectedVendor) {
        items = items.filter((t) => t.vendor?.name === selectedVendor);
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
    enabled: activeTab === "transports",
  });

  // Fetch Visas query
  const { data: visasData, isLoading: visasLoading } = useQuery({
    queryKey: [
      "booked-visas", 
      visasPage, 
      searchTerm, 
      showMissingOnly, 
      selectedVendor, 
      vendorSortDir
    ],
    queryFn: async () => {
      const offset = (visasPage - 1) * limit;
      const res = await apiClient.get(
        `/bookings/booked-services?type=visas&limit=100&search=${searchTerm}`,
      );
      const data = res.data.data.visas;

      // Client-side filter for "missing only"
      let items = data.items as VisaServiceItem[];
      if (showMissingOnly) {
        items = items.filter((v) => isVisaNumberMissing(v));
      }

      // Client-side filter for selected vendor
      if (selectedVendor) {
        items = items.filter((v) => v.vendor?.name === selectedVendor);
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
    enabled: activeTab === "visas",
  });

  // Fetch Additionals query
  const { data: additionalsData, isLoading: additionalsLoading } = useQuery({
    queryKey: [
      "booked-additionals", 
      additionalsPage, 
      searchTerm, 
      showMissingOnly, 
      selectedVendor, 
      vendorSortDir
    ],
    queryFn: async () => {
      const offset = (additionalsPage - 1) * limit;
      const res = await apiClient.get(
        `/bookings/booked-services?type=additionals&limit=100&search=${searchTerm}`,
      );
      const data = res.data.data.additionals;

      // Client-side filter for "missing only"
      let items = data.items as AdditionalServiceItem[];
      if (showMissingOnly) {
        items = items.filter((ad) => isAdditionalDetailsMissing(ad));
      }

      // Client-side filter for selected vendor
      if (selectedVendor) {
        items = items.filter((ad) => ad.vendor?.name === selectedVendor);
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
    enabled: activeTab === "additionals",
  });

  // Aggregate totals (non-paginated quick counts)
  const { data: summaryCounts } = useQuery({
    queryKey: ["booked-services-summary"],
    queryFn: async () => {
      const res = await apiClient.get(`/bookings/booked-services?limit=1000`);
      const flights = res.data.data.flights.items as FlightServiceItem[];
      const hotels = res.data.data.accommodations.items as AccommodationServiceItem[];
      const transports = res.data.data.transports.items as TransportServiceItem[];
      const visas = res.data.data.visas.items as VisaServiceItem[];
      const additionals = res.data.data.additionals.items as AdditionalServiceItem[];

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

      const missingTransportsCount = transports.filter(
        (t) =>
          !t.isDone &&
          (!t.vehicleType ||
            t.vehicleType.trim() === "" ||
            t.vehicleType.toLowerCase() === "pending" ||
            t.vehicleType.toLowerCase() === "n/a"),
      ).length;

      const missingVisasCount = visas.filter(
        (v) =>
          !v.isDone &&
          (!v.visaNumber ||
            v.visaNumber.trim() === "" ||
            v.visaNumber.toLowerCase() === "pending" ||
            v.visaNumber.toLowerCase() === "n/a"),
      ).length;

      const missingAdditionalsCount = additionals.filter(
        (ad) =>
          !ad.isDone &&
          (!ad.serviceName ||
            ad.serviceName.trim() === "" ||
            ad.serviceName.toLowerCase() === "pending" ||
            ad.serviceName.toLowerCase() === "n/a"),
      ).length;

      return {
        totalFlights: flights.length,
        missingFlights: missingFlightsCount,
        totalHotels: hotels.length,
        missingHotels: missingHotelsCount,
        totalTransports: transports.length,
        missingTransports: missingTransportsCount,
        totalVisas: visas.length,
        missingVisas: missingVisasCount,
        totalAdditionals: additionals.length,
        missingAdditionals: missingAdditionalsCount,
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
    setTransportsPage(1);
    setVisasPage(1);
    setAdditionalsPage(1);
  };

  const handleMissingToggle = () => {
    setShowMissingOnly(!showMissingOnly);
    setFlightsPage(1);
    setHotelsPage(1);
    setTransportsPage(1);
    setVisasPage(1);
    setAdditionalsPage(1);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Flights card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Flights
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Plane size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-foreground">
              {summaryCounts?.totalFlights ?? 0}
            </p>
            {(summaryCounts?.missingFlights ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                <AlertTriangle size={11} /> {summaryCounts?.missingFlights} missing
              </span>
            )}
          </div>
        </div>

        {/* Hotels card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Hotels
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Building size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-foreground">
              {summaryCounts?.totalHotels ?? 0}
            </p>
            {(summaryCounts?.missingHotels ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                <AlertTriangle size={11} /> {summaryCounts?.missingHotels} missing
              </span>
            )}
          </div>
        </div>

        {/* Transports card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Transports
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Car size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-foreground">
              {summaryCounts?.totalTransports ?? 0}
            </p>
            {(summaryCounts?.missingTransports ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                <AlertTriangle size={11} /> {summaryCounts?.missingTransports} missing
              </span>
            )}
          </div>
        </div>

        {/* Visas card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Visas
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Shield size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-foreground">
              {summaryCounts?.totalVisas ?? 0}
            </p>
            {(summaryCounts?.missingVisas ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                <AlertTriangle size={11} /> {summaryCounts?.missingVisas} missing
              </span>
            )}
          </div>
        </div>

        {/* Additionals card */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Additionals
            </span>
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <PlusCircle size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-foreground">
              {summaryCounts?.totalAdditionals ?? 0}
            </p>
            {(summaryCounts?.missingAdditionals ?? 0) > 0 && (
              <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                <AlertTriangle size={11} /> {summaryCounts?.missingAdditionals} missing
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "flights"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane size={13} />
            Flights ({summaryCounts?.totalFlights ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "hotels"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building size={13} />
            Hotels ({summaryCounts?.totalHotels ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("transports")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "transports"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car size={13} />
            Transports ({summaryCounts?.totalTransports ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("visas")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "visas"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield size={13} />
            Visas ({summaryCounts?.totalVisas ?? 0})
          </button>
          <button
            onClick={() => setActiveTab("additionals")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "additionals"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <PlusCircle size={13} />
            Additionals ({summaryCounts?.totalAdditionals ?? 0})
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
              setTransportsPage(1);
              setVisasPage(1);
              setAdditionalsPage(1);
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
                            <div>
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
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {hotel.hotelConfirmationNumber ? (
                                <span className="inline-flex items-center text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                  Conf: {hotel.hotelConfirmationNumber}
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded italic">
                                  No Confirmation No
                                </span>
                              )}
                            </div>
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

        {activeTab === "transports" ? (
          <div>
            {transportsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Loading transport list...</span>
              </div>
            ) : !transportsData?.items || transportsData.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No transport bookings found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="px-4 py-3">REF</th>
                      <th className="px-4 py-3">Vehicle Type</th>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">Date/Time</th>
                      <th className="px-4 py-3">Info</th>
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
                    {transportsData.items.map((t) => {
                      const resMissing = isTransportDetailsMissing(t);
                      return (
                        <tr
                          key={t.id}
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
                                  t.bookingId,
                                  t.booking.bookingReference,
                                  t.booking.lockedStatus
                                );
                              }}
                              className={`hover:underline font-bold text-left flex items-center gap-1.5 ${
                                isAgentOnly && t.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed"
                                  : "text-primary"
                              }`}
                            >
                              {t.booking.bookingReference}
                              {isAgentOnly && t.booking.lockedStatus === "LOCKED" && <Lock size={11} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {t.vehicleType}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.departureDestination} → {t.arrivalDestination}
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {formatDate(t.date)}
                            {getDaysLeftLabel(t.date)}
                            <span className="text-[10px] block text-muted-foreground mt-0.5">
                              {t.departureTime} - {t.arrivalTime}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.passengerName && (
                              <span className="block">Pax: {t.passengerName}</span>
                            )}
                            {t.flightNo && (
                              <span className="block">Flight: {t.flightNo}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.vendor?.name || "-"}
                          </td>
                          {!isAgentOnly && (
                            <td className="px-4 py-3 text-muted-foreground">
                              {t.booking.agent?.name || "-"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {!isAgentOnly ? (
                              <select
                                value={t.vendorPaymentStatus || "PENDING"}
                                onChange={(e) =>
                                  handleUpdateVendorPaymentStatus(
                                    t.bookingId,
                                    t.vendor?.id,
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
                              getPaymentStatusBadge(t.vendorPaymentStatus)
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!t.isDone}
                              onChange={() => handleToggleDone(t.id)}
                              disabled={isAgentOnly}
                              className={`w-4 h-4 rounded border-border text-primary focus:ring-primary ${
                                isAgentOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(t.price, t.currency)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  t.bookingId,
                                  t.booking.bookingReference,
                                  t.booking.lockedStatus
                                );
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                isAgentOnly && t.booking.lockedStatus === "LOCKED"
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
            {transportsData && transportsData.total > limit && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={transportsPage}
                  totalItems={transportsData.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setTransportsPage(p)}
                  itemName="transports"
                />
              </div>
            )}
          </div>
        ) : activeTab === "visas" ? (
          <div>
            {visasLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Loading visa list...</span>
              </div>
            ) : !visasData?.items || visasData.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No visa bookings found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="px-4 py-3">REF</th>
                      <th className="px-4 py-3">Passport No</th>
                      <th className="px-4 py-3">Visa Type</th>
                      <th className="px-4 py-3">Visa Number</th>
                      <th className="px-4 py-3">Issue/Expiry</th>
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
                    {visasData.items.map((v) => {
                      const resMissing = isVisaNumberMissing(v);
                      return (
                        <tr
                          key={v.id}
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
                                  v.bookingId,
                                  v.booking.bookingReference,
                                  v.booking.lockedStatus
                                );
                              }}
                              className={`hover:underline font-bold text-left flex items-center gap-1.5 ${
                                isAgentOnly && v.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed"
                                  : "text-primary"
                              }`}
                            >
                              {v.booking.bookingReference}
                              {isAgentOnly && v.booking.lockedStatus === "LOCKED" && <Lock size={11} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {v.passportNumber}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {v.visaType}
                          </td>
                          <td className="px-4 py-3">
                            {resMissing ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                <AlertTriangle size={10} />
                                MISSING VISA NO
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                                {v.visaNumber}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {v.issueDate ? formatDate(v.issueDate) : "-"}
                            <span className="mx-1 text-muted-foreground">→</span>
                            {v.expiryDate ? formatDate(v.expiryDate) : "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {v.vendor?.name || "-"}
                          </td>
                          {!isAgentOnly && (
                            <td className="px-4 py-3 text-muted-foreground">
                              {v.booking.agent?.name || "-"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {!isAgentOnly ? (
                              <select
                                value={v.vendorPaymentStatus || "PENDING"}
                                onChange={(e) =>
                                  handleUpdateVendorPaymentStatus(
                                    v.bookingId,
                                    v.vendor?.id,
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
                              getPaymentStatusBadge(v.vendorPaymentStatus)
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!v.isDone}
                              onChange={() => handleToggleDone(v.id)}
                              disabled={isAgentOnly}
                              className={`w-4 h-4 rounded border-border text-primary focus:ring-primary ${
                                isAgentOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(v.price, v.currency)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  v.bookingId,
                                  v.booking.bookingReference,
                                  v.booking.lockedStatus
                                );
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                isAgentOnly && v.booking.lockedStatus === "LOCKED"
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
            {visasData && visasData.total > limit && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={visasPage}
                  totalItems={visasData.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setVisasPage(p)}
                  itemName="visas"
                />
              </div>
            )}
          </div>
        ) : activeTab === "additionals" ? (
          <div>
            {additionalsLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                <Loader2 className="animate-spin text-primary" size={24} />
                <span>Loading additional list...</span>
              </div>
            ) : !additionalsData?.items || additionalsData.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No additional services found matching the criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                      <th className="px-4 py-3">REF</th>
                      <th className="px-4 py-3">Service Name</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Date</th>
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
                    {additionalsData.items.map((ad) => {
                      const resMissing = isAdditionalDetailsMissing(ad);
                      return (
                        <tr
                          key={ad.id}
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
                                  ad.bookingId,
                                  ad.booking.bookingReference,
                                  ad.booking.lockedStatus
                                );
                              }}
                              className={`hover:underline font-bold text-left flex items-center gap-1.5 ${
                                isAgentOnly && ad.booking.lockedStatus === "LOCKED"
                                  ? "text-rose-500 cursor-not-allowed"
                                  : "text-primary"
                              }`}
                            >
                              {ad.booking.bookingReference}
                              {isAgentOnly && ad.booking.lockedStatus === "LOCKED" && <Lock size={11} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {ad.serviceName}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {ad.serviceDescription || "-"}
                          </td>
                          <td className="px-4 py-3 text-foreground font-medium">
                            {formatDate(ad.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {ad.vendor?.name || "-"}
                          </td>
                          {!isAgentOnly && (
                            <td className="px-4 py-3 text-muted-foreground">
                              {ad.booking.agent?.name || "-"}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {!isAgentOnly ? (
                              <select
                                value={ad.vendorPaymentStatus || "PENDING"}
                                onChange={(e) =>
                                  handleUpdateVendorPaymentStatus(
                                    ad.bookingId,
                                    ad.vendor?.id,
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
                              getPaymentStatusBadge(ad.vendorPaymentStatus)
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={!!ad.isDone}
                              onChange={() => handleToggleDone(ad.id)}
                              disabled={isAgentOnly}
                              className={`w-4 h-4 rounded border-border text-primary focus:ring-primary ${
                                isAgentOnly ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(ad.price, ad.currency)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                handleOpenBooking(
                                  ad.bookingId,
                                  ad.booking.bookingReference,
                                  ad.booking.lockedStatus
                                );
                              }}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold hover:underline ${
                                isAgentOnly && ad.booking.lockedStatus === "LOCKED"
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
            {additionalsData && additionalsData.total > limit && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={additionalsPage}
                  totalItems={additionalsData.total}
                  itemsPerPage={limit}
                  onPageChange={(p) => setAdditionalsPage(p)}
                  itemName="additionals"
                />
              </div>
            )}
          </div>
        ) : null}
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
          queryClient.invalidateQueries({ queryKey: ["booked-transports"] });
          queryClient.invalidateQueries({ queryKey: ["booked-visas"] });
          queryClient.invalidateQueries({ queryKey: ["booked-additionals"] });
          queryClient.invalidateQueries({
            queryKey: ["booked-services-summary"],
          });
        }}
      />
    </div>
  );
}
