import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import { LogIn, LogOut, CheckCircle2, XCircle, Clock, Filter, ChevronDown } from "lucide-react";
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
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agent</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-background border border-border/80 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f4722b] text-foreground shadow-sm"
                      value={filters.agentId}
                      onChange={(e) => setFilters({...filters, agentId: e.target.value})}
                    >
                      <option value="all">Any</option>
                      {agents?.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                  <div className="flex gap-3">
                    <input 
                      type="date" 
                      className="w-full bg-background border border-border/80 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f4722b] text-muted-foreground shadow-sm"
                      value={filters.fromDate}
                      onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                    />
                    <input 
                      type="date" 
                      className="w-full bg-background border border-border/80 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f4722b] text-muted-foreground shadow-sm"
                      value={filters.toDate}
                      onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-background border border-border/80 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f4722b] text-foreground shadow-sm"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="all">Any</option>
                      <option value="present">present</option>
                      <option value="on_leave">on_leave</option>
                      <option value="absent">absent</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    onClick={() => {
                      setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" });
                      setShowFilters(false);
                    }}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
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
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Date</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Agent</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Check In</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Check Out</th>
                    <th className="px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingAll ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading attendance records...</td>
                    </tr>
                  ) : allAttendance && allAttendance.length > 0 ? (
                    allAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 font-medium">{record.agent?.name || "Unknown Agent"}</td>
                        <td className="px-6 py-4">
                          {record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {record.status === "PRESENT" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Present
                            </span>
                          ) : record.status === "ABSENT" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                              Absent
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              On Leave
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No attendance records found.</td>
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
