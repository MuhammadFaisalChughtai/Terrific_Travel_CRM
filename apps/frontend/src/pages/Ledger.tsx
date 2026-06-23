import React, { useState, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  Search,
  Loader2,
  Plus,
  Printer,
  Download,
  FileText,
  Mail,
  Filter,
  X
} from "lucide-react";
import VendorPaymentModal from "../components/VendorPaymentModal";

// Map raw eventTypes to friendly ledger "Type" labels
const TYPE_LABELS: Record<string, string> = {
  INVOICE_CREATED: "Invoice / Sales",
  VENDOR_PAYMENT: "Vendor Payment",
  WALLET_CREDIT: "Wallet Credit",
  WALLET_USAGE: "Wallet Usage",
  REVERSAL: "Reversal",
  CUSTOMER_PAYMENT: "Bank Receipts",
  CUSTOMER_REFUND: "Customer Refund",
  VENDOR_REFUND: "Refund from Vendor",
  AGENT_PAYOUT: "Agent Payout",
};

const TYPE_COLORS: Record<string, string> = {
  INVOICE_CREATED: "text-blue-600 dark:text-blue-400",
  VENDOR_PAYMENT: "text-red-600 dark:text-red-400",
  WALLET_CREDIT: "text-emerald-600 dark:text-emerald-400",
  WALLET_USAGE: "text-amber-600 dark:text-amber-400",
  REVERSAL: "text-purple-600 dark:text-purple-400",
  CUSTOMER_PAYMENT: "text-emerald-600 dark:text-emerald-400",
  CUSTOMER_REFUND: "text-orange-600 dark:text-orange-400",
  VENDOR_REFUND: "text-orange-600 dark:text-orange-400",
  AGENT_PAYOUT: "text-red-600 dark:text-red-400",
};

