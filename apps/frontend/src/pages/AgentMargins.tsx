import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Pagination from "../components/Pagination";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { 
  Calculator, Search, Loader2, RotateCcw, 
  Eye, Ban, DollarSign, CheckCircle2, ArrowUpDown, ArrowUp, ArrowDown,
  TrendingUp, Clock, Calendar, X, AlertCircle, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import AgentMarginBookingsModal from "../components/AgentMarginBookingsModal";
import RecalculateMarginModal from "../components/RecalculateMarginModal";

type SortField = 'agent' | 'period' | 'bookings' | 'totalProfit' | 'marginPercentage' | 'marginAmount' | 'status' | 'paidDate';
type SortOrder = 'asc' | 'desc';

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
  const [activeTab, setActiveTab] = useState<'all' | 'PAID' | 'UNPAID' | 'VOIDED'>('all');

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('period');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [selectedMargin, setSelectedMargin] = useState<any>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isRecalculateModalOpen, setIsRecalculateModalOpen] = useState(false);

  // Pay Margin Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payMarginTarget, setPayMarginTarget] = useState<any>(null);
  const [payAmount, setPayAmount] = useState<number | "">("");
  const [payNotes, setPayNotes] = useState("");

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch agents for filter
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items as any[];
    },
    enabled: isAdmin
  });

  // Fetch margins
  const { data: marginsResult, isLoading } = useQuery({
    queryKey: ["agent-margins", startDate, endDate, agentId, status, dateType, isAdmin, page, itemsPerPage],
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
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to reset payment");
    }
  });

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

  const summary = useMemo(() => {
    if (marginsResult && !Array.isArray(marginsResult) && marginsResult.summary) {
      return marginsResult.summary;
    }
    const all = margins;
    const paid = all.filter((m: any) => m.status === 'PAID');
    const unpaid = all.filter((m: any) => m.status === 'UNPAID' && m.marginPercentage > 0);
    const voided = all.filter((m: any) => m.status === 'VOIDED' || m.marginPercentage === 0);

    return {
      totalProfit: all.reduce((sum: number, m: any) => sum + (m.totalProfit || 0), 0),
      totalMarginAmount: all.reduce((sum: number, m: any) => sum + (m.marginAmount || 0), 0),
      totalPaidMargin: paid.reduce((sum: number, m: any) => sum + (m.marginAmount || 0), 0),
      totalPaidProfit: paid.reduce((sum: number, m: any) => sum + (m.totalProfit || 0), 0),
      totalUnpaidMargin: unpaid.reduce((sum: number, m: any) => sum + (m.marginAmount || 0), 0),
      totalUnpaidProfit: unpaid.reduce((sum: number, m: any) => sum + (m.totalProfit || 0), 0),
      totalBookings: all.reduce((sum: number, m: any) => sum + (m.bookingCount || 0), 0),
      allCount: all.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      voidedCount: voided.length,
    };
  }, [marginsResult, margins]);

  const handleTabChange = (tab: 'all' | 'PAID' | 'UNPAID' | 'VOIDED') => {
    setActiveTab(tab);
    setStatus(tab);
    setPage(1);
  };

  const applyPreset = (preset: 'thisMonth' | 'lastMonth' | 'last3Months' | 'yearToDate' | 'allTime') => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (preset === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'lastMonth') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (preset === 'last3Months') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'yearToDate') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === 'allTime') {
      setStartDate("");
      setEndDate("");
      setPage(1);
      return;
    }

    const tzOffsetStart = start.getTimezoneOffset() * 60000;
    const tzOffsetEnd = end.getTimezoneOffset() * 60000;
    setStartDate(new Date(start.getTime() - tzOffsetStart).toISOString().split("T")[0]);
    setEndDate(new Date(end.getTime() - tzOffsetEnd).toISOString().split("T")[0]);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'agent' || field === 'status' ? 'asc' : 'desc');
    }
  };

  const filteredMargins = useMemo(() => {
    if (!margins) return [];
    if (!searchQuery.trim()) return margins;
    const q = searchQuery.toLowerCase().trim();
    return margins.filter((m: any) => 
      m.agent?.name?.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q) ||
      (m.notes && m.notes.toLowerCase().includes(q))
    );
  }, [margins, searchQuery]);

  const sortedMargins = useMemo(() => {
    if (!filteredMargins) return [];
    return [...filteredMargins].sort((a: any, b: any) => {
      let aVal: any = null;
      let bVal: any = null;

      switch (sortField) {
        case 'agent':
          aVal = (a.agent?.name || '').toLowerCase();
          bVal = (b.agent?.name || '').toLowerCase();
          break;
        case 'period':
          aVal = new Date(a.startDate).getTime();
          bVal = new Date(b.startDate).getTime();
          break;
        case 'bookings':
          aVal = a.bookingCount || 0;
          bVal = b.bookingCount || 0;
          break;
        case 'totalProfit':
          aVal = a.totalProfit || 0;
          bVal = b.totalProfit || 0;
          break;
        case 'marginPercentage':
          aVal = a.marginPercentage || 0;
          bVal = b.marginPercentage || 0;
          break;
        case 'marginAmount':
          aVal = a.marginAmount || 0;
          bVal = b.marginAmount || 0;
          break;
        case 'status':
          aVal = (a.status || '').toLowerCase();
          bVal = (b.status || '').toLowerCase();
          break;
        case 'paidDate':
          aVal = a.paidDate ? new Date(a.paidDate).getTime() : 0;
          bVal = b.paidDate ? new Date(b.paidDate).getTime() : 0;
          break;
        default:
          aVal = new Date(a.startDate).getTime();
          bVal = new Date(b.startDate).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredMargins, sortField, sortOrder]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 ml-1 inline" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-primary ml-1 inline" /> 
      : <ArrowDown className="h-3 w-3 text-primary ml-1 inline" />;
  };

  const getStatusBadge = (m: any) => {
    const isVoided = m.status === 'VOIDED' || (m.marginPercentage === 0 && m.marginAmount === 0);
    const isPaid = m.status === 'PAID';

    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs">
          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          PAID
        </span>
      );
    }
    if (isVoided) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-xs">
          <Ban className="h-3 w-3 text-rose-600 dark:text-rose-400" />
          VOIDED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-xs">
        <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
        UNPAID
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Agent Margins</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAdmin 
              ? "Track monthly commission slabs, review paid payouts, and manage voided bookings." 
              : "View your monthly commission earnings and paid payouts."}
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecalculateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Calculate / Recalculate Margins</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Profit Card */}
        <div className="bg-card rounded-2xl p-4 border border-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Total Profit</p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              {formatCurrency(summary.totalProfit)}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Across {summary.totalBookings} qualified bookings
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Total Margin Paid Card */}
        <div className="bg-card rounded-2xl p-4 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs flex items-center justify-between bg-emerald-500/5">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">Total Margin Paid</p>
            <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(summary.totalPaidMargin)}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary.paidCount} periods successfully paid
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Pending / Unpaid Margin Card */}
        <div className="bg-card rounded-2xl p-4 border border-amber-200/80 dark:border-amber-800/40 shadow-xs flex items-center justify-between bg-amber-500/5">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">Pending Margins</p>
            <h3 className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {formatCurrency(summary.totalUnpaidMargin)}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary.unpaidCount} periods pending payout
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Voided Periods Card */}
        <div className="bg-card rounded-2xl p-4 border border-rose-200/80 dark:border-rose-800/40 shadow-xs flex items-center justify-between bg-rose-500/5">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-rose-700 dark:text-rose-400">Voided Periods</p>
            <h3 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {summary.voidedCount} Periods
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Zeroed or manually voided
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
            <Ban className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Date Controls */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-xs space-y-3">
        {/* Quick Date Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-border/60">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('thisMonth')}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground font-medium transition-colors"
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => applyPreset('lastMonth')}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground font-medium transition-colors"
          >
            Last Month
          </button>
          <button
            type="button"
            onClick={() => applyPreset('last3Months')}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground font-medium transition-colors"
          >
            Last 3 Months
          </button>
          <button
            type="button"
            onClick={() => applyPreset('yearToDate')}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground font-medium transition-colors"
          >
            Year to Date
          </button>
          <button
            type="button"
            onClick={() => applyPreset('allTime')}
            className="text-xs px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground font-medium transition-colors"
          >
            All Time
          </button>
        </div>

        {/* Detailed Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {isAdmin && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Agent</label>
              <select
                value={agentId}
                onChange={(e) => {
                  setAgentId(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="all">All Agents</option>
                {agents?.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Date Type</label>
            <select
              value={dateType}
              onChange={(e) => {
                setDateType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-background border border-input rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-ring font-medium"
            >
              <option value="booking">Booking Date</option>
              <option value="fullyPaid">Fully Paid Date</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setAgentId("all");
                setStatus("all");
                setActiveTab("all");
                setDateType("booking");
                setSearchQuery("");
                setPage(1);
              }}
              className="w-full py-1.5 px-3 rounded-xl border border-border hover:bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        {/* Status Filter Tabs & Search Bar */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleTabChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>All Margins</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'all' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-background text-foreground'}`}>
                {summary.allCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('PAID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PAID'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Paid Margins</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'PAID' ? 'bg-white/20 text-white' : 'bg-background text-foreground'}`}>
                {summary.paidCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('UNPAID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'UNPAID'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
              <span>Unpaid Margins</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'UNPAID' ? 'bg-white/20 text-white' : 'bg-background text-foreground'}`}>
                {summary.unpaidCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('VOIDED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'VOIDED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Voided Margins</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'VOIDED' ? 'bg-white/20 text-white' : 'bg-background text-foreground'}`}>
                {summary.voidedCount}
              </span>
            </button>
          </div>

          {/* Search Box and Items per page */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search agent, period, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pl-9 pr-8 py-1.5 text-xs focus:ring-2 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="bg-background border border-input rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground focus:ring-2 focus:ring-ring"
              title="Items per page"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border select-none">
              <tr>
                {isAdmin && (
                  <th 
                    onClick={() => handleSort('agent')} 
                    className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                  >
                    Agent {renderSortIndicator('agent')}
                  </th>
                )}
                <th 
                  onClick={() => handleSort('period')} 
                  className="px-4 py-3 cursor-pointer hover:text-foreground transition-colors"
                >
                  Period / Months {renderSortIndicator('period')}
                </th>
                <th 
                  onClick={() => handleSort('bookings')} 
                  className="px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  Bookings {renderSortIndicator('bookings')}
                </th>
                <th 
                  onClick={() => handleSort('totalProfit')} 
                  className="px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  Total Profit {renderSortIndicator('totalProfit')}
                </th>
                <th 
                  onClick={() => handleSort('marginPercentage')} 
                  className="px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  Margin % {renderSortIndicator('marginPercentage')}
                </th>
                <th 
                  onClick={() => handleSort('marginAmount')} 
                  className="px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors"
                >
                  Margin Amount {renderSortIndicator('marginAmount')}
                </th>
                <th 
                  onClick={() => handleSort('status')} 
                  className="px-4 py-3 text-center cursor-pointer hover:text-foreground transition-colors"
                >
                  Status {renderSortIndicator('status')}
                </th>
                <th 
                  onClick={() => handleSort('paidDate')} 
                  className="px-4 py-3 text-center cursor-pointer hover:text-foreground transition-colors"
                >
                  Paid Info {renderSortIndicator('paidDate')}
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="px-4 py-12 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    <span>Loading margin records...</span>
                  </td>
                </tr>
              ) : sortedMargins.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                      <div className="p-3 bg-muted/60 rounded-full text-muted-foreground">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-sm text-foreground">No margins found</p>
                      <p className="text-xs text-muted-foreground">
                        No margin records match the selected date range, agent, or status filter. Try resetting filters or recalculating.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedMargins.map((m: any) => {
                  const isVoided = m.status === 'VOIDED' || (m.marginPercentage === 0 && m.marginAmount === 0);
                  const isPaid = m.status === 'PAID';

                  return (
                    <tr 
                      key={m.id} 
                      className={`hover:bg-muted/40 transition-colors ${isVoided ? 'opacity-60 bg-rose-500/5' : ''}`}
                    >
                      {isAdmin && (
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {m.agent?.name || "Unknown Agent"}
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 opacity-60" />
                          <span>
                            {new Date(m.startDate).toLocaleDateString(undefined, { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })}
                            {" – "}
                            {new Date(m.endDate).toLocaleDateString(undefined, { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        <span className="font-bold text-foreground">{m.bookingCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(m.totalProfit)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block px-1.5 py-0.5 rounded font-bold text-[11px] bg-secondary text-secondary-foreground">
                          {m.marginPercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-sm text-foreground">
                        {formatCurrency(m.marginAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(m)}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {isPaid ? (
                          <div className="flex flex-col items-center justify-center text-[11px] leading-tight text-muted-foreground">
                            <span className="font-medium text-foreground">{m.paidDate ? formatDate(m.paidDate) : "Paid"}</span>
                            {m.paidBy && (
                              <span className="text-[10px] opacity-75">{m.paidBy.firstName} {m.paidBy.lastName}</span>
                            )}
                          </div>
                        ) : isVoided ? (
                          <span className="text-[11px] text-rose-500 font-semibold italic">Voided</span>
                        ) : (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium italic">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Bookings Button */}
                          <button
                            type="button"
                            title="View Bookings Breakdown"
                            onClick={() => {
                              setSelectedMargin(m);
                              setIsBookingsModalOpen(true);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {/* Admin Actions */}
                          {isAdmin && !isPaid && (
                            <>
                              {isVoided ? (
                                <button
                                  type="button"
                                  title="Unvoid Margin (Restore eligible bookings & commission)"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to unvoid this margin for ${m.agent?.name}? All eligible bookings will be restored and margin will be recalculated.`)) {
                                      toggleVoidMutation.mutate(m.id);
                                    }
                                  }}
                                  disabled={toggleVoidMutation.isPending}
                                  className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  title="Void Margin (Void all bookings for this period)"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to void this margin for ${m.agent?.name}? All bookings in this period will be marked as voided.`)) {
                                      toggleVoidMutation.mutate(m.id);
                                    }
                                  }}
                                  disabled={toggleVoidMutation.isPending}
                                  className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                              )}

                              {!isVoided && (
                                <button
                                  type="button"
                                  title="Pay Margin / Mark as Paid"
                                  onClick={() => {
                                    setPayMarginTarget(m);
                                    setPayAmount(m.marginAmount);
                                    setPayNotes(`Agent Margin Payout`);
                                    setIsPayModalOpen(true);
                                  }}
                                  className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer"
                                >
                                  <DollarSign className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                          
                          {/* Reset Payment */}
                          {isAdmin && isPaid && (
                            <button
                              type="button"
                              title="Reset Payment (Remove ledger entry and mark unpaid)"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to reset this payment? It will remove the ledger entry.")) {
                                  resetMutation.mutate(m.id);
                                }
                              }}
                              disabled={resetMutation.isPending}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer Totals */}
            {sortedMargins.length > 0 && (
              <tfoot className="bg-muted/30 border-t-2 border-border font-bold text-xs">
                <tr>
                  <td colSpan={isAdmin ? 2 : 1} className="px-4 py-3 text-foreground uppercase tracking-wider">
                    Total ({sortedMargins.length} records on this page):
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {sortedMargins.reduce((sum: number, m: any) => sum + (m.bookingCount || 0), 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sortedMargins.reduce((sum: number, m: any) => sum + (m.totalProfit || 0), 0))}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">—</td>
                  <td className="px-4 py-3 text-right text-foreground font-extrabold">
                    {formatCurrency(sortedMargins.reduce((sum: number, m: any) => sum + (m.marginAmount || 0), 0))}
                  </td>
                  <td colSpan={3} className="px-4 py-3 text-right text-muted-foreground">
                    Filtered Paid: <span className="text-emerald-600 font-bold">{formatCurrency(sortedMargins.filter((m: any) => m.status === 'PAID').reduce((sum: number, m: any) => sum + (m.marginAmount || 0), 0))}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalItems={totalMargins}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          itemName="margin records"
        />
      </div>

      {/* Bookings Modal */}
      {isBookingsModalOpen && selectedMargin && (
        <AgentMarginBookingsModal
          margin={selectedMargin}
          onClose={() => {
            setIsBookingsModalOpen(false);
            setSelectedMargin(null);
          }}
        />
      )}

      {/* Recalculate Modal */}
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
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={payMutation.isPending}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
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
