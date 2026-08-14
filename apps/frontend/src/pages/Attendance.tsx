import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, differenceInMinutes } from "date-fns";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import { LogIn, LogOut, CheckCircle2, XCircle, Clock, Filter, Users, Loader2, Edit, AlertCircle, ShieldAlert, ShieldCheck, Plus, Check, Gift, Award, Calendar } from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import EditAttendanceModal from "../components/EditAttendanceModal";
import IssueFineModal from "../components/IssueFineModal";
import WaiveFineModal from "../components/WaiveFineModal";
import IssueBonusModal from "../components/IssueBonusModal";
import Pagination from "../components/Pagination";

interface AttendanceRecord {
  id: string;
  agentId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "PRESENT" | "ABSENT" | "ON_LEAVE";
  isLate?: boolean;
  lateMinutes?: number;
  agent?: { name: string };
}

export default function Attendance() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isAdmin = user?.roles.some((r) => {
    const up = r.toUpperCase();
    return ["SUPER_ADMIN", "ADMIN"].includes(up);
  });
  const canViewAudit = isAdmin;

  const [activeTab, setActiveTab] = useState<"log" | "sheet" | "fines" | "bonuses">(canViewAudit ? "sheet" : "log");

  const [filters, setFilters] = useState({
    agentId: "all",
    fromDate: "",
    toDate: "",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fine & Bonus Modals State
  const [isIssueFineOpen, setIsIssueFineOpen] = useState(false);
  const [selectedFineForWaiver, setSelectedFineForWaiver] = useState<any>(null);
  const [isWaiveFineOpen, setIsWaiveFineOpen] = useState(false);
  const [isIssueBonusOpen, setIsIssueBonusOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [finePage, setFinePage] = useState(1);
  const [bonusPage, setBonusPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
    setFinePage(1);
    setBonusPage(1);
  }, [filters]);

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
    enabled: canViewAudit,
  });

  // Agent: Get Today's Status
  const { data: todayStatus, isLoading: loadingStatus } = useQuery({
    queryKey: ["attendance", "today"],
    queryFn: async () => {
      const res = await apiClient.get("/attendance/today");
      return res.data.data as AttendanceRecord | null;
    },
    enabled: true,
  });

  // Agent: My Fines
  const { data: myFinesResult, isLoading: loadingMyFines } = useQuery({
    queryKey: ["fines", "my-fines", finePage],
    queryFn: async () => {
      const offset = (finePage - 1) * itemsPerPage;
      const res = await apiClient.get("/fines/my-fines", {
        params: { limit: itemsPerPage, offset },
      });
      return res.data.data;
    },
    enabled: !canViewAudit || activeTab === "log",
  });

  // Admin: Get All Attendance
  const { data: allAttendanceResult, isLoading: loadingAll } = useQuery({
    queryKey: ["attendance", "all", filters, page],
    queryFn: async () => {
      const offset = (page - 1) * itemsPerPage;
      const res = await apiClient.get(`/attendance/admin/all`, {
        params: {
          agentId: filters.agentId,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          status: filters.status,
          limit: itemsPerPage,
          offset,
        },
      });
      return res.data.data;
    },
    enabled: canViewAudit && activeTab === "sheet",
  });

  // Agent: My Bonuses
  const { data: myBonusesResult, isLoading: loadingMyBonuses } = useQuery({
    queryKey: ["bonuses", "my-bonuses", bonusPage],
    queryFn: async () => {
      const offset = (bonusPage - 1) * itemsPerPage;
      const res = await apiClient.get("/bonuses/my-bonuses", {
        params: { limit: itemsPerPage, offset },
      });
      return res.data.data;
    },
    enabled: !canViewAudit || activeTab === "log",
  });

  // Admin: Get All Staff Fines
  const { data: allFinesResult, isLoading: loadingAllFines } = useQuery({
    queryKey: ["fines", "admin", "all", filters, finePage],
    queryFn: async () => {
      const offset = (finePage - 1) * itemsPerPage;
      const res = await apiClient.get(`/fines/admin/all`, {
        params: {
          agentId: filters.agentId,
          status: filters.status,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          limit: itemsPerPage,
          offset,
        },
      });
      return res.data.data;
    },
    enabled: canViewAudit,
  });

  // Admin: Get All Staff Bonuses
  const { data: allBonusesResult, isLoading: loadingAllBonuses } = useQuery({
    queryKey: ["bonuses", "admin", "all", filters, bonusPage],
    queryFn: async () => {
      const offset = (bonusPage - 1) * itemsPerPage;
      const res = await apiClient.get(`/bonuses/admin/all`, {
        params: {
          agentId: filters.agentId,
          status: filters.status,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          limit: itemsPerPage,
          offset,
        },
      });
      return res.data.data;
    },
    enabled: canViewAudit,
  });

  const allAttendance = allAttendanceResult?.items || [];
  const totalItems = allAttendanceResult?.total || 0;

  const myFines = myFinesResult?.items || [];
  const myFinesSummary = myFinesResult?.summary || { totalPending: 0, totalDeducted: 0, totalWaived: 0 };

  const myBonuses = myBonusesResult?.items || [];
  const myBonusesSummary = myBonusesResult?.summary || { totalPending: 0, totalPaid: 0, count: 0 };

  const allFines = allFinesResult?.items || [];
  const allFinesTotal = allFinesResult?.total || 0;
  const allFinesSummary = allFinesResult?.summary || { totalPending: 0, totalDeducted: 0, totalWaived: 0, totalAmount: 0 };

  const allBonuses = allBonusesResult?.items || [];
  const allBonusesTotal = allBonusesResult?.total || 0;
  const allBonusesSummary = allBonusesResult?.summary || { totalPending: 0, totalPaid: 0, totalAmount: 0 };

  // Check In Mutation
  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/attendance/check-in");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Checked in successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      queryClient.invalidateQueries({ queryKey: ["fines"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to check in");
    },
  });

  // Check Out Mutation
  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/attendance/check-out");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Checked out successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to check out");
    },
  });

  const formatFineAmount = (amount: number, curr?: string) => {
    const code = (curr || "GBP").toUpperCase();
    const symbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
      PKR: "Rs ",
      SAR: "SAR ",
      AED: "AED ",
    };
    const symbol = symbols[code] || `${code} `;
    return `${symbol}${(amount || 0).toFixed(2)}`;
  };

  const formatMultiCurrencySummary = (
    items: any[],
    statusFilter?: string
  ) => {
    const filtered = statusFilter
      ? items.filter((item: any) => item.status === statusFilter)
      : items;

    if (!filtered || filtered.length === 0) return "£0.00";

    const totalsByCurrency: Record<string, number> = {};
    filtered.forEach((item: any) => {
      const code = (item.currency || "GBP").toUpperCase();
      totalsByCurrency[code] = (totalsByCurrency[code] || 0) + (item.amount || 0);
    });

    const currencyCodes = Object.keys(totalsByCurrency);
    if (currencyCodes.length === 0) return "£0.00";

    const symbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
      PKR: "Rs ",
      SAR: "SAR ",
      AED: "AED ",
    };

    return currencyCodes
      .map((code) => {
        const sym = symbols[code] || `${code} `;
        return `${sym}${totalsByCurrency[code].toFixed(2)}`;
      })
      .join(" + ");
  };

  const renderLogAttendance = () => {
    const isCheckedIn = !!todayStatus?.checkInTime;
    const isCheckedOut = !!todayStatus?.checkOutTime;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Daily Attendance</h2>
          <p className="text-muted-foreground text-sm">
            Please check in when you start your shift and check out when you finish.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6 shadow-sm max-w-md mx-auto">
          <div className="space-y-1">
            <p className="text-lg font-semibold">{format(new Date(), "EEEE, MMMM do, yyyy")}</p>
            <p className="text-xs text-muted-foreground">Shift start: 09:00 AM (15 min grace period)</p>
          </div>

          {loadingStatus ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {!isCheckedIn ? (
                <button
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                  className="w-full py-3 bg-[#f4722b] hover:bg-[#d96222] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {checkInMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn size={20} />}
                  Check In
                </button>
              ) : !isCheckedOut ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-lg flex items-center justify-between text-left">
                    <div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">Checked In At</p>
                      <p className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                        {format(new Date(todayStatus.checkInTime!), "hh:mm a")}
                      </p>
                      {todayStatus.isLate && (
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-0.5">
                          ⚠️ Late check-in ({todayStatus.lateMinutes} mins late)
                        </p>
                      )}
                    </div>
                    <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                  </div>

                  <button
                    onClick={() => checkOutMutation.mutate()}
                    disabled={checkOutMutation.isPending}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {checkOutMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut size={20} />}
                    Check Out
                  </button>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-bold text-sm">Completed Shift for Today</p>
                  <div className="text-xs text-muted-foreground flex justify-center gap-4 pt-1">
                    <span>In: {format(new Date(todayStatus.checkInTime!), "hh:mm a")}</span>
                    <span>Out: {format(new Date(todayStatus.checkOutTime!), "hh:mm a")}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Agent Fines Summary Ledger */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <ShieldAlert className="text-rose-500 w-5 h-5" /> My Fines &amp; Deductions
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Automatic SMTP Email Notifications Active</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Pending Fines</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {formatMultiCurrencySummary(myFines, "PENDING")}
              </p>
            </div>
            <div className="bg-card border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Deducted Fines</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatMultiCurrencySummary(myFines, "DEDUCTED")}
              </p>
            </div>
            <div className="bg-card border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Waived Fines</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatMultiCurrencySummary(myFines, "WAIVED")}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border font-bold text-sm flex items-center justify-between">
              <span>Fines History &amp; Violation Ledger</span>
              <span className="text-xs text-muted-foreground">{myFines.length} Record(s)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Violation Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Reason / Details</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingMyFines ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading fines history...
                      </td>
                    </tr>
                  ) : myFines.length > 0 ? (
                    myFines.map((f: any) => (
                      <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-semibold">{format(new Date(f.date), "dd MMM yyyy")}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase border ${
                              f.fineType === "LATE_ARRIVAL"
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                                : f.fineType === "ABSENCE"
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                                : "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {f.fineType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 font-black text-rose-600 dark:text-rose-400 text-sm">
                          {formatFineAmount(f.amount, f.currency)}
                        </td>
                        <td className="p-3 text-muted-foreground font-medium">{f.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                              f.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : f.status === "DEDUCTED"
                                ? "bg-slate-200 text-slate-900"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {f.status}
                          </span>
                          {f.status === "WAIVED" && f.waivedReason && (
                            <p className="text-[9px] text-emerald-600 mt-0.5 italic">Note: {f.waivedReason}</p>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                        No fines recorded on your account. Great job maintaining perfect attendance!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Agent Bonuses & Rewards Summary Ledger */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Gift className="text-emerald-500 w-5 h-5" /> My Bonuses &amp; Rewards
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Automatic SMTP Email Notifications Active</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Pending Bonuses</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatMultiCurrencySummary(myBonuses, "PENDING")}
              </p>
            </div>
            <div className="bg-card border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Paid Bonuses</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatMultiCurrencySummary(myBonuses, "PAID")}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border font-bold text-sm flex items-center justify-between">
              <span>Bonuses &amp; Appreciation Ledger</span>
              <span className="text-xs text-muted-foreground">{myBonuses.length} Record(s)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Bonus Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Reason / Details</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingMyBonuses ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading bonuses history...
                      </td>
                    </tr>
                  ) : myBonuses.length > 0 ? (
                    myBonuses.map((b: any) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-semibold">{format(new Date(b.date), "dd MMM yyyy")}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {b.bonusType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatFineAmount(b.amount, b.currency)}
                        </td>
                        <td className="p-3 text-muted-foreground font-medium">{b.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                              b.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                        No bonuses recorded yet. Check in on time to earn daily punctuality rewards!
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
  };

  return (
    <div className="space-y-6">
      {canViewAudit && (
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("sheet")}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
              activeTab === "sheet"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Staff Auditing Sheet
          </button>
          <button
            onClick={() => setActiveTab("fines")}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
              activeTab === "fines"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Staff Fines &amp; Penalties
          </button>
          <button
            onClick={() => setActiveTab("bonuses")}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
              activeTab === "bonuses"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Staff Bonuses &amp; Rewards
          </button>
          <button
            onClick={() => setActiveTab("log")}
            className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
              activeTab === "log"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Attendance
          </button>
        </div>
      )}

      {canViewAudit && activeTab === "sheet" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Staff Attendance Sheet</h2>
              <p className="text-muted-foreground">View and monitor daily attendance across all staff members.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsIssueFineOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                Issue Manual Fine
              </button>

              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f4722b] hover:bg-[#d96222] text-white border-2 border-[#2a1727] rounded-lg font-bold text-xs transition-colors shadow-sm"
              >
                <Filter size={16} />
                Filters
              </button>

              {/* Filter Modal */}
              <Modal isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filter Attendance" maxWidth="sm">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Staff Member
                    </label>
                    <select
                      value={filters.agentId}
                      onChange={(e) => setFilters({ ...filters, agentId: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">All Agents</option>
                      {agents?.map((agent: any) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="all">All Statuses</option>
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="ON_LEAVE">On Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" });
                        setShowFilters(false);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Check In</th>
                    <th className="p-3">Check Out</th>
                    <th className="p-3">Total Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingAll ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading attendance records...
                      </td>
                    </tr>
                  ) : allAttendance.length > 0 ? (
                    allAttendance.map((record: AttendanceRecord) => {
                      let totalMinutes = 0;
                      if (record.checkInTime && record.checkOutTime) {
                        totalMinutes = differenceInMinutes(
                          new Date(record.checkOutTime),
                          new Date(record.checkInTime)
                        );
                      }
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;

                      return (
                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-bold text-foreground">{record.agent?.name || "N/A"}</td>
                          <td className="p-3 font-semibold">{format(new Date(record.date), "dd MMM yyyy")}</td>
                          <td className="p-3 font-medium">
                            {record.checkInTime ? format(new Date(record.checkInTime), "hh:mm a") : "—"}
                            {record.isLate && (
                              <span className="ml-1 text-[9px] bg-amber-100 text-amber-800 px-1 py-0.5 rounded font-black">
                                LATE ({record.lateMinutes}m)
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-medium">
                            {record.checkOutTime ? format(new Date(record.checkOutTime), "hh:mm a") : "—"}
                          </td>
                          <td className="p-3 font-bold text-foreground">
                            {record.checkInTime && record.checkOutTime ? `${hours}h ${minutes}m` : "—"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                                record.status === "PRESENT"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : record.status === "ABSENT"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit Attendance"
                            >
                              <Edit size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalItems > itemsPerPage && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={page}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setPage}
                  itemName="attendance records"
                />
              </div>
            )}
          </div>
        </div>
      ) : canViewAudit && activeTab === "fines" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Staff Fines &amp; Penalties Management</h2>
              <p className="text-muted-foreground">Track late coming fines, absence penalties, and admin waivers.</p>
            </div>
            <button
              onClick={() => setIsIssueFineOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Issue Staff Fine
            </button>
          </div>

          {/* Filter Toolbar for Fines */}
          <div className="flex flex-wrap items-center gap-4 bg-card border border-border p-3.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-muted-foreground shrink-0" />
              <span className="text-xs font-bold text-muted-foreground">Staff Member:</span>
              <select
                value={filters.agentId}
                onChange={(e) => setFilters((prev) => ({ ...prev, agentId: e.target.value }))}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Agents &amp; Staff</option>
                {agents?.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-muted-foreground shrink-0" />
              <span className="text-xs font-bold text-muted-foreground">From:</span>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs font-bold text-muted-foreground">To:</span>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {(filters.agentId !== "all" || filters.fromDate !== "" || filters.toDate !== "") && (
              <button
                onClick={() => setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" })}
                className="px-3 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card border border-border p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Fines Issued</p>
              <p className="text-2xl font-black text-foreground">
                {formatMultiCurrencySummary(allFines)}
              </p>
            </div>
            <div className="bg-card border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Pending</p>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {formatMultiCurrencySummary(allFines, "PENDING")}
              </p>
            </div>
            <div className="bg-card border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Deducted</p>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatMultiCurrencySummary(allFines, "DEDUCTED")}
              </p>
            </div>
            <div className="bg-card border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Waived</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatMultiCurrencySummary(allFines, "WAIVED")}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Violation Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingAllFines ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading staff fines...
                      </td>
                    </tr>
                  ) : allFines.length > 0 ? (
                    allFines.map((fine: any) => (
                      <tr key={fine.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {fine.agent?.name || "N/A"}
                          <p className="text-[10px] text-muted-foreground font-normal">{fine.agent?.email}</p>
                        </td>
                        <td className="p-3 font-semibold">{format(new Date(fine.date), "dd MMM yyyy")}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase border ${
                              fine.fineType === "LATE_ARRIVAL"
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                                : fine.fineType === "ABSENCE"
                                ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                                : "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {fine.fineType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 font-black text-rose-600 dark:text-rose-400 text-sm">
                          {formatFineAmount(fine.amount, fine.currency)}
                        </td>
                        <td className="p-3 text-muted-foreground font-medium max-w-[200px] truncate">{fine.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                              fine.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : fine.status === "DEDUCTED"
                                ? "bg-slate-200 text-slate-900"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {fine.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {fine.status !== "WAIVED" ? (
                            <button
                              onClick={() => {
                                setSelectedFineForWaiver(fine);
                                setIsWaiveFineOpen(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 rounded text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Waive Fine
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold">Waived</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No fines recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {allFinesTotal > itemsPerPage && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={finePage}
                  totalItems={allFinesTotal}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setFinePage}
                  itemName="fines records"
                />
              </div>
            )}
          </div>
        </div>
      ) : canViewAudit && activeTab === "bonuses" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Gift className="text-emerald-500 w-6 h-6" /> Staff Bonuses &amp; Rewards Console
              </h2>
              <p className="text-xs text-muted-foreground">
                Award performance and punctuality rewards to agents with real-time multi-currency support and SMTP email dispatches.
              </p>
            </div>
            <button
              onClick={() => setIsIssueBonusOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus size={14} /> Award Staff Bonus
            </button>
          </div>

          {/* Filter Toolbar for Bonuses */}
          <div className="flex flex-wrap items-center gap-4 bg-card border border-border p-3.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-muted-foreground shrink-0" />
              <span className="text-xs font-bold text-muted-foreground">Staff Member:</span>
              <select
                value={filters.agentId}
                onChange={(e) => setFilters((prev) => ({ ...prev, agentId: e.target.value }))}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Agents &amp; Staff</option>
                {agents?.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-muted-foreground shrink-0" />
              <span className="text-xs font-bold text-muted-foreground">From:</span>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs font-bold text-muted-foreground">To:</span>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {(filters.agentId !== "all" || filters.fromDate !== "" || filters.toDate !== "") && (
              <button
                onClick={() => setFilters({ agentId: "all", fromDate: "", toDate: "", status: "all" })}
                className="px-3 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Bonus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Pending Bonuses</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatMultiCurrencySummary(allBonuses, "PENDING")}
              </p>
            </div>
            <div className="bg-card border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Paid Bonuses</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {formatMultiCurrencySummary(allBonuses, "PAID")}
              </p>
            </div>
            <div className="bg-card border border-purple-200 dark:border-purple-900/50 p-4 rounded-xl space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Total Awarded</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {formatMultiCurrencySummary(allBonuses)}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Bonus Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingAllBonuses ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                        Loading staff bonuses...
                      </td>
                    </tr>
                  ) : allBonuses.length > 0 ? (
                    allBonuses.map((bonus: any) => (
                      <tr key={bonus.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {bonus.agent?.name || "N/A"}
                          <p className="text-[10px] text-muted-foreground font-normal">{bonus.agent?.email}</p>
                        </td>
                        <td className="p-3 font-semibold">{format(new Date(bonus.date), "dd MMM yyyy")}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {bonus.bonusType.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatFineAmount(bonus.amount, bonus.currency)}
                        </td>
                        <td className="p-3 text-muted-foreground font-medium max-w-[200px] truncate">{bonus.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                              bonus.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {bonus.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No staff bonuses awarded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {allBonusesTotal > itemsPerPage && (
              <div className="p-4 border-t border-border bg-card">
                <Pagination
                  currentPage={bonusPage}
                  totalItems={allBonusesTotal}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setBonusPage}
                  itemName="bonuses records"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        renderLogAttendance()
      )}

      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        record={selectedRecord}
      />

      <IssueFineModal
        isOpen={isIssueFineOpen}
        onClose={() => setIsIssueFineOpen(false)}
        agents={agents || []}
      />

      <WaiveFineModal
        isOpen={isWaiveFineOpen}
        onClose={() => setIsWaiveFineOpen(false)}
        fine={selectedFineForWaiver}
      />

      <IssueBonusModal
        isOpen={isIssueBonusOpen}
        onClose={() => setIsIssueBonusOpen(false)}
        agents={agents || []}
      />
    </div>
  );
}