export default function LedgerPage() {
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedVendorId, setSelectedVendorId] = useState("all");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Fetch vendors list
  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data.items as any[];
    },
  });

  const { data: globalLedger, isLoading } = useQuery({
    queryKey: ["global-ledger", selectedVendorId],
    queryFn: async () => {
      const url = selectedVendorId === "all" ? "/vendors/ledger" : `/vendors/${selectedVendorId}/ledger`;
      const res = await apiClient.get(url);
      return res.data.data as any[];
    },
  });

  const selectedVendor = useMemo(() => {
    return vendors?.find((v: any) => v.id === selectedVendorId);
  }, [vendors, selectedVendorId]);

  const ledgerTitle = selectedVendor ? `${selectedVendor.name} Ledger` : "Global Financial Ledger";

  // Apply filters
  const filteredLedger = useMemo(() => {
    if (!globalLedger) return [];
    return globalLedger.filter((entry) => {
      // Type filter
      if (typeFilter !== "all" && entry.eventType !== typeFilter) return false;

      // Date range
      const entryDate = new Date(entry.timestamp);
      if (dateFrom && entryDate < new Date(dateFrom)) return false;
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (entryDate > toDate) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          entry.vendorName?.toLowerCase().includes(q) ||
          entry.bookingReference?.toLowerCase().includes(q) ||
          entry.notes?.toLowerCase().includes(q) ||
          entry.referenceNumber?.toLowerCase().includes(q) ||
          entry.adminName?.toLowerCase().includes(q) ||
          TYPE_LABELS[entry.eventType]?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [globalLedger, typeFilter, dateFrom, dateTo, searchQuery]);

  // Calculate opening balance = running balance of the record BEFORE our filtered window
  const openingBalance = useMemo(() => {
    if (!globalLedger || globalLedger.length === 0) return 0;
    if (!dateFrom) {
      // No start date = starting from 0
      return 0;
    }
    // Find the last entry before our filtered set
    const sortedAll = [...globalLedger].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const fromDate = new Date(dateFrom);
    const priorEntries = sortedAll.filter(
      (e) => new Date(e.timestamp) < fromDate
    );
    return priorEntries.at(-1)?.runningBalance ?? 0;
  }, [globalLedger, dateFrom]);

  // Period totals
  const periodTotalDebit = filteredLedger.reduce((s, e) => s + (e.debit || 0), 0);
  const periodTotalCredit = filteredLedger.reduce((s, e) => s + (e.credit || 0), 0);
  const closingBalance = openingBalance + periodTotalDebit - periodTotalCredit;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html><head><title>${ledgerTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #111; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
        td { border: 1px solid #e5e7eb; padding: 5px 8px; }
        .summary-row td { font-weight: bold; background: #f9fafb; }
        .opening-row td { font-weight: bold; background: #eff6ff; }
        .final-row td { font-weight: bold; background: #f0fdf4; }
        .text-right { text-align: right; }
        .text-blue { color: #2563eb; }
        .text-red { color: #dc2626; }
        .text-green { color: #16a34a; }
        h2 { margin-bottom: 4px; }
        .subtitle { color: #6b7280; margin-bottom: 16px; font-size: 11px; }
      </style></head>
      <body>
        <h2>${ledgerTitle}</h2>
        <p class="subtitle">Printed on ${new Date().toLocaleString()}</p>
        ${content}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ["Doc No", "Type", "Date", "Debit", "Credit", "Notes"],
      ["", "Opening Balance", "", openingBalance.toFixed(2), "0.00", ""],
      ...filteredLedger.map((e) => [
        e.referenceNumber || "",
        TYPE_LABELS[e.eventType] || e.eventType,
        new Date(e.timestamp).toLocaleDateString("en-GB"),
        e.debit > 0 ? e.debit.toFixed(2) : "",
        e.credit > 0 ? e.credit.toFixed(2) : "",
        e.notes || (e.vendorName ? `Vendor: ${e.vendorName}` : "") + (e.bookingReference ? ` | Booking: ${e.bookingReference}` : ""),
      ]),
      ["", "Period Total", "", periodTotalDebit.toFixed(2), periodTotalCredit.toFixed(2), ""],
      ["", "Closing Balance", "", closingBalance.toFixed(2), "0.00", ""],
      ["", "Final Closing Balance", "", closingBalance.toFixed(2), "0.00", ""],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = selectedVendor
      ? `${selectedVendor.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_ledger_${new Date().toISOString().slice(0, 10)}.csv`
      : `global_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
    setTypeFilter("all");
    setSelectedVendorId("all");
  };

  const hasFilters = dateFrom || dateTo || searchQuery || typeFilter !== "all" || selectedVendorId !== "all";

  return (
    <div className="space-y-4 font-sans">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            {ledgerTitle}
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Complete audit trail — receipts, payments, refunds and agent payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransactionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/10 shrink-0"
          >
            <Plus size={13} />
            Record Transaction
          </button>
        </div>
      </div>

      {/* ── Toolbar: Filters + Export ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        {/* Ledger/Vendor Selector */}
        <div className="flex items-center gap-1.5">
          <Filter size={11} className="text-muted-foreground" />
          <select
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="px-2 py-1.5 bg-secondary/20 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
          >
            <option value="all">Global Ledger</option>
            {vendors?.map((v: any) => (
              <option key={v.id} value={v.id}>
                {v.name} Ledger
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1.5 bg-secondary/20 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1.5 bg-secondary/20 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={11} className="text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1.5 bg-secondary/20 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-semibold"
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {/* Inline Search */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
          <div className="relative flex-1">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes, vendor, booking ref…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-secondary/20 border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground/50 transition-all"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              title="Clear filters"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5 sm:ml-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
            title="Export CSV"
          >
            <Download size={11} /> CSV
          </button>
          <button
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
            title="Export PDF"
            onClick={handlePrint}
          >
            <FileText size={11} /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
            title="Print"
          >
            <Printer size={11} /> Print
          </button>
        </div>
      </div>

      {/* ── Ledger Table ── */}
      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-xs text-muted-foreground">
            <Loader2 size={16} className="animate-spin text-primary" />
            <span>Loading ledger…</span>
          </div>
        ) : (
          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground font-bold bg-secondary/10">
                  <th className="py-2.5 px-4 w-32">Doc No</th>
                  <th className="py-2.5 px-4 w-44">Type</th>
                  <th className="py-2.5 px-4 w-28">Date</th>
                  <th className="py-2.5 px-4 text-right w-32">Debit (HC)</th>
                  <th className="py-2.5 px-4 text-right w-32">Credit (HC)</th>
                  <th className="py-2.5 px-4">
                    <span className="flex items-center gap-1">Notes <Search size={9} /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">

                {/* ── Opening Balance Row ── */}
                <tr className="bg-blue-500/5 border-b border-blue-500/10">
                  <td className="py-2.5 px-4 text-[10px] text-muted-foreground/60"></td>
                  <td className="py-2.5 px-4 font-black text-foreground text-[11px]">Opening Balance</td>
                  <td className="py-2.5 px-4 text-[10px] text-muted-foreground/60"></td>
                  <td className="py-2.5 px-4 text-right font-black text-foreground tabular-nums">
                    {openingBalance > 0 ? formatCurrency(openingBalance) : formatCurrency(0)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-muted-foreground/60 tabular-nums">0.00</td>
                  <td className="py-2.5 px-4"></td>
                </tr>

                {/* ── Transaction Rows ── */}
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((e: any, idx: number) => {
                    const hasReceipt = e.notes && e.notes.match(/Receipt:\s*(https?:\/\/[^|]+)/i);
                    const receiptUrl = hasReceipt ? encodeURI(hasReceipt[1].trim()) : null;
                    const cleanedNotes = e.notes ? e.notes.replace(/Receipt:\s*https?:\/\/[^|]+/i, "").trim() : "";

                    const notesParts = [
                      cleanedNotes,
                      e.vendorName ? `Vendor: ${e.vendorName}` : null,
                      e.bookingReference ? `Booking: ${e.bookingReference}` : null,
                      e.adminName ? `By: ${e.adminName}` : null,
                    ].filter(Boolean);

                    const notesText = notesParts.join(" | ");

                    return (
                      <tr
                        key={e.id}
                        className={`hover:bg-secondary/5 transition-colors ${idx % 2 === 0 ? "" : "bg-secondary/5"}`}
                      >
                        {/* Doc No */}
                        <td className="py-2.5 px-4 font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                          {e.referenceNumber || "—"}
                        </td>

                        {/* Type */}
                        <td className={`py-2.5 px-4 font-semibold text-[11px] ${TYPE_COLORS[e.eventType] || "text-foreground"}`}>
                          {TYPE_LABELS[e.eventType] || e.eventType}
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-4 text-[10px] text-muted-foreground">
                          {new Date(e.timestamp).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Debit */}
                        <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-foreground">
                          {e.debit > 0 ? formatCurrency(e.debit) : ""}
                        </td>

                        {/* Credit */}
                        <td className="py-2.5 px-4 text-right tabular-nums font-semibold text-foreground">
                          {e.credit > 0 ? formatCurrency(e.credit) : ""}
                        </td>

                        {/* Notes */}
                        <td className="py-2.5 px-4 text-[10px] text-muted-foreground max-w-sm">
                          <div className="flex flex-col gap-1">
                            <span title={notesText} className="truncate block">{notesText || "—"}</span>
                            {receiptUrl && (
                              <a
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 hover:underline font-semibold"
                              >
                                <FileText size={10} className="shrink-0" />
                                View Receipt
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-muted-foreground/60 text-xs">
                      No ledger entries match your filters.
                    </td>
                  </tr>
                )}

                {/* ── Period Total ── */}
                <tr className="border-t-2 border-border bg-secondary/10">
                  <td className="py-2.5 px-4"></td>
                  <td className="py-2.5 px-4 font-black text-foreground text-[11px] uppercase tracking-wider">
                    Period Total
                  </td>
                  <td className="py-2.5 px-4"></td>
                  <td className="py-2.5 px-4 text-right font-black text-foreground tabular-nums">
                    {periodTotalDebit > 0 ? formatCurrency(periodTotalDebit) : "0.00"}
                  </td>
                  <td className="py-2.5 px-4 text-right font-black text-foreground tabular-nums">
                    {periodTotalCredit > 0 ? formatCurrency(periodTotalCredit) : "0.00"}
                  </td>
                  <td className="py-2.5 px-4"></td>
                </tr>

                {/* ── Closing Balance ── */}
                <tr className="bg-secondary/5">
                  <td className="py-2.5 px-4"></td>
                  <td className="py-2.5 px-4 font-black text-foreground text-[11px]">
                    Closing Balance
                  </td>
                  <td className="py-2.5 px-4"></td>
                  <td className="py-2.5 px-4 text-right font-black text-foreground tabular-nums">
                    {formatCurrency(closingBalance)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-muted-foreground/60 tabular-nums">0.00</td>
                  <td className="py-2.5 px-4"></td>
                </tr>

                {/* ── Final Closing Balance ── */}
                <tr className="border-t border-border/60 bg-emerald-500/5">
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 font-black text-foreground text-[11px] uppercase tracking-wider">
                    Final Closing Balance
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-right font-black text-foreground tabular-nums">
                    {formatCurrency(closingBalance)}
                  </td>
                  <td className="py-3 px-4 text-right text-muted-foreground/60 tabular-nums">0.00</td>
                  <td className="py-3 px-4"></td>
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Count badge ── */}
      {!isLoading && (
        <p className="text-[10px] text-muted-foreground text-right">
          Showing <strong>{filteredLedger.length}</strong> entries
          {hasFilters && " (filtered)"}
        </p>
      )}

      {/* ── Transaction Modal ── */}
      <VendorPaymentModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["global-ledger"] });
        }}
      />
    </div>
  );
}
