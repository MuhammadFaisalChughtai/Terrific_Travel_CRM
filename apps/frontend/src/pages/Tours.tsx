import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency } from "@tms/shared-utils";
import { useBookingStore } from "../store/booking.store";
import {
  Compass,
  Plus,
  X,
  Calendar,
  DollarSign,
  Tag,
  ArrowUpRight,
  Search,
  Loader2,
  RotateCw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import BookingManager from "../components/BookingManager";

export default function Tours() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setTour = useBookingStore((state) => state.setTour);

  // Tabs
  const [activeTab, setActiveTab] = useState<"upcoming" | "catalog">(
    "upcoming",
  );

  // Search parameters for catalog
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");

  // Admin Modal for catalog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tourName, setTourName] = useState("");
  const [tourDesc, setTourDesc] = useState("");
  const [tourPrice, setTourPrice] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [tourCategory, setTourCategory] = useState("Leisure");
  const [destName, setDestName] = useState("");
  const [destCountry, setDestCountry] = useState("");
  const [destDesc, setDestDesc] = useState("");

  // Search & Filter state for upcoming bookings
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "NORMAL"
  >("ALL");
  const [searchVal, setSearchVal] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected booking for detailed manager slideover
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const isAdminOrAgent = user?.roles?.some((r) =>
    [
      "Admin",
      "Manager",
      "Agent",
      "SUPER_ADMIN",
      "ADMIN",
      "TRAVEL_AGENT",
    ].includes(r),
  );

  // Query catalog tours
  const { data: toursResult, isLoading: isCatalogLoading } = useQuery({
    queryKey: ["tours", category, duration],
    queryFn: async () => {
      const res = await apiClient.get("/tours", {
        params: { category, duration },
      });
      return res.data.data;
    },
    enabled: activeTab === "catalog",
  });

  // Query upcoming tours/bookings
  const {
    data: upcomingResult,
    isLoading: isUpcomingLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["upcoming-tours", priorityFilter, appliedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("upcoming", "true");
      params.append("priority", priorityFilter);
      params.append("search", appliedSearch);
      params.append("limit", String(limit));
      params.append("offset", String((page - 1) * limit));
      const res = await apiClient.get(`/bookings?${params.toString()}`);
      return res.data.data;
    },
    enabled: activeTab === "upcoming",
  });

  // Create tour mutation
  const createTourMutation = useMutation({
    mutationFn: async (newTour: any) => {
      const res = await apiClient.post("/tours", newTour);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tour package created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      setIsModalOpen(false);
      // Reset form
      setTourName("");
      setTourDesc("");
      setTourPrice("");
      setDurationDays("");
      setTourCategory("Leisure");
      setDestName("");
      setDestCountry("");
      setDestDesc("");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to create tour package",
      );
    },
  });

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault();
    createTourMutation.mutate({
      name: tourName,
      description: tourDesc,
      price: Number(tourPrice),
      durationDays: Number(durationDays),
      category: tourCategory,
      destinationName: destName,
      destinationCountry: destCountry,
      destinationDescription: destDesc,
    });
  };

  const handleSelectTour = (tour: any) => {
    setTour(tour);
    toast.success(
      `Selected tour ${tour.name}. Proceed to Bookings to checkout.`,
    );
  };

  const tours = toursResult?.items || [];
  const upcomingBookings = upcomingResult?.items || [];
  const totalUpcoming = upcomingResult?.total || 0;
  const totalPages = Math.ceil(totalUpcoming / limit);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-foreground flex items-center gap-2.5">
          <Compass size={28} className="text-primary" />
          Upcoming Tours & Packages
        </h2>
        {activeTab === "upcoming" && (
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["upcoming-tours"] });
              toast.success("Upcoming bookings refreshed!");
            }}
            className="p-2.5 bg-card hover:bg-secondary/40 text-foreground border border-border rounded-xl transition-all shadow-sm flex items-center justify-center"
            title="Refresh List"
          >
            <RotateCw
              size={16}
              className={isRefetching ? "animate-spin" : ""}
            />
          </button>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "upcoming"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Upcoming Tours (Operational Priority)
        </button>
        {/* <button
          onClick={() => setActiveTab('catalog')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'catalog
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Tour Packages Catalog
        </button> */}
      </div>

      {/* Content Rendering */}
      {activeTab === "upcoming" ? (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="p-6 bg-card border border-border rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {["ALL", "HIGH", "MEDIUM", "NORMAL"].map((p) => {
                const label =
                  p === "ALL"
                    ? "All Priorities"
                    : p === "HIGH"
                      ? "High Priority"
                      : p === "MEDIUM"
                        ? "Upcoming Soon"
                        : "Normal";
                const colorClass =
                  p === "HIGH"
                    ? "border-red-500/30 hover:bg-red-500/10"
                    : p === "MEDIUM"
                      ? "border-yellow-500/30 hover:bg-yellow-500/10"
                      : p === "NORMAL"
                        ? "border-green-500/30 hover:bg-green-500/10"
                        : "border-border";
                const activeClass =
                  p === "HIGH"
                    ? "bg-red-500 text-white border-red-500"
                    : p === "MEDIUM"
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : p === "NORMAL"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-primary text-primary-foreground border-primary";
                const isActive = priorityFilter === p;

                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPriorityFilter(p as any);
                      setPage(1);
                    }}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? activeClass
                        : `bg-card text-muted-foreground ${colorClass}`
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppliedSearch(searchVal);
                setPage(1);
              }}
              className="flex items-center gap-2 flex-1 max-w-md"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-2.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Ref, Passenger, PNR, Flight..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-secondary/35 border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md"
              >
                Search
              </button>
              {(searchVal || appliedSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal("");
                    setAppliedSearch("");
                    setPage(1);
                  }}
                  className="p-2 border border-border rounded-xl text-muted-foreground hover:bg-secondary/40"
                  title="Clear Search"
                >
                  <X size={15} />
                </button>
              )}
            </form>
          </div>

          {/* Bookings Priority Table */}
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold">
              Priority Flight, Hotel & Transport Services
            </h3>

            {isUpcomingLoading ? (
              <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-primary" size={28} />
                <span className="text-sm font-medium">
                  Scanning service schedules...
                </span>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="p-10 text-center bg-secondary/5 border border-dashed border-border rounded-2xl text-muted-foreground">
                No upcoming bookings match your current filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border table-auto text-left">
                  <thead>
                    <tr className="bg-secondary/20 text-[11px] uppercase tracking-wider text-muted-foreground font-black border-b border-border">
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Ref</th>
                      <th className="px-4 py-3">Next Service</th>
                      <th className="px-4 py-3">Days Left</th>
                      <th className="px-4 py-3">Passenger</th>
                      <th className="px-4 py-3">Agent</th>
                      <th className="px-4 py-3 text-right">Total Price</th>
                      {/* <th className="px-4 py-3 text-right pr-6">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs text-foreground bg-card">
                    {upcomingBookings.map((booking: any) => {
                      const firstPassenger = booking.passengers?.[0];
                      const passengerName = firstPassenger
                        ? `${firstPassenger.firstName} ${firstPassenger.lastName}`
                        : booking.user
                          ? `${booking.user.firstName} ${booking.user.lastName} (Account)`
                          : "—";

                      let rowStyle: React.CSSProperties = {};
                      if (booking.priority === "HIGH") {
                        rowStyle = {
                          background: "#ffe5e5",
                          borderLeft: "5px solid #d32f2f",
                          color: "#000",
                        };
                      } else if (booking.priority === "MEDIUM") {
                        rowStyle = {
                          background: "#fff8d6",
                          borderLeft: "5px solid #f9a825",
                          color: "#000",
                        };
                      }

                      const badgeColorClass =
                        booking.priority === "HIGH"
                          ? "bg-red-200 text-red-800"
                          : booking.priority === "MEDIUM"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-100 text-green-800";

                      const badgeText =
                        booking.priority === "HIGH"
                          ? "High Priority"
                          : booking.priority === "MEDIUM"
                            ? "Upcoming Soon"
                            : "Normal";

                      return (
                        <tr
                          key={booking.id}
                          style={rowStyle}
                          className="border-b border-border/50 transition-colors"
                        >
                          <td className="px-4 py-3.5 font-bold">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColorClass}`}
                            >
                              {badgeText}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-bold tracking-wider">
                            {booking.bookingReference}
                          </td>
                          <td className="px-4 py-3.5 font-semibold">
                            {booking.nextServiceType || "—"}
                          </td>
                          <td className="px-4 py-3.5 font-bold">
                            {booking.daysLeft !== null
                              ? `${booking.daysLeft} Days Left`
                              : "—"}
                          </td>
                          <td className="px-4 py-3.5 font-medium">
                            {passengerName}
                          </td>
                          <td className="px-4 py-3.5 font-semibold">
                            {booking.agent?.name || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-right font-black">
                            {formatCurrency(booking.totalPrice)}
                          </td>
                          {/* <td className="px-4 py-3 text-right pr-6">
                            <button
                              onClick={() => setSelectedBookingId(booking.id)}
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing page {page} of {totalPages} ({totalUpcoming} total
                  bookings)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-secondary/40 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-secondary/40 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Catalog packages grid and actions */
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex items-center gap-2 text-primary">
                <Compass size={20} />
                <span className="text-sm font-semibold">Categories:</span>
              </div>
              {["", "Adventure", "Leisure", "Cultural"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? "bg-primary border-primary text-primary-foreground shadow-md"
                      : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat || "All Categories"}
                </button>
              ))}
            </div>

            {isAdminOrAgent && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md shrink-0"
              >
                <Plus size={16} />
                Add Tour Package
              </button>
            )}
          </div>

          {/* Tours Grid */}
          {isCatalogLoading ? (
            <div className="text-center py-10 text-muted-foreground">
              Searching tour packages...
            </div>
          ) : tours.length === 0 ? (
            <div className="p-8 text-center bg-card border border-dashed border-border rounded-2xl text-muted-foreground">
              No tour packages matching selection.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour: any) => (
                <div
                  key={tour.id}
                  className="bg-card border border-border rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="h-48 bg-gradient-to-tr from-primary/10 via-secondary to-accent/5 flex items-center justify-center border-b border-border relative">
                    <Compass
                      size={48}
                      className="text-muted-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-300"
                    />
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                      {tour.category}
                    </span>
                    <span className="absolute bottom-4 left-4 text-xs font-semibold bg-secondary/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border flex items-center gap-1.5">
                      <Calendar size={12} />
                      {tour.durationDays} Days
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                        {tour.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {tour.description}
                      </p>
                      <p className="text-[10px] font-semibold text-muted-foreground tracking-wide flex items-center gap-1">
                        <Tag size={12} />
                        Destination: {tour.destination?.name},{" "}
                        {tour.destination?.country}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Package Price
                        </p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(tour.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSelectTour(tour)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow-md"
                      >
                        Select Tour
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detailed Booking Slideover */}
      {selectedBookingId && (
        <BookingManager
          bookingId={selectedBookingId}
          onClose={() => {
            setSelectedBookingId(null);
            queryClient.invalidateQueries({ queryKey: ["upcoming-tours"] });
          }}
        />
      )}

      {/* Admin Add Tour Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-card border border-border p-8 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary text-muted-foreground"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Compass size={22} className="text-primary" />
              Configure Tour Package
            </h3>

            <form onSubmit={handleCreateTour} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Tour Name
                </label>
                <input
                  type="text"
                  required
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  placeholder="Parisian Delights Getaway"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={tourDesc}
                  onChange={(e) => setTourDesc(e.target.value)}
                  placeholder="Write package itineraries..."
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={tourPrice}
                    onChange={(e) => setTourPrice(e.target.value)}
                    placeholder="599"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="4"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={tourCategory}
                    onChange={(e) => setTourCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                  >
                    <option value="Leisure">Leisure</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              {/* Destination info */}
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-6">
                <div className="col-span-2">
                  <h4 className="text-xs font-bold text-primary uppercase">
                    Destination Details
                  </h4>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    placeholder="Paris"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    placeholder="France"
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Destination Description
                  </label>
                  <textarea
                    required
                    value={destDesc}
                    onChange={(e) => setDestDesc(e.target.value)}
                    placeholder="About the destination..."
                    rows={2}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/95 transition-all"
                >
                  Publish Tour Package
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-secondary text-foreground font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
