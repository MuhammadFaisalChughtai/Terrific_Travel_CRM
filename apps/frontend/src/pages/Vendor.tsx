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
  ArrowLeft,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  History,
  Coins,
  Undo2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import VendorPaymentModal from "../components/VendorPaymentModal";

// Validation Schema for Vendor
const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // website: z
  //   .string()
  //   .min(1, "Website is required")
  //   .url("Please enter a valid URL (e.g., https://example.com)"),
  // supportEmail: z
  //   .string()
  //   .min(1, "Support email is required")
  //   .email("Please enter a valid email address"),
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

  // Search, Modals & Viewing State
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewingVendorId, setViewingVendorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ledger" | "wallet" | "payments">(
    "ledger",
  );

  // Form Field States
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vendorTypeSelect, setVendorTypeSelect] = useState<
    "Flight" | "Accommodation" | "VISA" | "Transportation" | "Other"
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

  const { data: viewingVendor } = useQuery({
    queryKey: ["viewing-vendor", viewingVendorId],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/${viewingVendorId}`);
      return res.data.data as Vendor;
    },
    enabled: !!viewingVendorId,
  });

  const { data: dashboardSummary, refetch: refetchSummary } = useQuery({
    queryKey: ["vendor-summary", viewingVendorId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/vendors/${viewingVendorId}/dashboard-summary`,
      );
      return res.data.data;
    },
    enabled: !!viewingVendorId,
  });

  const { data: ledgerEntries, refetch: refetchLedger } = useQuery({
    queryKey: ["vendor-ledger", viewingVendorId],
    queryFn: async () => {
      const res = await apiClient.get(`/vendors/${viewingVendorId}/ledger`);
      return res.data.data;
    },
    enabled: !!viewingVendorId,
  });

  const { data: walletHistory, refetch: refetchWallet } = useQuery({
    queryKey: ["vendor-wallet", viewingVendorId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/vendors/${viewingVendorId}/wallet-history`,
      );
      return res.data.data;
    },
    enabled: !!viewingVendorId,
  });

  const { data: paymentsHistory, refetch: refetchPayments } = useQuery({
    queryKey: ["vendor-payments-history", viewingVendorId],
    queryFn: async () => {
      const res = await apiClient.get(
        `/vendors/payments?vendorId=${viewingVendorId}`,
      );
      return res.data.data.items;
    },
    enabled: !!viewingVendorId,
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

  const reversePaymentMutation = useMutation({
    mutationFn: async ({
      paymentId,
      reason,
    }: {
      paymentId: string;
      reason: string;
    }) => {
      return apiClient.patch(`/vendors/payments/${paymentId}/reverse`, {
        reason,
      });
    },
    onSuccess: () => {
      toast.success("Vendor payment successfully reversed!");
      refetchSummary();
      refetchLedger();
      refetchWallet();
      refetchPayments();
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Failed to reverse vendor payment.",
      );
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

  const handleEditClick = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid viewing details trigger
    setSelectedVendor(vendor);
    setName(vendor.name);
    setWebsite(vendor.website || "");
    setSupportEmail(vendor.supportEmail || "");
    setPhoneNumber(vendor.phoneNumber);
    if (
      vendor.vendorType === "Flight" ||
      vendor.vendorType === "Accommodation" ||
      vendor.vendorType === "VISA" ||
      vendor.vendorType === "Transportation"
    ) {
      setVendorTypeSelect(vendor.vendorType as any);
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

  const handleDeleteClick = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleReverseClick = (paymentId: string, referenceNumber: string) => {
    const reason = window.prompt(
      `Enter reason for reversing payment ${referenceNumber}:`,
    );
    if (reason === null) return; // User cancelled
    reversePaymentMutation.mutate({
      paymentId,
      reason: reason.trim() || "Payment Reversal",
    });
  };

  // Filter list based on search
  const filteredVendors = vendorsData?.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ════════════════════════════════════════════════════════════
  // RENDER DETAILED VENDOR DASHBOARD
  // ════════════════════════════════════════════════════════════
  if (viewingVendorId && viewingVendor) {
    const kpi = dashboardSummary || {
      totalOutstanding: 0,
      totalPaid: 0,
      walletBalance: 0,
      pendingCount: 0,
      partialCount: 0,
      paidCount: 0,
      lastPaymentDate: null,
    };

    return (
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
          <div className="space-y-1">
            <button
              onClick={() => setViewingVendorId(null)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
            >
              <ArrowLeft size={13} />
              Back to Vendor Directory
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground">
                {viewingVendor.name}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-primary/10 border-primary/20 text-primary uppercase tracking-wider">
                {viewingVendor.vendorType}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Registered on:{" "}
              {new Date(viewingVendor.createdAt).toLocaleDateString()} •
              Website:{" "}
              <a
                href={viewingVendor.website}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary transition-colors flex inline-flex items-center gap-0.5"
              >
                {viewingVendor.website} <ExternalLink size={10} />
              </a>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4.5 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/10 shrink-0"
            >
              <Wallet size={14} />
              Process Vendor Payment
            </button>
          </div>
        </div>

        {/* 1. Dashboard Summaries */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Outstanding */}
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-3 top-3 text-red-500/10">
              <TrendingUp size={44} />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">
                Outstanding Balance
              </span>
              <span className="text-xl font-black text-red-600 dark:text-red-400">
                {formatCurrency(kpi.totalOutstanding)}
              </span>
            </div>
            <span className="block text-[9px] text-muted-foreground mt-2 font-medium">
              We owe: {kpi.pendingCount} pending / {kpi.partialCount} partial
            </span>
          </div>

          {/* Total Paid */}
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-3 top-3 text-emerald-500/10">
              <ShieldCheck size={44} />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">
                Total Settled Paid
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(kpi.totalPaid)}
              </span>
            </div>
            <span className="block text-[9px] text-muted-foreground mt-2 font-medium">
              Paid bookings: {kpi.paidCount}
            </span>
          </div>

          {/* Wallet Balance */}
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-3 top-3 text-amber-500/10">
              <Coins size={44} />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">
                Prepayment Wallet Credit
              </span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {formatCurrency(kpi.walletBalance)}
              </span>
            </div>
            <span className="block text-[9px] text-muted-foreground mt-2 font-medium">
              Available for future invoice deductions
            </span>
          </div>

          {/* Last Payment */}
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-3 top-3 text-blue-500/10">
              <Calendar size={44} />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mb-1">
                Last Payment Processed
              </span>
              <span className="text-xs font-black text-foreground mt-1">
                {kpi.lastPaymentDate
                  ? new Date(kpi.lastPaymentDate).toLocaleDateString()
                  : "No payments recorded"}
              </span>
            </div>
            <span className="block text-[9px] text-muted-foreground mt-2 font-medium">
              Audit trail status: compliant
            </span>
          </div>
        </div>

        {/* 2. Sub-section Tabs */}
        <div className="space-y-4">
          <div className="flex border-b border-border/80 gap-6">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === "ledger"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText size={13} />
              General Financial Ledger
            </button>
            <button
              onClick={() => setActiveTab("wallet")}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === "wallet"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <History size={13} />
              Prepayments & Wallet Audit
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === "payments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Coins size={13} />
              Processed Payments History
            </button>
          </div>

          {/* Tab 1: Ledger Entries */}
          {activeTab === "ledger" && (
            <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary/10">
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Event Type</th>
                      <th className="py-2.5 px-4">Booking Ref</th>
                      <th className="py-2.5 px-4">Reference No</th>
                      <th className="py-2.5 px-4 text-right">Debit (+)</th>
                      <th className="py-2.5 px-4 text-right">Credit (-)</th>
                      <th className="py-2.5 px-4 text-right">
                        Running Balance
                      </th>
                      <th className="py-2.5 px-4">Processed By</th>
                      <th className="py-2.5 px-4 max-w-xs">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {ledgerEntries && ledgerEntries.length > 0 ? (
                      ledgerEntries.map((e: any) => (
                        <tr
                          key={e.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="py-2.5 px-4 text-muted-foreground/80 text-[10px]">
                            {new Date(e.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                e.eventType === "INVOICE_CREATED"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : e.eventType === "VENDOR_PAYMENT"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : e.eventType === "WALLET_CREDIT"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : e.eventType === "WALLET_USAGE"
                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              }`}
                            >
                              {e.eventType.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-primary">
                            {e.bookingReference || "—"}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[10px] text-foreground/80">
                            {e.referenceNumber || "—"}
                          </td>
                          <td className="py-2.5 px-4 text-right text-red-600 dark:text-red-400 tabular-nums">
                            {e.debit > 0 ? formatCurrency(e.debit) : "—"}
                          </td>
                          <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {e.credit > 0 ? formatCurrency(e.credit) : "—"}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-foreground tabular-nums">
                            {formatCurrency(e.runningBalance)}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground/90">
                            {e.adminName}
                          </td>
                          <td className="py-2.5 px-4 text-[10px] text-muted-foreground max-w-sm">
                            {(() => {
                              if (!e.notes) return "—";
                              const receiptMatch = e.notes.match(
                                /(.*)Receipt:\s*(https?:\/\/[^|]+)(.*)/i,
                              );
                              if (receiptMatch) {
                                const before = receiptMatch[1].trim();
                                const url = encodeURI(receiptMatch[2].trim());
                                const after = receiptMatch[3].trim();
                                const text = [before, after]
                                  .filter(Boolean)
                                  .join(" ");
                                return (
                                  <div className="flex flex-col gap-1">
                                    <span
                                      title={e.notes}
                                      className="truncate block"
                                    >
                                      {text || "No additional notes"}
                                    </span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 hover:underline font-semibold"
                                    >
                                      <FileText
                                        size={10}
                                        className="shrink-0"
                                      />
                                      View Receipt
                                    </a>
                                  </div>
                                );
                              }
                              return e.notes;
                            })()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-10 text-center text-muted-foreground text-xs"
                        >
                          No financial ledger entries exist for this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Wallet History */}
          {activeTab === "wallet" && (
            <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary/10">
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Transaction Type</th>
                      <th className="py-2.5 px-4">Payment Reference</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4 text-right">
                        Running Balance
                      </th>
                      <th className="py-2.5 px-4">Processed By</th>
                      <th className="py-2.5 px-4 max-w-xs">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {walletHistory && walletHistory.length > 0 ? (
                      walletHistory.map((w: any) => (
                        <tr
                          key={w.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="py-2.5 px-4 text-muted-foreground/80 text-[10px]">
                            {new Date(w.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                w.type.startsWith("CREDIT") ||
                                w.type.startsWith("REVERSAL_DEBIT")
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {w.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[10px] text-foreground/80">
                            {w.reference || "—"}
                          </td>
                          <td
                            className={`py-2.5 px-4 text-right tabular-nums font-bold ${
                              w.amount > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {w.amount > 0 ? "+" : ""}
                            {formatCurrency(w.amount)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-extrabold text-foreground tabular-nums">
                            {formatCurrency(w.runningBalance)}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground/90">
                            {w.adminName}
                          </td>
                          <td
                            className="py-2.5 px-4 max-w-xs truncate text-muted-foreground text-[10px]"
                            title={w.notes}
                          >
                            {w.notes}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-10 text-center text-muted-foreground text-xs"
                        >
                          No wallet transactions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Processed Payments & Reversals */}
          {activeTab === "payments" && (
            <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary/10">
                      <th className="py-2.5 px-4">Payment Ref</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4 text-right">Amount</th>
                      <th className="py-2.5 px-4">Method</th>
                      <th className="py-2.5 px-4">Source Bank</th>
                      <th className="py-2.5 px-4">Allocated Bookings</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Processed By</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {paymentsHistory && paymentsHistory.length > 0 ? (
                      paymentsHistory.map((p: any) => (
                        <tr
                          key={p.id}
                          className="hover:bg-secondary/5 transition-colors"
                        >
                          <td className="py-2.5 px-4 font-mono font-bold text-foreground">
                            {p.referenceNumber}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground/80 text-[10px]">
                            {new Date(p.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-right font-black text-foreground tabular-nums">
                            {formatCurrency(p.amount)}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground">
                            {p.paymentMethod}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground">
                            {p.bankAccount || "—"}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {p.allocations.map((a: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded bg-secondary/40 text-[9px] font-bold text-muted-foreground"
                                >
                                  {a.bookingReference} (
                                  {formatCurrency(a.amount)})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            {p.isReversed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                                <XCircle size={10} />
                                Reversed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <CheckCircle2 size={10} />
                                Settled
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-muted-foreground">
                            {p.adminName}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {!p.isReversed && (
                              <button
                                onClick={() =>
                                  handleReverseClick(p.id, p.referenceNumber)
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded font-black text-[10px] tracking-wider uppercase transition-colors"
                              >
                                <Undo2 size={10} />
                                Reverse
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-10 text-center text-muted-foreground text-xs"
                        >
                          No payments processed for this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Reusable Payment Modal */}
        <VendorPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          defaultVendorId={viewingVendorId}
          onSuccess={() => {
            refetchSummary();
            refetchLedger();
            refetchWallet();
            refetchPayments();
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
          }}
        />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DIRECTORY VIEW (DEFAULT TABLE)
  // ════════════════════════════════════════════════════════════
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/5 self-center shrink-0"
          >
            <Plus size={14} />
            Register Vendor
          </button>
        </div>
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
                      onClick={() => setViewingVendorId(vendor.id)}
                      className="hover:bg-secondary/15 transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-5 font-semibold text-primary">
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
                            onClick={(e) => handleEditClick(vendor, e)}
                            className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                            title="Update Vendor"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(vendor, e)}
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
                <div />
              )}
            </div>

            {/* Wallet Balance Card */}
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent p-4 flex items-center justify-between gap-4 mt-4">
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

      <VendorPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["vendors"] });
        }}
      />
    </div>
  );
}
