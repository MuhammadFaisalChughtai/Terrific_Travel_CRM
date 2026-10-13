import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { toast } from "sonner";
import {
  Car,
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Layers,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";

export default function CatalogPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const canEdit = user?.roles?.some((r: any) => {
    const raw = typeof r === "string" ? r : r?.name || "";
    const clean = raw.toUpperCase().replace(/[\s_-]+/g, "");
    return [
      "ADMIN",
      "SUPERADMIN",
      "ADMINISTRATOR",
      "ROOT",
      "MANAGER",
      "BRANCHMANAGER",
    ].includes(clean);
  });

  const [activeTab, setActiveTab] = useState<"transport" | "visa">("transport");
  const [transportSearch, setTransportSearch] = useState("");
  const [visaSearch, setVisaSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("1448H-(2026-2027)");

  // Modals state
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<{
    routeId: string;
    routeName: string;
    vehicleId: string;
    vehicleName: string;
    price: number | string;
    currency: string;
  } | null>(null);

  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [routeFormData, setRouteFormData] = useState({
    name: "",
    defaultDeparture: "",
    defaultArrival: "",
    displayOrder: 0,
  });

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [vehicleFormData, setVehicleFormData] = useState({
    name: "",
    capacity: 4,
    displayOrder: 0,
  });

  const [visaModalOpen, setVisaModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<any | null>(null);
  const [visaFormData, setVisaFormData] = useState({
    country: "Saudi Arabia",
    visaType: "",
    price: 0,
    currency: "SAR",
    insuranceIncluded: true,
    insuranceCost: 0,
    insuranceDetails: "Comprehensive Medical & Umrah Insurance Included",
    validity: "1 Year Multiple Entry",
    stayDuration: "90 Days per visit",
    processingTime: "24-48 Hours",
    documentsRequired: "Passport Copy, Passport Photo",
    description: "",
    isActive: true,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "route" | "vehicle" | "visa";
    id: string;
    name: string;
  } | null>(null);

  // Queries
  const {
    data: transportMatrixData,
    isLoading: isTransportLoading,
  } = useQuery({
    queryKey: ["catalog-transport-matrix", selectedSeason],
    queryFn: async () => {
      const res = await apiClient.get(
        `/catalog/transport-matrix?season=${encodeURIComponent(selectedSeason)}`
      );
      return res.data.data;
    },
  });

  const {
    data: visaCatalogData,
    isLoading: isVisaLoading,
  } = useQuery({
    queryKey: ["catalog-visas"],
    queryFn: async () => {
      const res = await apiClient.get("/catalog/visas?includeInactive=true");
      return res.data.data;
    },
  });

  // Mutations
  const updateRateMutation = useMutation({
    mutationFn: async (payload: {
      routeId: string;
      vehicleId: string;
      price: number;
      currency?: string;
      season?: string;
    }) => {
      const res = await apiClient.post("/catalog/transport-rates", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rate updated successfully");
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-options"] });
      setRateModalOpen(false);
      setEditingRate(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update rate");
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post("/catalog/transport-routes", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Route added successfully");
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-options"] });
      setRouteModalOpen(false);
      setRouteFormData({
        name: "",
        defaultDeparture: "",
        defaultArrival: "",
        displayOrder: 0,
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create route");
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post("/catalog/transport-vehicles", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Vehicle added successfully");
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-options"] });
      setVehicleModalOpen(false);
      setVehicleFormData({ name: "", capacity: 4, displayOrder: 0 });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create vehicle");
    },
  });

  const saveVisaMutation = useMutation({
    mutationFn: async (payload: any) => {
      const docs =
        typeof payload.documentsRequired === "string"
          ? payload.documentsRequired
              .split(/[\n,]+/)
              .map((s: string) => s.trim())
              .filter(Boolean)
          : payload.documentsRequired;

      const body = {
        ...payload,
        price: Number(payload.price) || 0,
        insuranceCost: Number(payload.insuranceCost) || 0,
        documentsRequired: docs,
      };

      if (editingVisa?.id) {
        const res = await apiClient.patch(`/catalog/visas/${editingVisa.id}`, body);
        return res.data;
      } else {
        const res = await apiClient.post("/catalog/visas", body);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(
        editingVisa ? "Visa package updated" : "Visa package added"
      );
      queryClient.invalidateQueries({ queryKey: ["catalog-visas"] });
      setVisaModalOpen(false);
      setEditingVisa(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save visa");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      type,
      id,
    }: {
      type: "route" | "vehicle" | "visa";
      id: string;
    }) => {
      if (type === "route") {
        return apiClient.delete(`/catalog/transport-routes/${id}`);
      }
      if (type === "vehicle") {
        return apiClient.delete(`/catalog/transport-vehicles/${id}`);
      }
      return apiClient.delete(`/catalog/visas/${id}`);
    },
    onSuccess: () => {
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-options"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-visas"] });
      setDeleteModalOpen(false);
      setItemToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete item");
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/catalog/reset");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Catalog reset to standard rates matrix successfully");
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-matrix"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-transport-options"] });
      queryClient.invalidateQueries({ queryKey: ["catalog-visas"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset catalog");
    },
  });

  // Filter transport routes
  const filteredRoutes = (transportMatrixData?.routes || []).filter((r: any) =>
    r.name.toLowerCase().includes(transportSearch.toLowerCase())
  );

  // Filter visas
  const filteredVisas = (visaCatalogData || []).filter((v: any) => {
    const q = visaSearch.toLowerCase();
    return (
      v.visaType?.toLowerCase().includes(q) ||
      v.country?.toLowerCase().includes(q) ||
      v.description?.toLowerCase().includes(q)
    );
  });

  const handleOpenEditVisa = (visa?: any) => {
    if (visa) {
      setEditingVisa(visa);
      setVisaFormData({
        country: visa.country || "Saudi Arabia",
        visaType: visa.visaType || "",
        price: visa.price || 0,
        currency: visa.currency || "SAR",
        insuranceIncluded: visa.insuranceIncluded ?? true,
        insuranceCost: visa.insuranceCost || 0,
        insuranceDetails: visa.insuranceDetails || "",
        validity: visa.validity || "",
        stayDuration: visa.stayDuration || "",
        processingTime: visa.processingTime || "",
        documentsRequired: Array.isArray(visa.documentsRequired)
          ? visa.documentsRequired.join(", ")
          : visa.documentsRequired || "",
        description: visa.description || "",
        isActive: visa.isActive ?? true,
      });
    } else {
      setEditingVisa(null);
      setVisaFormData({
        country: "Saudi Arabia",
        visaType: "",
        price: 0,
        currency: "SAR",
        insuranceIncluded: true,
        insuranceCost: 0,
        insuranceDetails: "Comprehensive Medical & Umrah Insurance Included",
        validity: "1 Year Multiple Entry",
        stayDuration: "90 Days per visit",
        processingTime: "24-48 Hours",
        documentsRequired: "Passport Copy, Passport Photo",
        description: "",
        isActive: true,
      });
    }
    setVisaModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Service Catalog & Rate Cards
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Standard pricing matrix for Umrah transportation sectors and visa packages. Auto-fills into bookings.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to restore default official transport sheet rates and visas?"
                  )
                ) {
                  resetMutation.mutate();
                }
              }}
              disabled={resetMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors shadow-xs"
              title="Reload defaults from the 1448H official rate matrix"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetMutation.isPending ? "animate-spin" : ""}`} />
              Reset To Standard Sheet
            </button>
          )}

          {activeTab === "transport" && canEdit && (
            <>
              <button
                onClick={() => setRouteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Route
              </button>
              <button
                onClick={() => setVehicleModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Vehicle
              </button>
            </>
          )}

          {activeTab === "visa" && canEdit && (
            <button
              onClick={() => handleOpenEditVisa()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Visa Package
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("transport")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "transport"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Car className="w-4 h-4" />
          Transportation Rates Matrix (1448H / 2026-2027)
          {transportMatrixData?.routes?.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-primary/10 text-primary rounded-full text-[10px]">
              {transportMatrixData.routes.length} Sectors
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("visa")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "visa"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Visa Catalog
          {visaCatalogData?.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-primary/10 text-primary rounded-full text-[10px]">
              {visaCatalogData.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: TRANSPORTATION RATES MATRIX */}
      {activeTab === "transport" && (
        <div className="space-y-4">
          {/* Matrix Top Banner & Search */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-background to-background p-4 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  OFFICIAL SHEET
                </span>
                <h2 className="text-sm md:text-base font-bold text-foreground tracking-wide">
                  SPECIAL TRANSPORT RATES FOR THE YEAR 1448H-(2026-2027)
                </h2>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                All rates are in <strong className="text-foreground">SAR (Saudi Riyals)</strong>. Click any cell to update prices.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter sectors / routes..."
                  value={transportSearch}
                  onChange={(e) => setTransportSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Matrix 2D Grid Table */}
          {isTransportLoading ? (
            <div className="h-64 flex items-center justify-center border border-border rounded-xl">
              <span className="text-xs text-muted-foreground animate-pulse">
                Loading transportation rates matrix...
              </span>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/80 text-muted-foreground border-b border-border divide-x divide-border">
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider w-12 text-center text-[10px]">
                        Sr.
                      </th>
                      <th className="py-2.5 px-3 font-bold uppercase tracking-wider min-w-[220px] text-[10px]">
                        SECTORS (ROUTES)
                      </th>
                      {(transportMatrixData?.vehicles || []).map((v: any) => (
                        <th
                          key={v.id}
                          className="py-2.5 px-3 font-bold uppercase tracking-wider min-w-[130px] text-center text-[10px] bg-muted/40"
                        >
                          <div className="truncate font-black text-foreground">
                            {v.name}
                          </div>
                          <div className="text-[9px] text-muted-foreground font-normal">
                            Cap: {v.capacity} pax
                          </div>
                        </th>
                      ))}
                      {canEdit && (
                        <th className="py-2.5 px-2 font-bold uppercase tracking-wider w-16 text-center text-[10px]">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRoutes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={
                            (transportMatrixData?.vehicles?.length || 0) + 3
                          }
                          className="py-8 text-center text-muted-foreground text-xs italic"
                        >
                          No transport sectors matching "{transportSearch}"
                        </td>
                      </tr>
                    ) : (
                      filteredRoutes.map((route: any, rIdx: number) => (
                        <tr
                          key={route.id}
                          className="hover:bg-muted/30 transition-colors divide-x divide-border group"
                        >
                          <td className="py-2.5 px-3 text-center font-bold text-muted-foreground text-[11px] bg-muted/10">
                            {rIdx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            <div className="flex items-center justify-between">
                              <span>{route.name}</span>
                              {route.defaultDeparture && route.defaultArrival && (
                                <span className="text-[9.5px] text-muted-foreground font-normal hidden lg:inline">
                                  ({route.defaultDeparture} ➔ {route.defaultArrival})
                                </span>
                              )}
                            </div>
                          </td>

                          {(transportMatrixData?.vehicles || []).map((v: any) => {
                            const rateObj = transportMatrixData?.matrix?.[
                              route.id
                            ]?.[v.id];
                            const price = rateObj?.price;
                            const hasPrice = price !== undefined && price !== null;

                            return (
                              <td
                                key={v.id}
                                onClick={() => {
                                  if (canEdit) {
                                    setEditingRate({
                                      routeId: route.id,
                                      routeName: route.name,
                                      vehicleId: v.id,
                                      vehicleName: v.name,
                                      price: hasPrice ? price : 0,
                                      currency: rateObj?.currency || "SAR",
                                    });
                                    setRateModalOpen(true);
                                  }
                                }}
                                className={`py-2 px-3 text-center transition-all ${
                                  canEdit
                                    ? "cursor-pointer hover:bg-primary/10 hover:font-bold"
                                    : ""
                                }`}
                                title={
                                  canEdit
                                    ? `Click to edit rate for ${route.name} (${v.name})`
                                    : undefined
                                }
                              >
                                {hasPrice ? (
                                  <div className="font-mono font-bold text-[12px] text-emerald-700 dark:text-emerald-400">
                                    {price}{" "}
                                    <span className="text-[9px] font-normal text-muted-foreground">
                                      SAR
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground/60 italic">
                                    -
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {canEdit && (
                            <td className="py-2 px-2 text-center">
                              <button
                                onClick={() => {
                                  setItemToDelete({
                                    type: "route",
                                    id: route.id,
                                    name: route.name,
                                  });
                                  setDeleteModalOpen(true);
                                }}
                                className="p-1 text-muted-foreground hover:text-rose-600 rounded transition-colors"
                                title="Delete Sector"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VISA CATALOG */}
      {activeTab === "visa" && (
        <div className="space-y-4">
          {/* Visa Search & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search visas by country, type, or notes..."
                  value={visaSearch}
                  onChange={(e) => setVisaSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredVisas.length}</strong> visa package{filteredVisas.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Visa Cards Grid */}
          {isVisaLoading ? (
            <div className="h-64 flex items-center justify-center border border-border rounded-xl">
              <span className="text-xs text-muted-foreground animate-pulse">
                Loading visa catalog...
              </span>
            </div>
          ) : filteredVisas.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl bg-card">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                No visa packages found
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add your first standard visa pricing package to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVisas.map((visa: any) => {
                const docs: string[] = Array.isArray(visa.documentsRequired)
                  ? visa.documentsRequired
                  : [];

                return (
                  <div
                    key={visa.id}
                    className="bg-card border border-border hover:border-primary/40 rounded-xl p-4 flex flex-col justify-between shadow-xs transition-all relative overflow-hidden group"
                  >
                    {/* Top strip */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                            {visa.country}
                          </span>
                          <h3 className="text-sm font-bold text-foreground mt-1.5 leading-snug">
                            {visa.visaType}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            {visa.currency} {visa.price}
                          </div>
                          {visa.insuranceIncluded && (
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <ShieldCheck className="w-3 h-3" />
                              Insurance Incl.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details pills */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                        {visa.validity && (
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-medium">
                              Validity:
                            </span>
                            <span className="font-semibold text-foreground">
                              {visa.validity}
                            </span>
                          </div>
                        )}
                        {visa.stayDuration && (
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-medium">
                              Stay Duration:
                            </span>
                            <span className="font-semibold text-foreground">
                              {visa.stayDuration}
                            </span>
                          </div>
                        )}
                        {visa.processingTime && (
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-medium">
                              Processing:
                            </span>
                            <span className="font-semibold text-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {visa.processingTime}
                            </span>
                          </div>
                        )}
                        {visa.insuranceDetails && (
                          <div>
                            <span className="text-[10px] text-muted-foreground block font-medium">
                              Insurance Details:
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate block" title={visa.insuranceDetails}>
                              {visa.insuranceDetails}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Documents Required */}
                      {docs.length > 0 && (
                        <div className="pt-2 border-t border-border/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                            Required Documents:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {docs.map((doc, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-medium"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom actions */}
                    {canEdit && (
                      <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-border/60">
                        <button
                          onClick={() => handleOpenEditVisa(visa)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete({
                              type: "visa",
                              id: visa.id,
                              name: `${visa.visaType} (${visa.country})`,
                            });
                            setDeleteModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline ml-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Edit Rate */}
      {rateModalOpen && editingRate && (
        <Modal
          isOpen={rateModalOpen}
          onClose={() => {
            setRateModalOpen(false);
            setEditingRate(null);
          }}
          title={`Edit Rate: ${editingRate.routeName}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateRateMutation.mutate({
                routeId: editingRate.routeId,
                vehicleId: editingRate.vehicleId,
                price: Number(editingRate.price) || 0,
                currency: editingRate.currency,
                season: selectedSeason,
              });
            }}
            className="space-y-4"
          >
            <div className="bg-muted/40 p-3 rounded-lg border border-border text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">Vehicle: </span>
                <strong className="text-foreground">{editingRate.vehicleName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Sector: </span>
                <strong className="text-foreground">{editingRate.routeName}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Season: </span>
                <strong className="text-foreground">{selectedSeason}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Price (SAR) *
              </label>
              <input
                required
                type="number"
                step="any"
                value={editingRate.price}
                onChange={(e) =>
                  setEditingRate({ ...editingRate, price: e.target.value })
                }
                className="w-full text-sm py-2 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRateModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateRateMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {updateRateMutation.isPending ? "Saving..." : "Save Rate"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Add Route */}
      {routeModalOpen && (
        <Modal
          isOpen={routeModalOpen}
          onClose={() => setRouteModalOpen(false)}
          title="Add New Transport Sector / Route"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createRouteMutation.mutate(routeFormData);
            }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Route / Sector Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. JED AIRPORT - MAKKAH HOTEL"
                value={routeFormData.name}
                onChange={(e) =>
                  setRouteFormData({ ...routeFormData, name: e.target.value })
                }
                className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Default Departure
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jeddah Airport"
                  value={routeFormData.defaultDeparture}
                  onChange={(e) =>
                    setRouteFormData({
                      ...routeFormData,
                      defaultDeparture: e.target.value,
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Default Arrival
                </label>
                <input
                  type="text"
                  placeholder="e.g. Makkah Hotel"
                  value={routeFormData.defaultArrival}
                  onChange={(e) =>
                    setRouteFormData({
                      ...routeFormData,
                      defaultArrival: e.target.value,
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRouteModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createRouteMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createRouteMutation.isPending ? "Adding..." : "Add Route"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Add Vehicle */}
      {vehicleModalOpen && (
        <Modal
          isOpen={vehicleModalOpen}
          onClose={() => setVehicleModalOpen(false)}
          title="Add New Vehicle Type"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createVehicleMutation.mutate({
                ...vehicleFormData,
                capacity: Number(vehicleFormData.capacity) || 4,
              });
            }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Vehicle Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. GMC YUKON XL 2026"
                value={vehicleFormData.name}
                onChange={(e) =>
                  setVehicleFormData({ ...vehicleFormData, name: e.target.value })
                }
                className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Passenger Capacity (Persons) *
              </label>
              <input
                required
                type="number"
                min="1"
                value={vehicleFormData.capacity}
                onChange={(e) =>
                  setVehicleFormData({
                    ...vehicleFormData,
                    capacity: Number(e.target.value),
                  })
                }
                className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setVehicleModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createVehicleMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {createVehicleMutation.isPending ? "Adding..." : "Add Vehicle"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 4: Add / Edit Visa */}
      {visaModalOpen && (
        <Modal
          isOpen={visaModalOpen}
          onClose={() => {
            setVisaModalOpen(false);
            setEditingVisa(null);
          }}
          title={editingVisa ? "Edit Visa Package" : "Add New Visa Package"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveVisaMutation.mutate(visaFormData);
            }}
            className="space-y-4 max-h-[80vh] overflow-y-auto px-1"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Country *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Saudi Arabia"
                  value={visaFormData.country}
                  onChange={(e) =>
                    setVisaFormData({ ...visaFormData, country: e.target.value })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Visa Type / Product *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Saudi Tourist / Umrah Multiple"
                  value={visaFormData.visaType}
                  onChange={(e) =>
                    setVisaFormData({ ...visaFormData, visaType: e.target.value })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Base Price *
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  value={visaFormData.price}
                  onChange={(e) =>
                    setVisaFormData({
                      ...visaFormData,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Currency *
                </label>
                <select
                  value={visaFormData.currency}
                  onChange={(e) =>
                    setVisaFormData({ ...visaFormData, currency: e.target.value })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="SAR">SAR</option>
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {/* Insurance Info */}
            <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="insuranceIncluded"
                  checked={visaFormData.insuranceIncluded}
                  onChange={(e) =>
                    setVisaFormData({
                      ...visaFormData,
                      insuranceIncluded: e.target.checked,
                    })
                  }
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="insuranceIncluded"
                  className="text-xs font-bold text-foreground cursor-pointer select-none"
                >
                  Medical / Travel Insurance Included
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Insurance Details / Coverage
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard Medical & Umrah Health Insurance"
                  value={visaFormData.insuranceDetails}
                  onChange={(e) =>
                    setVisaFormData({
                      ...visaFormData,
                      insuranceDetails: e.target.value,
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Validity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 Year"
                  value={visaFormData.validity}
                  onChange={(e) =>
                    setVisaFormData({ ...visaFormData, validity: e.target.value })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Stay Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 90 Days"
                  value={visaFormData.stayDuration}
                  onChange={(e) =>
                    setVisaFormData({
                      ...visaFormData,
                      stayDuration: e.target.value,
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Processing Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24-48 Hours"
                  value={visaFormData.processingTime}
                  onChange={(e) =>
                    setVisaFormData({
                      ...visaFormData,
                      processingTime: e.target.value,
                    })
                  }
                  className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Required Documents (Comma separated)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Passport Copy, Passport Sized Photo, Return Flight Ticket"
                value={visaFormData.documentsRequired}
                onChange={(e) =>
                  setVisaFormData({
                    ...visaFormData,
                    documentsRequired: e.target.value,
                  })
                }
                className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Notes / Additional Information
              </label>
              <textarea
                rows={2}
                placeholder="Any special conditions or restrictions..."
                value={visaFormData.description}
                onChange={(e) =>
                  setVisaFormData({
                    ...visaFormData,
                    description: e.target.value,
                  })
                }
                className="w-full text-xs py-1.5 px-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setVisaModalOpen(false);
                  setEditingVisa(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveVisaMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saveVisaMutation.isPending
                  ? "Saving..."
                  : editingVisa
                  ? "Update Visa"
                  : "Save Visa Package"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={() =>
            deleteMutation.mutate({
              type: itemToDelete.type,
              id: itemToDelete.id,
            })
          }
          title={`Delete ${itemToDelete.type.toUpperCase()}`}
          message={`Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
