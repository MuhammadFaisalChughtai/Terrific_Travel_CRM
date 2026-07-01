import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { 
  Calculator, Search, Loader2, CheckCircle, RotateCcw, 
  FileText, Download, Filter, Eye 
} from "lucide-react";
import { toast } from "sonner";
import AgentMarginBookingsModal from "../components/AgentMarginBookingsModal";

export default function AgentMargins() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isAdmin = user?.roles.includes("SUPER_ADMIN") || user?.roles.includes("ADMIN");

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [agentId, setAgentId] = useState("all");
  const [status, setStatus] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedMargin, setSelectedMargin] = useState<any>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

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
  const { data: margins, isLoading } = useQuery({
    queryKey: ["agent-margins", month, year, agentId, status, isAdmin],
    queryFn: async () => {
      if (!isAdmin) {
        const res = await apiClient.get("/agent-margins/my-margins");
        return res.data.data as any[];
      }
      const params = new URLSearchParams();
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());
      if (agentId !== "all") params.append("agentId", agentId);
      if (status !== "all") params.append("status", status);
      const res = await apiClient.get(`/agent-margins?${params.toString()}`);
      return res.data.data as any[];
    }
  });

  const calculateMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post("/agent-margins/calculate", { month, year });
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Margins calculated successfully");
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to calculate margins");
    }
  });

  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.put(`/agent-margins/${id}/pay`, { notes: "Paid via system" });
    },
    onSuccess: () => {
      toast.success("Margin marked as paid");
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to mark as paid");
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

  const filteredMargins = useMemo(() => {
    if (!margins) return [];
    if (!searchQuery) return margins;
    const q = searchQuery.toLowerCase();
    return margins.filter(m => 
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
              onClick={() => calculateMutation.mutate()}
              disabled={calculateMutation.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {calculateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4" />
              )}
              Recalculate {month}/{year}
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
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
          />
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
                    <td className="px-4 py-3">
                      {m.month}/{m.year}
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        m.status === 'PAID' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Bookings"
                          onClick={() => {
                            setSelectedMargin(m);
                            setIsBookingsModalOpen(true);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {isAdmin && m.status === 'UNPAID' && (
                          <button
                            title="Mark as Paid"
                            onClick={() => payMutation.mutate(m.id)}
                            disabled={payMutation.isPending}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {isAdmin && m.status === 'PAID' && (
                          <button
                            title="Reset Payment"
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
    </div>
  );
}
