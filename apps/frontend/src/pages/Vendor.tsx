import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  Store,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Wallet,
  Phone,
  User,
  Tags,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// Validation Schema for Vendor
const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  website: z
    .string()
    .min(1, "Website is required")
    .url("Please enter a valid URL (e.g., https://example.com)"),
  supportEmail: z
    .string()
    .min(1, "Support email is required")
    .email("Please enter a valid email address"),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 digits"),
  vendorType: z.string().min(1, "Vendor type is required"),
});

interface Vendor {
  id: string;
  name: string;
  website: string;
  supportEmail: string;
  phoneNumber: string;
  vendorType: string;
  walletBalance: number;
  createdAt: string;
}

// Reusable styled input class
const fieldCls =
  "w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground placeholder:text-muted-foreground/40 transition-all focus:bg-background";

// Reusable label with optional icon and badge
function FieldLabel({
  icon: Icon,
  label,
  badge,
}: {
  icon?: React.ElementType;
  label: string;
  badge?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">
      {Icon && <Icon size={9} className="shrink-0 text-muted-foreground/50" />}
      {label}
      {badge}
    </label>
  );
}

export default function VendorPage() {
  const queryClient = useQueryClient();

  // Search & Modals
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Form Field States
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vendorTypeSelect, setVendorTypeSelect] = useState<
    "Flight" | "Accommodation" | "Other"
  >("Flight");
  const [customVendorType, setCustomVendorType] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----------------------------------------------------
  // Queries
  // ----------------------------------------------------
  const { data: vendorsData, isLoading: isVendorsLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data.items as Vendor[];
    },
  });

  // ----------------------------------------------------
  // Mutations
  // ----------------------------------------------------
  const createVendorMutation = useMutation({
    mutationFn: async (newVendor: any) => {
      return apiClient.post("/vendors", newVendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor registered successfully!");
      closeFormModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to register vendor.");
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: async (updatedVendor: any) => {
      return apiClient.patch(`/vendors/${selectedVendor?.id}`, updatedVendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor updated successfully!");
      closeFormModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update vendor.");
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/vendors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor permanently deleted.");
      setIsDeleteModalOpen(false);
      setSelectedVendor(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete vendor.");
    },
  });

  // ----------------------------------------------------
  // Form Controls
  // ----------------------------------------------------
  const handleAddClick = () => {
    setSelectedVendor(null);
    setName("");
    setWebsite("");
    setSupportEmail("");
    setPhoneNumber("");
    setVendorTypeSelect("Flight");
    setCustomVendorType("");
    setWalletBalance(0);
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setName(vendor.name);
    setWebsite(vendor.website || "");
    setSupportEmail(vendor.supportEmail || "");
    setPhoneNumber(vendor.phoneNumber);
    if (
      vendor.vendorType === "Flight" ||
      vendor.vendorType === "Accommodation"
    ) {
      setVendorTypeSelect(vendor.vendorType);
      setCustomVendorType("");
    } else {
      setVendorTypeSelect("Other");
      setCustomVendorType(vendor.vendorType);
    }
    setWalletBalance(vendor.walletBalance || 0);
    setErrors({});
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedVendor(null);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteModalOpen(true);
  };

  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const finalVendorType =
      vendorTypeSelect === "Other" ? customVendorType.trim() : vendorTypeSelect;

    if (vendorTypeSelect === "Other" && !finalVendorType) {
      setErrors({ vendorType: "Custom vendor type is required" });
      return;
    }

    const basicData = {
      name,
      website,
      supportEmail,
      phoneNumber,
      vendorType: finalVendorType,
    };

    const validationResult = vendorSchema.safeParse(basicData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (selectedVendor) {
      updateVendorMutation.mutate(basicData);
    } else {
      createVendorMutation.mutate(basicData);
    }
  };

  const confirmDeleteVendor = () => {
    if (selectedVendor) {
      deleteVendorMutation.mutate(selectedVendor.id);
    }
  };

  // Filter list based on search
  const filteredVendors = vendorsData?.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Vendor Directory
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Manage your suppliers, accommodation partners, and flight providers.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/5 self-center shrink-0"
        >
          <Plus size={14} />
          Register Vendor
        </button>
      </div>

      <div className="space-y-4">
        {/* Control bar */}
        <div className="flex items-center gap-3 bg-card border border-border/80 p-3 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search vendors by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-secondary/20 border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground/50 transition-all focus:bg-background"
            />
          </div>
        </div>

        {/* Table section */}
        <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider bg-secondary/10">
                  <th className="py-2.5 px-5">Name</th>
                  <th className="py-2.5 px-5">Phone Number</th>
                  <th className="py-2.5 px-5">Vendor Type</th>
                  <th className="py-2.5 px-5">Wallet Balance</th>
                  <th className="py-2.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {isVendorsLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                        <span>Loading vendor data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVendors && filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-secondary/15 transition-colors"
                    >
                      <td className="py-2.5 px-5 font-semibold text-foreground">
                        {vendor.name}
                      </td>
                      <td className="py-2.5 px-5">
                        <p className="font-medium text-foreground/90">
                          {vendor.phoneNumber}
                        </p>
                      </td>
                      <td className="py-2.5 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            vendor.vendorType === "Flight"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          }`}
                        >
                          {vendor.vendorType}
                        </span>
                      </td>
                      <td className="py-2.5 px-5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <Wallet size={12} className="text-muted-foreground" />
                          {formatCurrency(vendor.walletBalance || 0)}
                        </div>
                      </td>
                      <td className="py-2.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(vendor)}
                            className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                            title="Update Vendor"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(vendor)}
                            className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Permanently Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Store size={20} className="text-muted-foreground/45" />
                        <p className="text-xs">
                          No registered vendors matched your search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PREMIUM VENDOR FORM MODAL
      ══════════════════════════════════════════ */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={
          selectedVendor
            ? `Update Profile — ${selectedVendor.name}`
            : "Register New Vendor"
        }
        maxWidth="2xl"
      >
        <form onSubmit={handleVendorSubmit}>
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/15">
                <Store size={13} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground leading-tight">
                  Vendor Details
                </p>
                <p className="text-[9px] text-muted-foreground/70">
                  Business and contact information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={User} label="Vendor Name" />
                <input
                  type="text"
                  placeholder="e.g. Emirates Airlines"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldCls}
                />
                {errors.name && (
                  <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel icon={Phone} label="Phone Number" />
                <input
                  type="text"
                  placeholder="+44 7911 123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={fieldCls}
                />
                {errors.phoneNumber && (
                  <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={Store} label="Website" />
                <input
                  type="url"
                  placeholder="https://emirates.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className={fieldCls}
                />
                {errors.website && (
                  <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                    {errors.website}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel icon={User} label="Support Email" />
                <input
                  type="email"
                  placeholder="support@emirates.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className={fieldCls}
                />
                {errors.supportEmail && (
                  <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                    {errors.supportEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={Tags} label="Vendor Type" />
                <select
                  value={vendorTypeSelect}
                  onChange={(e) => setVendorTypeSelect(e.target.value as any)}
                  className={fieldCls}
                >
                  <option value="Flight">Flight</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="VISA">VISA</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other (Custom)</option>
                </select>
                {errors.vendorType && (
                  <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                    {errors.vendorType}
                  </p>
                )}
              </div>
              {vendorTypeSelect === "Other" ? (
                <div>
                  <FieldLabel icon={Tags} label="Custom Vendor Type" />
                  <input
                    type="text"
                    placeholder="e.g. Car Rental, Tour Guide"
                    value={customVendorType}
                    onChange={(e) => setCustomVendorType(e.target.value)}
                    className={fieldCls}
                  />
                </div>
              ) : (
                <div /> /* Empty div for grid alignment if needed */
              )}
            </div>

            {/* ── Wallet Balance Card ── */}
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent p-4 flex items-center justify-between gap-4 mt-4">
              {/* Decorative glow */}
              <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
              <div className="absolute -left-6 bottom-0 w-20 h-20 rounded-full bg-emerald-500/8 blur-xl pointer-events-none" />
              <div className="space-y-1 z-10">
                <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.12em]">
                  <Wallet size={9} />
                  Vendor Wallet
                </span>
                <span className="block text-[28px] font-black tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
                  {formatCurrency(walletBalance)}
                </span>
                <span className="block text-[8px] text-muted-foreground/60 italic leading-snug mt-1">
                  Non-editable. Stores extra money sent to vendors.
                </span>
              </div>
              <div className="z-10 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-inner shrink-0">
                <Wallet size={24} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground">
              <span className="text-destructive">*</span> Required fields
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={closeFormModal}
                className="px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                disabled={
                  createVendorMutation.isPending ||
                  updateVendorMutation.isPending
                }
              >
                {createVendorMutation.isPending ||
                updateVendorMutation.isPending
                  ? "Saving..."
                  : selectedVendor
                    ? "Update Vendor"
                    : "Register Vendor"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteVendor}
        title="Delete Vendor"
        message={`Are you sure you want to delete ${selectedVendor?.name}? This action cannot be undone.`}
        loading={deleteVendorMutation.isPending}
      />
    </div>
  );
}
