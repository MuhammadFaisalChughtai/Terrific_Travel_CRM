import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, differenceInMinutes } from "date-fns";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import { LogIn, LogOut, CheckCircle2, XCircle, Clock, Filter, ChevronDown, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";

interface AttendanceRecord {
  id: string;
  agentId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "PRESENT" | "ABSENT" | "ON_LEAVE";
  agent?: { name: string };
}

export default function Attendance() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isAdmin = user?.roles.includes("SUPER_ADMIN") || user?.roles.includes("ADMIN");

  const [filters, setFilters] = useState({
    agentId: "all",
    fromDate: "",
    toDate: "",
    status: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch agents for the dropdown
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items;
    },
    enabled: isAdmin,
  });

  // Agent: Get Today's Status
  const { data: todayStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ["attendance", "today"],
    queryFn: async () => {
      const res = await apiClient.get("/attendance/today");
      return res.data.data as AttendanceRecord | null;
    },
    enabled: !isAdmin,
  });

  // Admin: Get All Attendance
  const { data: allAttendance, isLoading: loadingAll } = useQuery({
    queryKey: ["attendance", "all", filters],
    queryFn: async () => {
      const res = await apiClient.get(`/attendance/admin/all`, {
        params: { 
          agentId: filters.agentId,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          status: filters.status
        }
      });
      return res.data.data as AttendanceRecord[];
    },
    enabled: isAdmin,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/attendance/check-in");
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to check in");
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/attendance/check-out");
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Checked out successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to check out");
    }
  });

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agent Attendance</h2>
            <p className="text-muted-foreground">View and monitor daily attendance across all agents.</p>
          </div>
          <div>
            <button 
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#f4722b] hover:bg-[#d96222] text-white border-2 border-[#2a1727] rounded-lg font-bold transition-colors shadow-sm"
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Filter Modal */}
            <Modal
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              title="Filters"
              maxWidth="sm"
            >
              <div className="space-y-6 p-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} /> Agent
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-muted/30 hover:bg-muted/50 border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all cursor-pointer"
                      value={filters.agentId}
                      onChange={(e) => setFilters({...filters, agentId: e.target.value})}
                    >
                      <option value="all">All Agents</option>
                      {agents?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full bg-muted/30 hover:bg-muted/50 border border-border/80 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground transition-all cursor-pointer"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full bg-muted/30 hover:bg-muted/50 border border-border/80 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground transition-all cursor-pointer"
                        value={filters.toDate}
                        onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-muted/30 hover:bg-muted/50 border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all cursor-pointer"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">Any Status</option>
                      <option value="present">Present</option>
                      <option value="on_leave">On Leave</option>
                      <option value="absent">Absent</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-border/50">
                  <button 
                    onClick={() => {
                      setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" });
                      setShowFilters(false);
                    }}
                    className="px-5 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all shadow-md shadow-primary/20"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Attendance Sheet</h3>
              <p className="text-sm text-muted-foreground">All check-ins and check-outs are recorded here.</p>
            </div>
            
            {/* Active Filters Display */}
            {(filters.agentId !== "all" || filters.fromDate || filters.toDate || filters.status !== "all") && (
              <button 
                onClick={() => setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" })}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted/50 px-2 py-1 rounded"
              >
                <XCircle size={12} /> Clear Filters
              </button>
            )}
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Date</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Agent</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Check In</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Check Out</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Duration</th>
                    <th className="px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 bg-card">
                  {loadingAll ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={24} />
                        Loading attendance records...
                      </td>
                    </tr>
                  ) : allAttendance && allAttendance.length > 0 ? (
                    allAttendance.map((record) => {
                      let duration = "-";
                      if (record.checkInTime && record.checkOutTime) {
                        const mins = differenceInMinutes(new Date(record.checkOutTime), new Date(record.checkInTime));
                        const h = Math.floor(mins / 60);
                        const m = mins % 60;
                        duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
                      }

                      return (
                        <tr key={record.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">
                            {format(new Date(record.date), "MMM dd, yyyy")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground">{record.agent?.name || "Unknown Agent"}</div>
                          </td>
                          <td className="px-6 py-4">
                            {record.checkInTime ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-500/10 w-fit px-2.5 py-1 rounded-md text-xs border border-emerald-500/20">
                                <Clock size={12} />
                                {format(new Date(record.checkInTime), "hh:mm a")}
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-medium">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {record.checkOutTime ? (
                              <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-500/10 w-fit px-2.5 py-1 rounded-md text-xs border border-rose-500/20">
                                <Clock size={12} />
                                {format(new Date(record.checkOutTime), "hh:mm a")}
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-medium">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-foreground">
                              {duration}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {record.status === "PRESENT" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <CheckCircle2 size={12} />
                                PRESENT
                              </span>
                            ) : record.status === "ABSENT" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                                <XCircle size={12} />
                                ABSENT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                ON LEAVE
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Clock size={32} className="text-muted-foreground/50" />
                          <p>No attendance records found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AGENT VIEW
  const getAgentUIState = () => {
    if (loadingStatus) return { text: "Loading...", icon: <Clock className="animate-spin" />, disabled: true, classes: "bg-primary text-primary-foreground opacity-50" };
    if (!todayStatus) return { text: "Check In", icon: <LogIn className="mr-2 h-5 w-5" />, action: () => checkInMutation.mutate(), disabled: checkInMutation.isPending, classes: "bg-primary text-primary-foreground hover:bg-primary/90" };
    
    if (todayStatus.status === "ABSENT") {
      return { text: "Marked Absent", icon: <XCircle className="mr-2 h-5 w-5" />, disabled: true, classes: "bg-destructive text-destructive-foreground opacity-80" };
    }

    if (todayStatus.checkInTime && !todayStatus.checkOutTime) {
      return { text: "Check Out", icon: <LogOut className="mr-2 h-5 w-5" />, action: () => checkOutMutation.mutate(), disabled: checkOutMutation.isPending, classes: "bg-amber-600 text-white hover:bg-amber-700" };
    }

    if (todayStatus.checkOutTime) {
      return { text: "Checked Out for Today", icon: <CheckCircle2 className="mr-2 h-5 w-5" />, disabled: true, classes: "bg-muted text-muted-foreground border border-border" };
    }

    return { text: "Unknown State", disabled: true, classes: "bg-muted" };
  };

  const uiState = getAgentUIState();

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Daily Attendance</h2>
        <p className="text-muted-foreground">Please check in when you start your shift and check out when you finish.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border text-center bg-muted/20">
          <h3 className="text-xl font-semibold">{format(new Date(), "EEEE, MMMM do, yyyy")}</h3>
          <p className="text-sm text-muted-foreground mt-1">You can only check in and check out once per day.</p>
        </div>
        <div className="p-10 flex flex-col items-center justify-center space-y-6">
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button 
              className={`flex items-center justify-center h-16 text-lg font-medium w-full rounded-xl transition-all active:scale-95 disabled:pointer-events-none shadow-md ${uiState.classes}`}
              disabled={uiState.disabled}
              onClick={uiState.action}
            >
              {uiState.icon}
              {uiState.text}
            </button>
          </div>

          {todayStatus && (
            <div className="w-full pt-8 border-t border-border flex justify-around text-sm text-muted-foreground mt-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-foreground text-xs uppercase tracking-wider">Check In</span>
                <span className="font-medium bg-muted px-3 py-1 rounded-md">{todayStatus.checkInTime ? format(new Date(todayStatus.checkInTime), "hh:mm a") : "--:--"}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-foreground text-xs uppercase tracking-wider">Check Out</span>
                <span className="font-medium bg-muted px-3 py-1 rounded-md">{todayStatus.checkOutTime ? format(new Date(todayStatus.checkOutTime), "hh:mm a") : "--:--"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
