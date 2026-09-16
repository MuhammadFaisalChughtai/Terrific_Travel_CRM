import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "../components/Pagination";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { 
  Calculator, Search, Loader2, CheckCircle, RotateCcw, 
  FileText, Download, Filter, Eye, Ban, DollarSign, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import AgentMarginBookingsModal from "../components/AgentMarginBookingsModal";
import RecalculateMarginModal from "../components/RecalculateMarginModal";

export default function AgentMargins() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isAdmin = user?.roles.includes("SUPER_ADMIN") || user?.roles.includes("ADMIN");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split("T")[0];
  });
  const [agentId, setAgentId] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateType, setDateType] = useState("booking");

  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedMargin, setSelectedMargin] = useState<any>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isRecalculateModalOpen, setIsRecalculateModalOpen] = useState(false);

  // Pay Margin Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payMarginTarget, setPayMarginTarget] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [payNotes, setPayNotes] = useState("");

  // Fetch agents for filter
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items as any[];
    },
    enabled: isAdmin
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch margins
  const { data: marginsResult, isLoading } = useQuery({
    queryKey: ["agent-margins", startDate, endDate, agentId, status, dateType, isAdmin, page],
    queryFn: async () => {
      if (!isAdmin) {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (status !== "all") params.append("status", status);
        const res = await apiClient.get(`/agent-margins/my-margins?${params.toString()}`);
        return res.data.data as any[];
      }
      const offset = (page - 1) * itemsPerPage;
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (agentId !== "all") params.append("agentId", agentId);
      if (status !== "all") params.append("status", status);
      if (dateType) params.append("dateType", dateType);
      params.append("limit", itemsPerPage.toString());
      params.append("offset", offset.toString());
      const res = await apiClient.get(`/agent-margins?${params.toString()}`);
      return res.data.data;
    }
  });

  const payMutation = useMutation({
    mutationFn: async ({ id, amount, notes }: { id: string; amount?: number; notes?: string }) => {
      return apiClient.put(`/agent-margins/${id}/pay`, { amount, notes });
    },
    onSuccess: () => {
      toast.success("Margin marked as paid successfully");
      setIsPayModalOpen(false);
      setPayMarginTarget(null);
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margins-history"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to mark as paid");
    }
  });

  const toggleVoidMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.patch(`/agent-margins/${id}/toggle-void`);
    },
    onSuccess: () => {
      toast.success("Margin status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margins-history"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update margin void status");
    }
  });

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.put(`/agent-margins/${id}/reset`);
    },
    onSuccess: () => {
      toast.success("Margin payment reset");
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margins-history"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset payment");
    }
  });

  // Fetch Paid Margins History
  const { data: paidHistoryResult, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["agent-margins-history", agentId, isAdmin],
    queryFn: async () => {
      if (!isAdmin) {
        const res = await apiClient.get("/agent-margins/my-margins?status=PAID");
        return res.data.data as any[];
      }
      const params = new URLSearchParams();
      params.append("status", "PAID");
      if (agentId !== "all") params.append("agentId", agentId);
      params.append("limit", "100");
      const res = await apiClient.get(`/agent-margins?${params.toString()}`);
      return res.data.data;
    }
  });

  const paidHistory = useMemo(() => {
    if (!paidHistoryResult) return [];
    if (Array.isArray(paidHistoryResult)) return paidHistoryResult;
    return paidHistoryResult.items || [];
  }, [paidHistoryResult]);

  const margins = useMemo(() => {
    if (!marginsResult) return [];
    if (Array.isArray(marginsResult)) return marginsResult;
    return marginsResult.items || [];
  }, [marginsResult]);

  const totalMargins = useMemo(() => {
    if (!marginsResult) return 0;
    if (Array.isArray(marginsResult)) return marginsResult.length;
    return marginsResult.total || 0;
  }, [marginsResult]);

  const filteredMargins = useMemo(() => {
    if (!margins) return [];
    if (!searchQuery) return margins;
    const q = searchQuery.toLowerCase();
    return margins.filter((m: any) => 
      m.agent?.name?.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  }, [margins, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agent Margins</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Manage and calculate monthly commission for agents." 
              : "View your monthly commission earnings."}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsRecalculateModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Recalculate
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border">
        {isAdmin && (
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Agent</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Agents</option>
              {agents?.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Date Type</label>
          <select
            value={dateType}
            onChange={(e) => setDateType(e.target.value)}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          >
            <option value="booking">Booking Date</option>
            <option value="fullyPaid">Fully Paid Date</option>
          </select>
        </div>
        {isAdmin && (
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Statuses</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="VOIDED">Voided</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search margins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-input rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                {isAdmin && <th className="px-4 py-3">Agent</th>}
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Bookings</th>
                <th className="px-4 py-3 text-right">Total Profit</th>
                <th className="px-4 py-3 text-right">Margin %</th>
                <th className="px-4 py-3 text-right">Margin Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading margins...
                  </td>
                </tr>
              ) : filteredMargins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No margin records found for this period.
                  </td>
                </tr>
              ) : (
                filteredMargins.map((m: any) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    {isAdmin && (
                      <td className="px-4 py-3 font-medium">
                        {m.agent?.name}
                      </td>
                    )}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {new Date(m.startDate).toLocaleDateString(undefined, { timeZone: "UTC" })} - {new Date(m.endDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.bookingCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(m.totalProfit)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.marginPercentage}%
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(m.marginAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        m.status === 'PAID' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                          : m.status === 'VOIDED'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : (m.marginPercentage === 0 && m.marginAmount === 0)
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {m.status === 'PAID' 
                          ? 'PAID' 
                          : (m.status === 'VOIDED' ? 'VOIDED' : ((m.marginPercentage === 0 && m.marginAmount === 0) ? 'VOIDED' : m.status))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="View Bookings Breakdown"
                          onClick={() => {
                            setSelectedMargin(m);
                            setIsBookingsModalOpen(true);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {/* Unvoid / Void Margin Action for Admin */}
                        {isAdmin && m.status !== 'PAID' && (
                          <>
                            {(m.status === 'VOIDED' || (m.marginPercentage === 0 && m.marginAmount === 0)) ? (
                              <button
                                title="Unvoid Margin (Restore eligible bookings & commission)"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to unvoid this margin for ${m.agent?.name}? All eligible bookings will be restored and margin will be recalculated.`)) {
                                    toggleVoidMutation.mutate(m.id);
                                  }
                                }}
                                disabled={toggleVoidMutation.isPending}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                title="Void Margin (Void all bookings for this period)"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to void this margin for ${m.agent?.name}? All bookings in this period will be marked as voided.`)) {
                                    toggleVoidMutation.mutate(m.id);
                                  }
                                }}
                                disabled={toggleVoidMutation.isPending}
                                className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                        
                        {/* Pay Margin Action for Admin */}
                        {isAdmin && m.status !== 'PAID' && (
                          <button
                            title="Pay Margin / Mark as Paid"
                            onClick={() => {
                              setPayMarginTarget(m);
                              setPayAmount(m.marginAmount);
                              setPayNotes(`Agent Margin Payout`);
                              setIsPayModalOpen(true);
                            }}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* Reset Payment for Admin */}
                        {isAdmin && m.status === 'PAID' && (
                          <button
                            title="Reset Payment (Remove ledger entry and mark unpaid)"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to reset this payment? It will remove the ledger entry.")) {
                                resetMutation.mutate(m.id);
                              }
                            }}
                            disabled={resetMutation.isPending}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalItems={totalMargins}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          itemName="margin records"
        />
      </div>

      {/* Paid Margin History Section */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Paid Margin History</h2>
          <p className="text-xs text-muted-foreground">
            A historical log of commissions that have been marked as paid to agents.
          </p>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg bg-background">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/15 text-muted-foreground font-semibold">
                {isAdmin && <th className="px-4 py-3">Agent</th>}
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Bookings</th>
                <th className="px-4 py-3 text-right">Total Profit</th>
                <th className="px-4 py-3 text-right">Margin %</th>
                <th className="px-4 py-3 text-right">Paid Margin</th>
                <th className="px-4 py-3 text-center">Paid Date</th>
                {isAdmin && <th className="px-4 py-3">Paid By</th>}
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isHistoryLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 7} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Loading payment history...</span>
                    </div>
                  </td>
                </tr>
              ) : paidHistory.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 7} className="px-4 py-8 text-center text-muted-foreground">
                    No paid margin history found.
                  </td>
                </tr>
              ) : (
                paidHistory.map((m: any) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                    {isAdmin && (
                      <td className="px-4 py-3 font-medium">
                        {m.agent?.name}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(m.startDate).toLocaleDateString(undefined, { timeZone: "UTC" })} - {new Date(m.endDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.bookingCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(m.totalProfit)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {m.marginPercentage}%
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(m.marginAmount)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap text-muted-foreground">
                      {m.paidDate ? formatDate(m.paidDate) : "—"}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-muted-foreground">
                        {m.paidBy ? `${m.paidBy.firstName} ${m.paidBy.lastName}` : "—"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Bookings"
                          onClick={() => {
                            setSelectedMargin(m);
                            setIsBookingsModalOpen(true);
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        
                        {isAdmin && (
                          <button
                            title="Reset Payment"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to reset this payment? It will remove the ledger entry.")) {
                                resetMutation.mutate(m.id);
                              }
                            }}
                            disabled={resetMutation.isPending}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isBookingsModalOpen && selectedMargin && (
        <AgentMarginBookingsModal
          margin={selectedMargin}
          onClose={() => {
            setIsBookingsModalOpen(false);
            setSelectedMargin(null);
          }}
        />
      )}

      {isRecalculateModalOpen && (
        <RecalculateMarginModal
          startDate={startDate}
          endDate={endDate}
          agentId={agentId}
          dateType={dateType}
          onClose={() => setIsRecalculateModalOpen(false)}
        />
      )}

      {/* Pay Margin Modal */}
      {isPayModalOpen && payMarginTarget && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => {
            setIsPayModalOpen(false);
            setPayMarginTarget(null);
          }}
          title={`Pay Commission Margin: ${payMarginTarget.agent?.name}`}
          maxWidth="md"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              payMutation.mutate({
                id: payMarginTarget.id,
                amount: payAmount === "" ? payMarginTarget.marginAmount : Number(payAmount),
                notes: payNotes
              });
            }}
            className="space-y-4 text-xs"
          >
            <div className="bg-secondary/20 p-3.5 rounded-xl border border-border/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Agent:</span>
                <span className="font-bold text-foreground">{payMarginTarget.agent?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Period:</span>
                <span className="font-medium text-foreground">
                  {new Date(payMarginTarget.startDate).toLocaleDateString(undefined, { timeZone: "UTC" })} - {new Date(payMarginTarget.endDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Total Profit:</span>
                <span className="font-medium text-foreground">{formatCurrency(payMarginTarget.totalProfit)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Calculated Margin:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {payMarginTarget.marginPercentage}% ({formatCurrency(payMarginTarget.marginAmount)})
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                Payable Margin Amount
              </label>
              <input
                type="number"
                step="any"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Enter amount to pay"
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm font-semibold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-muted-foreground uppercase tracking-wider block text-[10px]">
                Payout Notes (Optional)
              </label>
              <input
                type="text"
                value={payNotes}
                onChange={(e) => setPayNotes(e.target.value)}
                placeholder="e.g. Approved commission payout for period"
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setIsPayModalOpen(false);
                  setPayMarginTarget(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={payMutation.isPending}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                {payMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Payout...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Confirm & Pay Margin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
