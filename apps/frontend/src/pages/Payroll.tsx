import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import {
  Receipt,
  Plus,
  Search,
  Loader2,
  Mail,
  Printer,
  Edit3,
  Trash2,
  Send,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileText,
  User,
  Building,
  Calendar,
  CreditCard,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// Helper to convert numbers to English words for European style payslips
function numberToWords(num: number): string {
  const n = Math.round(num);
  if (n === 0) return "Zero";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function inWords(val: number): string {
    if (val < 20) return a[val];
    if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? " " + a[val % 10] : "");
    if (val < 1000)
      return (
        a[Math.floor(val / 100)] +
        " Hundred" +
        (val % 100 !== 0 ? " " + inWords(val % 100) : "")
      );
    if (val < 1000000)
      return (
        inWords(Math.floor(val / 1000)) +
        " Thousand" +
        (val % 1000 !== 0 ? " " + inWords(val % 1000) : "")
      );
    if (val < 1000000000)
      return (
        inWords(Math.floor(val / 1000000)) +
        " Million" +
        (val % 1000000 !== 0 ? " " + inWords(val % 1000000) : "")
      );
    return val.toString();
  }

  return inWords(n) + " Only";
}

export interface PayslipItem {
  id: string;
  payslipNumber: string;
  agentId?: string | null;
  userId?: string | null;
  employeeName: string;
  designation?: string | null;
  department?: string | null;
  passportNumber?: string | null;
  employeeEmail?: string | null;
  payrollEmail?: string | null;
  companyName: string;
  companyAddress: string;
  monthYear: string;
  payDate: string;
  paymentMethod: string;
  currency: string;
  currencySymbol: string;
  basicSalary: number;
  houseRentAllowance: number;
  travelAllowance: number;
  otherAllowances: number;
  earningsJson?: Array<{ label: string; amount: number }>;
  taxDeduction: number;
  fineDeduction: number;
  otherDeductions: number;
  deductionsJson?: Array<{ label: string; amount: number }>;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  sentToEmail?: string | null;
  sentAt?: string | null;
  notes?: string | null;
  createdAt: string;
  agent?: {
    id: string;
    name: string;
    email: string;
    payrollEmail?: string | null;
    phoneNumber: string;
  };
}

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const printRef = useRef<HTMLDivElement>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activePayslip, setActivePayslip] = useState<PayslipItem | null>(null);

  // Create / Edit Form States
  const [formData, setFormData] = useState({
    agentId: "",
    employeeName: "Ali Zain",
    designation: "Operations Manager",
    department: "Operations",
    passportNumber: "AP5906793",
    employeeEmail: "",
    payrollEmail: "",
    monthYear: "June 2026",
    payDate: "2026-07-01",
    paymentMethod: "Bank Transfer",
    currency: "PKR",
    currencySymbol: "Rs.",
    basicSalary: 150000,
    houseRentAllowance: 65000,
    travelAllowance: 35000,
    otherAllowances: 0,
    earningsJson: [] as Array<{ label: string; amount: number }>,
    taxDeduction: 12500,
    fineDeduction: 0,
    otherDeductions: 0,
    deductionsJson: [] as Array<{ label: string; amount: number }>,
    notes: "",
    sendImmediately: false,
  });

  // Target email override for email dispatch modal
  const [emailTarget, setEmailTarget] = useState("");

  // Fetch agents for selection
  const { data: agentsData } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items as Array<{
        id: string;
        name: string;
        email: string;
        payrollEmail?: string | null;
        phoneNumber: string;
      }>;
    },
  });

  // Fetch payslips
  const { data: payrollData, isLoading } = useQuery({
    queryKey: [
      "payroll",
      searchTerm,
      selectedMonth,
      selectedAgentFilter,
      selectedStatusFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedMonth !== "all") params.append("monthYear", selectedMonth);
      if (selectedAgentFilter !== "all") params.append("agentId", selectedAgentFilter);
      if (selectedStatusFilter !== "all") params.append("status", selectedStatusFilter);
      const res = await apiClient.get(`/payroll?${params.toString()}`);
      return res.data.data;
    },
  });

  // ----------------------------------------------------
  // Mutations
  // ----------------------------------------------------
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiClient.post("/payroll", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Salary slip generated successfully!");
      setIsCreateModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to generate salary slip");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiClient.put(`/payroll/${id}`, data);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Salary slip updated successfully!");
      if (res.data?.data) {
        setActivePayslip(res.data.data);
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update salary slip");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/payroll/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Salary slip deleted successfully");
      setIsDeleteModalOpen(false);
      setIsViewerModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete salary slip");
    },
  });

  const sendEmailMutation = useMutation({
    mutationFn: async ({ id, overrideEmail }: { id: string; overrideEmail?: string }) => {
      return apiClient.post(`/payroll/${id}/send-email`, { overrideEmail });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success(res.data?.message || "Salary slip email sent via SMTP successfully!");
      setIsEmailModalOpen(false);
      if (activePayslip) {
        setActivePayslip({ ...activePayslip, status: "Sent", sentAt: new Date().toISOString() });
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to dispatch email via SMTP");
    },
  });

  // Calculate live totals for the Form
  const calcFormEarnings =
    Number(formData.basicSalary || 0) +
    Number(formData.houseRentAllowance || 0) +
    Number(formData.travelAllowance || 0) +
    Number(formData.otherAllowances || 0) +
    formData.earningsJson.reduce((s, i) => s + Number(i.amount || 0), 0);

  const calcFormDeductions =
    Number(formData.taxDeduction || 0) +
    Number(formData.fineDeduction || 0) +
    Number(formData.otherDeductions || 0) +
    formData.deductionsJson.reduce((s, i) => s + Number(i.amount || 0), 0);

  const calcFormNet = Math.max(0, calcFormEarnings - calcFormDeductions);

  // Handle agent selection in form
  const handleAgentSelect = (agentId: string) => {
    const ag = agentsData?.find((a) => a.id === agentId);
    if (ag) {
      setFormData((prev) => ({
        ...prev,
        agentId: ag.id,
        employeeName: ag.name,
        employeeEmail: ag.email,
        payrollEmail: ag.payrollEmail || ag.email,
        designation: "Operations Manager",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        agentId: "",
      }));
    }
  };

  // Open Viewer Modal
  const handleOpenViewer = (slip: PayslipItem) => {
    setActivePayslip(slip);
    setIsViewerModalOpen(true);
  };

  // Open Email Dispatch Modal
  const handleOpenEmailModal = (slip: PayslipItem) => {
    setActivePayslip(slip);
    const defaultEmail =
      slip.payrollEmail ||
      slip.agent?.payrollEmail ||
      slip.employeeEmail ||
      slip.agent?.email ||
      "";
    setEmailTarget(defaultEmail);
    setIsEmailModalOpen(true);
  };

  // Print Payslip
  const handlePrint = () => {
    window.print();
  };

  const payslipsList: PayslipItem[] = payrollData?.items || [];
  const summary = payrollData?.summary || {
    totalNetDisbursed: 0,
    totalGross: 0,
    totalDeductions: 0,
    totalSlips: 0,
    sentCount: 0,
    draftCount: 0,
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Receipt size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                Payroll & Salary Slips
              </h1>
              <p className="text-xs text-muted-foreground">
                Generate, edit in real-time, print, and dispatch European-standard payslips via SMTP
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                agentId: "",
                employeeName: "Ali Zain",
                designation: "Operations Manager",
                department: "Operations",
                passportNumber: "AP5906793",
                employeeEmail: "",
                payrollEmail: "",
                monthYear: "June 2026",
                payDate: "2026-07-01",
                paymentMethod: "Bank Transfer",
                currency: "PKR",
                currencySymbol: "Rs.",
                basicSalary: 150000,
                houseRentAllowance: 65000,
                travelAllowance: 35000,
                otherAllowances: 0,
                earningsJson: [],
                taxDeduction: 12500,
                fineDeduction: 0,
                otherDeductions: 0,
                deductionsJson: [],
                notes: "Standard monthly salary disbursement.",
                sendImmediately: false,
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Generate Salary Slip</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Net Disbursed
            </p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              Rs. {Number(summary.totalNetDisbursed || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp size={10} /> Active Payroll Cycle
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Gross Earnings
            </p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              Rs. {Number(summary.totalGross || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Before Taxes & Deductions
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Deductions
            </p>
            <h3 className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-1">
              Rs. {Number(summary.totalDeductions || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Tax & Penalties Retained
            </p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Dispatched Slips
            </p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              {summary.sentCount} <span className="text-xs font-normal text-muted-foreground">/ {summary.totalSlips} total</span>
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {summary.draftCount} Drafts remaining
            </p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Send size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, slip #, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/30 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-secondary/30 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            >
              <option value="all">All Months</option>
              <option value="June 2026">June 2026</option>
              <option value="May 2026">May 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="March 2026">March 2026</option>
            </select>

            {/* Agent Filter */}
            <select
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="px-3 py-2 bg-secondary/30 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            >
              <option value="all">All Staff & Agents</option>
              {agentsData?.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-secondary/30 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent via Email</option>
              <option value="Paid">Paid</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedMonth("all");
                setSelectedAgentFilter("all");
                setSelectedStatusFilter("all");
              }}
              title="Reset Filters"
              className="p-2 border border-border/60 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Salary Slips Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Slip #</th>
                <th className="py-3 px-4">Employee / Agent</th>
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Take-Home</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-primary" />
                      <span>Loading payroll records...</span>
                    </div>
                  </td>
                </tr>
              ) : payslipsList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Receipt size={32} className="text-muted-foreground/40" />
                      <p className="font-semibold text-sm">No salary slips found</p>
                      <p className="text-xs text-muted-foreground/80">
                        Click "Generate Salary Slip" to create your first European-standard payslip.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payslipsList.map((slip) => (
                  <tr key={slip.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {slip.payslipNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-foreground block">
                          {slip.employeeName}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {slip.designation || "Operations Manager"}
                        </span>
                        {(slip.payrollEmail || slip.agent?.payrollEmail) && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary/80 font-medium mt-0.5 block">
                            <Mail size={10} /> {slip.payrollEmail || slip.agent?.payrollEmail}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {slip.monthYear}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground/90">
                      {slip.currencySymbol} {Number(slip.totalEarnings || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600 dark:text-red-400">
                      {slip.totalDeductions > 0 ? (
                        <>
                          -{slip.currencySymbol} {Number(slip.totalDeductions || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </>
                      ) : (
                        <span className="text-muted-foreground font-normal">Rs. 0.00</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {slip.currencySymbol} {Number(slip.netSalary || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          slip.status === "Sent"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                            : slip.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {slip.status === "Sent" ? <CheckCircle2 size={10} /> : <FileText size={10} />}
                        {slip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenViewer(slip)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                          title="View & Edit Live Payslip"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEmailModal(slip)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                          title="Send Salary Slip via SMTP"
                        >
                          <Send size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setActivePayslip(slip);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Salary Slip"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: GENERATE NEW SALARY SLIP                       */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Generate European Standard Payslip"
          maxWidth="2xl"
        >
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
            {/* Select Agent Auto-Fill */}
            <div className="bg-secondary/20 p-3.5 rounded-xl border border-border/60">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Select Registered Agent (Auto-fills Profile & Payroll Email)
              </label>
              <select
                value={formData.agentId}
                onChange={(e) => handleAgentSelect(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-xs focus:ring-2 focus:ring-primary/40"
              >
                <option value="">-- Or enter custom employee details below --</option>
                {agentsData?.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.payrollEmail || ag.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Basic Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Passport / CNIC No
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Payroll / Target Email
                </label>
                <input
                  type="email"
                  placeholder="payroll@example.com"
                  value={formData.payrollEmail}
                  onChange={(e) => setFormData({ ...formData, payrollEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Month & Year *
                </label>
                <input
                  type="text"
                  value={formData.monthYear}
                  onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                  placeholder="e.g. June 2026"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={formData.payDate}
                  onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                  placeholder="Rs. or £"
                />
              </div>
            </div>

            {/* Earnings & Deductions Dual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Earnings Panel */}
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Earnings (Gross)
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formData.currencySymbol} {calcFormEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Basic Salary</label>
                  <input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">House Rent Allowance (HRA)</label>
                  <input
                    type="number"
                    value={formData.houseRentAllowance}
                    onChange={(e) => setFormData({ ...formData, houseRentAllowance: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Travel / Commute Allowance</label>
                  <input
                    type="number"
                    value={formData.travelAllowance}
                    onChange={(e) => setFormData({ ...formData, travelAllowance: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Other Allowances / Bonus</label>
                  <input
                    type="number"
                    value={formData.otherAllowances}
                    onChange={(e) => setFormData({ ...formData, otherAllowances: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>
              </div>

              {/* Deductions Panel */}
              <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-1.5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Deductions
                  </h4>
                  <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                    {formData.currencySymbol} {calcFormDeductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Income Tax</label>
                  <input
                    type="number"
                    value={formData.taxDeduction}
                    onChange={(e) => setFormData({ ...formData, taxDeduction: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Fines & Penalties</label>
                  <input
                    type="number"
                    value={formData.fineDeduction}
                    onChange={(e) => setFormData({ ...formData, fineDeduction: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Other Deductions</label>
                  <input
                    type="number"
                    value={formData.otherDeductions}
                    onChange={(e) => setFormData({ ...formData, otherDeductions: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Net Salary Preview Banner */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white flex items-center justify-between shadow-md">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                  Calculated Net Take-Home Pay
                </p>
                <h3 className="text-2xl font-black font-mono">
                  {formData.currencySymbol} {calcFormNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[11px] text-white/90 italic mt-0.5">
                  {numberToWords(calcFormNet)}
                </p>
              </div>
              <Sparkles size={32} className="text-white/30" />
            </div>

            {/* Send immediately checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sendImmediately"
                checked={formData.sendImmediately}
                onChange={(e) => setFormData({ ...formData, sendImmediately: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="sendImmediately" className="text-xs font-medium text-foreground cursor-pointer">
                Send salary slip directly via SMTP to employee/payroll email upon generation
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-border/60 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending}
                className="px-5 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Receipt size={14} />
                    <span>Create & Finalize Payslip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: INTERACTIVE EUROPEAN STANDARD PAYSLIP VIEWER    */}
      {/* ======================================================== */}
      {isViewerModalOpen && activePayslip && (
        <Modal
          isOpen={isViewerModalOpen}
          onClose={() => setIsViewerModalOpen(false)}
          title={`Salary Slip: ${activePayslip.payslipNumber}`}
          maxWidth="4xl"
        >
          <div className="space-y-5">
            {/* Top Interactive Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/20 p-3 rounded-xl border border-border/60 print:hidden">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    activePayslip.status === "Sent"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  {activePayslip.status}
                </span>
                {activePayslip.sentAt && (
                  <span className="text-[11px] text-muted-foreground">
                    Sent on {new Date(activePayslip.sentAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-lg border border-border/60 transition-colors"
                >
                  <Printer size={13} />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={() => handleOpenEmailModal(activePayslip)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <Send size={13} />
                  <span>Send via SMTP</span>
                </button>

                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: activePayslip.id,
                      data: activePayslip,
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Printable European Payslip Document */}
            <div
              ref={printRef}
              id="printable-payslip"
              className="bg-white text-slate-900 border border-slate-200 rounded-xl overflow-hidden shadow-md p-6 md:p-8 font-sans"
            >
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    TERRIFIC TRAVEL (PVT) LTD
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Phone: +92 51 1234567 | Email: info@terrifictravel.co.uk
                  </p>
                </div>
                <div className="text-left md:text-right bg-slate-50 border border-slate-200 p-3 rounded-lg min-w-[200px]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    PAYSLIP / SALARY SLIP
                  </div>
                  <div className="text-base font-black font-mono text-slate-900">
                    {activePayslip.payslipNumber}
                  </div>
                  <div className="text-xs font-bold text-orange-600">
                    Period: {activePayslip.monthYear}
                  </div>
                </div>
              </div>

              {/* Employee Meta Grid (Live Editable) */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Employee Name
                  </span>
                  <input
                    type="text"
                    value={activePayslip.employeeName}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, employeeName: e.target.value })
                    }
                    className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Designation
                  </span>
                  <input
                    type="text"
                    value={activePayslip.designation || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, designation: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Passport / CNIC No
                  </span>
                  <input
                    type="text"
                    value={activePayslip.passportNumber || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, passportNumber: e.target.value })
                    }
                    className="font-mono text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Department
                  </span>
                  <input
                    type="text"
                    value={activePayslip.department || "Operations"}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, department: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Payment Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(activePayslip.payDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Payment Method
                  </span>
                  <span className="font-semibold text-slate-800">
                    {activePayslip.paymentMethod}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Payroll Email
                  </span>
                  <span className="font-mono text-[11px] text-slate-700">
                    {activePayslip.payrollEmail || activePayslip.employeeEmail || "N/A"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Currency
                  </span>
                  <span className="font-bold text-slate-800">
                    {activePayslip.currency} ({activePayslip.currencySymbol})
                  </span>
                </div>
              </div>

              {/* European Dual-Column Breakdown Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Column 1: Earnings */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-emerald-700 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                    <span>EARNINGS</span>
                    <span>AMOUNT</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Basic Salary</span>
                      <input
                        type="number"
                        value={activePayslip.basicSalary}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            val +
                            activePayslip.houseRentAllowance +
                            activePayslip.travelAllowance +
                            activePayslip.otherAllowances;
                          setActivePayslip({
                            ...activePayslip,
                            basicSalary: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">House Rent Allowance (HRA)</span>
                      <input
                        type="number"
                        value={activePayslip.houseRentAllowance}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            activePayslip.basicSalary +
                            val +
                            activePayslip.travelAllowance +
                            activePayslip.otherAllowances;
                          setActivePayslip({
                            ...activePayslip,
                            houseRentAllowance: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Travel / Commute Allowance</span>
                      <input
                        type="number"
                        value={activePayslip.travelAllowance}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            activePayslip.basicSalary +
                            activePayslip.houseRentAllowance +
                            val +
                            activePayslip.otherAllowances;
                          setActivePayslip({
                            ...activePayslip,
                            travelAllowance: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {activePayslip.otherAllowances > 0 && (
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Other Allowances</span>
                        <input
                          type="number"
                          value={activePayslip.otherAllowances}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const total =
                              activePayslip.basicSalary +
                              activePayslip.houseRentAllowance +
                              activePayslip.travelAllowance +
                              val;
                            setActivePayslip({
                              ...activePayslip,
                              otherAllowances: val,
                              totalEarnings: total,
                              netSalary: Math.max(0, total - activePayslip.totalDeductions),
                            });
                          }}
                          className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-900">TOTAL GROSS EARNINGS</span>
                    <span className="font-mono text-emerald-700 text-sm">
                      {activePayslip.currencySymbol} {Number(activePayslip.totalEarnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Column 2: Deductions */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-red-700 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                    <span>DEDUCTIONS</span>
                    <span>AMOUNT</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Income Tax (PAYE)</span>
                      <input
                        type="number"
                        value={activePayslip.taxDeduction}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            val +
                            activePayslip.fineDeduction +
                            activePayslip.otherDeductions;
                          setActivePayslip({
                            ...activePayslip,
                            taxDeduction: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-600 border-b border-slate-200 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Fines & Penalties</span>
                      <input
                        type="number"
                        value={activePayslip.fineDeduction}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            activePayslip.taxDeduction +
                            val +
                            activePayslip.otherDeductions;
                          setActivePayslip({
                            ...activePayslip,
                            fineDeduction: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-600 border-b border-slate-200 focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Other Deductions</span>
                      <input
                        type="number"
                        value={activePayslip.otherDeductions}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const total =
                            activePayslip.taxDeduction +
                            activePayslip.fineDeduction +
                            val;
                          setActivePayslip({
                            ...activePayslip,
                            otherDeductions: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-600 border-b border-slate-200 focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-900">TOTAL DEDUCTIONS</span>
                    <span className="font-mono text-red-700 text-sm">
                      {activePayslip.currencySymbol} {Number(activePayslip.totalDeductions).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* European Standard Net Pay Banner */}
              <div className="bg-slate-900 text-white rounded-lg p-5 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 block">
                    NET TAKE-HOME PAYABLE AMOUNT
                  </span>
                  <div className="text-xs text-slate-300 italic mt-0.5">
                    {numberToWords(activePayslip.netSalary)}
                  </div>
                </div>
                <div className="text-3xl font-black font-mono text-white tracking-tight">
                  {activePayslip.currencySymbol} {Number(activePayslip.netSalary).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Remarks & Sign-off */}
              <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-end gap-6 text-xs">
                <div className="max-w-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Remarks / Instructions
                  </span>
                  <p className="text-slate-600">
                    {activePayslip.notes || "Standard monthly salary disbursement. This is a computer-generated payslip and requires no physical signature."}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-44 border-b border-slate-400 mb-1 pb-4 text-center font-serif text-slate-400 italic">
                    Authorized Signatory
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Terrific Travel HR Dept.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: SMTP EMAIL DISPATCH CONFIRMATION                */}
      {/* ======================================================== */}
      {isEmailModalOpen && activePayslip && (
        <Modal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          title="Send Salary Slip via SMTP"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-xl flex items-start gap-3">
              <Mail size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-foreground">
                  Dispatch Salary Slip directly to Employee
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Sends an European formatted salary slip email using your configured SMTP server.
                </p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Recipient Email Address *
              </label>
              <input
                type="email"
                value={emailTarget}
                onChange={(e) => setEmailTarget(e.target.value)}
                placeholder="agent@terrifictravel.co.uk"
                className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs focus:ring-2 focus:ring-primary/40 text-foreground"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Defaults to the Agent's Payroll Email configured in the CRM.
              </p>
            </div>

            <div className="bg-secondary/20 p-3 rounded-lg text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee:</span>
                <span className="font-bold text-foreground">{activePayslip.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-semibold text-foreground">{activePayslip.monthYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Pay:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {activePayslip.currencySymbol} {Number(activePayslip.netSalary).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 border border-border/60 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-secondary/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  sendEmailMutation.mutate({
                    id: activePayslip.id,
                    overrideEmail: emailTarget,
                  })
                }
                disabled={sendEmailMutation.isPending || !emailTarget}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Dispatching Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Dispatch Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && activePayslip && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => deleteMutation.mutate(activePayslip.id)}
          title="Delete Salary Slip"
          message={`Are you sure you want to delete salary slip ${activePayslip.payslipNumber} for ${activePayslip.employeeName}? This action cannot be undone.`}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
