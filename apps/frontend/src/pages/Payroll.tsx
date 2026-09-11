import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import html2pdf from "html2pdf.js";
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
  Download,
  Filter,
  RefreshCw,
  PlusCircle,
  MinusCircle,
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

export interface CustomLineItem {
  label: string;
  amount: number;
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
  earningsJson?: CustomLineItem[];
  taxDeduction: number;
  fineDeduction: number;
  otherDeductions: number;
  deductionsJson?: CustomLineItem[];
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
  const [isExportingPdf, setIsExportingPdf] = useState(false);
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
    companyName: "Terrific Travel (Private) Limited",
    companyAddress: "Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan",
    monthYear: "June 2026",
    payDate: "2026-07-01",
    paymentMethod: "Bank Transfer",
    currency: "PKR",
    currencySymbol: "Rs.",
    basicSalary: 150000,
    houseRentAllowance: 65000,
    travelAllowance: 35000,
    otherAllowances: 0,
    earningsJson: [] as CustomLineItem[],
    taxDeduction: 12500,
    fineDeduction: 0,
    otherDeductions: 0,
    deductionsJson: [] as CustomLineItem[],
    notes: "Standard monthly salary disbursement. This is a computer-generated payslip and requires no physical signature.",
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
    mutationFn: async ({
      id,
      overrideEmail,
      pdfBase64,
    }: {
      id: string;
      overrideEmail?: string;
      pdfBase64?: string;
    }) => {
      return apiClient.post(`/payroll/${id}/send-email`, { overrideEmail, pdfBase64 });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success(res.data?.message || "Salary slip email with PDF sent via SMTP successfully!");
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
    setActivePayslip({
      ...slip,
      earningsJson: Array.isArray(slip.earningsJson) ? slip.earningsJson : [],
      deductionsJson: Array.isArray(slip.deductionsJson) ? slip.deductionsJson : [],
    });
    setIsViewerModalOpen(true);
  };

  // Open Email Dispatch Modal
  const handleOpenEmailModal = (slip: PayslipItem) => {
    setActivePayslip({
      ...slip,
      earningsJson: Array.isArray(slip.earningsJson) ? slip.earningsJson : [],
      deductionsJson: Array.isArray(slip.deductionsJson) ? slip.deductionsJson : [],
    });
    const defaultEmail =
      slip.payrollEmail ||
      slip.agent?.payrollEmail ||
      slip.employeeEmail ||
      slip.agent?.email ||
      "";
    setEmailTarget(defaultEmail);
    setIsEmailModalOpen(true);
  };

  // Export / Download PDF using html2pdf.js
  const handleDownloadPdf = async () => {
    if (!printRef.current || !activePayslip) return;
    try {
      setIsExportingPdf(true);
      const opt = {
        margin: 8,
        filename: `Salary-Slip-${activePayslip.payslipNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      };
      await html2pdf().set(opt).from(printRef.current).save();
      toast.success(`Downloaded Salary-Slip-${activePayslip.payslipNumber}.pdf`);
    } catch (err) {
      toast.error("Failed to generate PDF download");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Generate PDF Base64 string for email attachment
  const generatePdfBase64 = async (): Promise<string | null> => {
    if (!printRef.current) return null;
    try {
      const opt = {
        margin: 8,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      };
      const pdfDataUri = await html2pdf().set(opt).from(printRef.current).outputPdf("datauristring");
      return pdfDataUri;
    } catch (e) {
      console.error("Failed to generate PDF base64:", e);
      return null;
    }
  };

  // Send via SMTP handler
  const handleSendViaSmtp = async () => {
    if (!activePayslip || !emailTarget) return;
    let pdfBase64: string | null = null;
    if (printRef.current) {
      pdfBase64 = await generatePdfBase64();
    }
    sendEmailMutation.mutate({
      id: activePayslip.id,
      overrideEmail: emailTarget,
      pdfBase64: pdfBase64 || undefined,
    });
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
            <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
              <Receipt size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                Payroll & Salary Slips
              </h1>
              <p className="text-xs text-muted-foreground">
                Corporate European-standard payroll management, live PDF export, and direct SMTP delivery
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
                companyName: "Terrific Travel (Private) Limited",
                companyAddress: "Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan",
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
                notes: "Standard monthly salary disbursement. This is a computer-generated payslip and requires no physical signature.",
                sendImmediately: false,
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
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
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp size={10} /> Processed Disbursements
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
          <div className="p-3 bg-slate-900 text-white rounded-xl">
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
              placeholder="Search by employee name, slip #, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-secondary/30 border border-border/60 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
                        Click "Generate Salary Slip" to create a new salary slip.
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
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5 block font-mono">
                            <Mail size={10} /> {slip.payrollEmail || slip.agent?.payrollEmail}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {slip.monthYear}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground/90 font-mono">
                      {slip.currencySymbol} {Number(slip.totalEarnings || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600 dark:text-red-400 font-mono">
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
                            : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
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
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="View & Edit Live Payslip"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            handleOpenViewer(slip);
                            setTimeout(() => {
                              handleDownloadPdf();
                            }, 300);
                          }}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          title="Quick Export PDF"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEmailModal(slip)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
                          title="Send via SMTP Email (with PDF)"
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

            {/* Company & Office Location Details (Fully Editable) */}
            <div className="bg-secondary/15 p-3.5 rounded-xl border border-border/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Employer / Office Information (Editable)
                </label>
                <span className="text-[10px] text-muted-foreground italic">Customizable per payslip</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Company / Employer Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-xs font-semibold"
                    placeholder="Terrific Travel (Private) Limited"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Office / Branch Address
                  </label>
                  <input
                    type="text"
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-xs"
                    placeholder="Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan"
                  />
                </div>
              </div>
            </div>

            {/* Employee Basic Details & Payday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs font-semibold"
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
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs"
                  placeholder="e.g. Operations / Sales"
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
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs font-mono"
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
                  Month & Year (Pay Period) *
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
                  Pay Day / Payment Date *
                </label>
                <input
                  type="date"
                  value={formData.payDate}
                  onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs font-semibold"
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
                  className="w-full px-3 py-2 bg-secondary/20 border border-border/60 rounded-lg text-xs font-mono"
                  placeholder="Rs. or £"
                />
              </div>
            </div>

            {/* Earnings & Deductions Dual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Earnings Panel */}
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Gross Earnings
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
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
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Other Allowances</label>
                  <input
                    type="number"
                    value={formData.otherAllowances}
                    onChange={(e) => setFormData({ ...formData, otherAllowances: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-md text-xs font-mono"
                  />
                </div>

                {/* Custom Earnings List */}
                {formData.earningsJson.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Performance Bonus"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...formData.earningsJson];
                        next[idx].label = e.target.value;
                        setFormData({ ...formData, earningsJson: next });
                      }}
                      className="w-1/2 px-2 py-1 bg-background border border-border/60 rounded text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => {
                        const next = [...formData.earningsJson];
                        next[idx].amount = Number(e.target.value);
                        setFormData({ ...formData, earningsJson: next });
                      }}
                      className="w-1/2 px-2 py-1 bg-background border border-border/60 rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          earningsJson: formData.earningsJson.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <MinusCircle size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      earningsJson: [...formData.earningsJson, { label: "Custom Allowance", amount: 0 }],
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:underline pt-1"
                >
                  <PlusCircle size={12} /> Add Custom Earning
                </button>
              </div>

              {/* Deductions Panel */}
              <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-1.5">
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    Deductions
                  </h4>
                  <span className="text-xs font-mono font-bold text-red-700 dark:text-red-400">
                    {formData.currencySymbol} {calcFormDeductions.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Income Tax (PAYE)</label>
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

                {/* Custom Deductions List */}
                {formData.deductionsJson.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Health Insurance"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...formData.deductionsJson];
                        next[idx].label = e.target.value;
                        setFormData({ ...formData, deductionsJson: next });
                      }}
                      className="w-1/2 px-2 py-1 bg-background border border-border/60 rounded text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => {
                        const next = [...formData.deductionsJson];
                        next[idx].amount = Number(e.target.value);
                        setFormData({ ...formData, deductionsJson: next });
                      }}
                      className="w-1/2 px-2 py-1 bg-background border border-border/60 rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          deductionsJson: formData.deductionsJson.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <MinusCircle size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      deductionsJson: [...formData.deductionsJson, { label: "Custom Deduction", amount: 0 }],
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] text-red-700 dark:text-red-400 font-semibold hover:underline pt-1"
                >
                  <PlusCircle size={12} /> Add Custom Deduction
                </button>
              </div>
            </div>

            {/* Net Salary Preview Banner */}
            <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between shadow-md border-l-4 border-orange-500">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Calculated Net Take-Home Pay
                </p>
                <h3 className="text-2xl font-black font-mono mt-0.5">
                  {formData.currencySymbol} {calcFormNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[11px] text-orange-400 italic mt-0.5">
                  {numberToWords(calcFormNet)}
                </p>
              </div>
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
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
                      : "bg-slate-500/10 text-slate-700 border-slate-500/20"
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
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isExportingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                  <span>Export PDF</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-lg border border-border/60 transition-colors"
                >
                  <Printer size={13} />
                  <span>Print</span>
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
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all disabled:opacity-50"
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
              {/* Header with prominent Company Logo and Editable Company & Address */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 max-w-lg">
                  <img
                    src="/Logo.svg"
                    alt="Terrific Travel Logo"
                    className="h-12 w-auto max-w-[200px] object-contain block mb-2"
                  />
                  <input
                    type="text"
                    value={activePayslip.companyName || "Terrific Travel (Private) Limited"}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, companyName: e.target.value })
                    }
                    className="text-xl font-black tracking-tight text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={activePayslip.companyAddress || "Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan"}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, companyAddress: e.target.value })
                    }
                    className="text-xs text-slate-600 font-medium bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full mt-0.5"
                    placeholder="Office Address"
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Phone: +92 51 1234567 | Email: info@terrifictravel.co.uk
                  </p>
                </div>
                <div className="text-left md:text-right bg-slate-50 border border-slate-200 p-3 rounded-lg min-w-[200px]">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    SALARY SLIP / PAYSLIP
                  </div>
                  <div className="text-base font-black font-mono text-slate-900">
                    {activePayslip.payslipNumber}
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1 flex items-center md:justify-end gap-1">
                    <span>Pay Period:</span>
                    <input
                      type="text"
                      value={activePayslip.monthYear}
                      onChange={(e) =>
                        setActivePayslip({ ...activePayslip, monthYear: e.target.value })
                      }
                      className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none text-xs w-24 text-left md:text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Employee Meta Grid (Live Editable) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Employee Name
                  </span>
                  <input
                    type="text"
                    value={activePayslip.employeeName}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, employeeName: e.target.value })
                    }
                    className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Designation
                  </span>
                  <input
                    type="text"
                    value={activePayslip.designation || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, designation: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Passport / CNIC No
                  </span>
                  <input
                    type="text"
                    value={activePayslip.passportNumber || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, passportNumber: e.target.value })
                    }
                    className="font-mono text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Department
                  </span>
                  <input
                    type="text"
                    value={activePayslip.department || "Operations"}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, department: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pay Day / Payment Date
                  </span>
                  <input
                    type="date"
                    value={activePayslip.payDate ? activePayslip.payDate.split("T")[0] : ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, payDate: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Payment Method
                  </span>
                  <select
                    value={activePayslip.paymentMethod}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, paymentMethod: e.target.value })
                    }
                    className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none text-xs w-full"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Payroll Email
                  </span>
                  <input
                    type="email"
                    value={activePayslip.payrollEmail || activePayslip.employeeEmail || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, payrollEmail: e.target.value })
                    }
                    className="font-mono text-[11px] text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-full"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Currency Symbol
                  </span>
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <span>{activePayslip.currency}</span>
                    <input
                      type="text"
                      value={activePayslip.currencySymbol}
                      onChange={(e) =>
                        setActivePayslip({ ...activePayslip, currencySymbol: e.target.value })
                      }
                      className="font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none w-14 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* European Dual-Column Breakdown Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Column 1: Gross Earnings */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-emerald-800 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                    <span>Gross Earnings</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Basic Salary</span>
                      <input
                        type="number"
                        value={activePayslip.basicSalary}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.earningsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = val + activePayslip.houseRentAllowance + activePayslip.travelAllowance + activePayslip.otherAllowances + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            basicSalary: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">House Rent Allowance (HRA)</span>
                      <input
                        type="number"
                        value={activePayslip.houseRentAllowance}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.earningsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = activePayslip.basicSalary + val + activePayslip.travelAllowance + activePayslip.otherAllowances + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            houseRentAllowance: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-slate-800 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Travel / Commute Allowance</span>
                      <input
                        type="number"
                        value={activePayslip.travelAllowance}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.earningsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = activePayslip.basicSalary + activePayslip.houseRentAllowance + val + activePayslip.otherAllowances + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            travelAllowance: val,
                            totalEarnings: total,
                            netSalary: Math.max(0, total - activePayslip.totalDeductions),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-slate-800 focus:outline-none"
                      />
                    </div>

                    {activePayslip.otherAllowances > 0 && (
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-slate-700 font-medium">Other Allowances</span>
                        <input
                          type="number"
                          value={activePayslip.otherAllowances}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const customSum = (activePayslip.earningsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                            const total = activePayslip.basicSalary + activePayslip.houseRentAllowance + activePayslip.travelAllowance + val + customSum;
                            setActivePayslip({
                              ...activePayslip,
                              otherAllowances: val,
                              totalEarnings: total,
                              netSalary: Math.max(0, total - activePayslip.totalDeductions),
                            });
                          }}
                          className="w-28 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-slate-800 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Custom Earnings List in Viewer */}
                    {activePayslip.earningsJson?.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center bg-slate-50/50">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const next = [...(activePayslip.earningsJson || [])];
                            next[idx].label = e.target.value;
                            setActivePayslip({ ...activePayslip, earningsJson: next });
                          }}
                          className="text-slate-700 font-medium bg-transparent border-b border-slate-200 text-xs w-44"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const next = [...(activePayslip.earningsJson || [])];
                              next[idx].amount = Number(e.target.value);
                              const customSum = next.reduce((s, i) => s + Number(i.amount || 0), 0);
                              const total = activePayslip.basicSalary + activePayslip.houseRentAllowance + activePayslip.travelAllowance + activePayslip.otherAllowances + customSum;
                              setActivePayslip({
                                ...activePayslip,
                                earningsJson: next,
                                totalEarnings: total,
                                netSalary: Math.max(0, total - activePayslip.totalDeductions),
                              });
                            }}
                            className="w-24 text-right font-mono font-bold text-slate-900 border-b border-slate-200 focus:border-slate-800 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (activePayslip.earningsJson || []).filter((_, i) => i !== idx);
                              const customSum = next.reduce((s, i) => s + Number(i.amount || 0), 0);
                              const total = activePayslip.basicSalary + activePayslip.houseRentAllowance + activePayslip.travelAllowance + activePayslip.otherAllowances + customSum;
                              setActivePayslip({
                                ...activePayslip,
                                earningsJson: next,
                                totalEarnings: total,
                                netSalary: Math.max(0, total - activePayslip.totalDeductions),
                              });
                            }}
                            className="text-muted-foreground hover:text-red-500 p-0.5 print:hidden"
                          >
                            <MinusCircle size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-slate-50 border-t border-slate-200 print:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(activePayslip.earningsJson || []), { label: "Custom Allowance", amount: 0 }];
                        setActivePayslip({ ...activePayslip, earningsJson: next });
                      }}
                      className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold hover:underline"
                    >
                      <PlusCircle size={11} /> Add Custom Earning
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 border-t-2 border-slate-200 flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-900 uppercase">Total Gross Earnings</span>
                    <span className="font-mono text-emerald-800 text-sm">
                      {activePayslip.currencySymbol} {Number(activePayslip.totalEarnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Column 2: Deductions */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-red-800 text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                    <span>Deductions</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Income Tax (PAYE)</span>
                      <input
                        type="number"
                        value={activePayslip.taxDeduction}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.deductionsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = val + activePayslip.fineDeduction + activePayslip.otherDeductions + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            taxDeduction: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-700 border-b border-slate-200 focus:border-red-700 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Fines & Penalties</span>
                      <input
                        type="number"
                        value={activePayslip.fineDeduction}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.deductionsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = activePayslip.taxDeduction + val + activePayslip.otherDeductions + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            fineDeduction: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-700 border-b border-slate-200 focus:border-red-700 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-700 font-medium">Other Deductions</span>
                      <input
                        type="number"
                        value={activePayslip.otherDeductions}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const customSum = (activePayslip.deductionsJson || []).reduce((s, i) => s + Number(i.amount || 0), 0);
                          const total = activePayslip.taxDeduction + activePayslip.fineDeduction + val + customSum;
                          setActivePayslip({
                            ...activePayslip,
                            otherDeductions: val,
                            totalDeductions: total,
                            netSalary: Math.max(0, activePayslip.totalEarnings - total),
                          });
                        }}
                        className="w-28 text-right font-mono font-bold text-red-700 border-b border-slate-200 focus:border-red-700 focus:outline-none"
                      />
                    </div>

                    {/* Custom Deductions List in Viewer */}
                    {activePayslip.deductionsJson?.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center bg-slate-50/50">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const next = [...(activePayslip.deductionsJson || [])];
                            next[idx].label = e.target.value;
                            setActivePayslip({ ...activePayslip, deductionsJson: next });
                          }}
                          className="text-slate-700 font-medium bg-transparent border-b border-slate-200 text-xs w-44"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const next = [...(activePayslip.deductionsJson || [])];
                              next[idx].amount = Number(e.target.value);
                              const customSum = next.reduce((s, i) => s + Number(i.amount || 0), 0);
                              const total = activePayslip.taxDeduction + activePayslip.fineDeduction + activePayslip.otherDeductions + customSum;
                              setActivePayslip({
                                ...activePayslip,
                                deductionsJson: next,
                                totalDeductions: total,
                                netSalary: Math.max(0, activePayslip.totalEarnings - total),
                              });
                            }}
                            className="w-24 text-right font-mono font-bold text-red-700 border-b border-slate-200 focus:border-red-700 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (activePayslip.deductionsJson || []).filter((_, i) => i !== idx);
                              const customSum = next.reduce((s, i) => s + Number(i.amount || 0), 0);
                              const total = activePayslip.taxDeduction + activePayslip.fineDeduction + activePayslip.otherDeductions + customSum;
                              setActivePayslip({
                                ...activePayslip,
                                deductionsJson: next,
                                totalDeductions: total,
                                netSalary: Math.max(0, activePayslip.totalEarnings - total),
                              });
                            }}
                            className="text-muted-foreground hover:text-red-500 p-0.5 print:hidden"
                          >
                            <MinusCircle size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-slate-50 border-t border-slate-200 print:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...(activePayslip.deductionsJson || []), { label: "Custom Deduction", amount: 0 }];
                        setActivePayslip({ ...activePayslip, deductionsJson: next });
                      }}
                      className="flex items-center gap-1 text-[10px] text-red-800 font-bold hover:underline"
                    >
                      <PlusCircle size={11} /> Add Custom Deduction
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 border-t-2 border-slate-200 flex justify-between items-center font-bold text-xs">
                    <span className="text-slate-900 uppercase">Total Deductions</span>
                    <span className="font-mono text-red-700 text-sm">
                      {activePayslip.currencySymbol} {Number(activePayslip.totalDeductions).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* European Standard Net Pay Banner */}
              <div className="bg-slate-900 text-white rounded-lg p-5 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-orange-500">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    NET TAKE-HOME PAYABLE AMOUNT ({activePayslip.monthYear})
                  </span>
                  <div className="text-xs text-orange-400 italic mt-0.5">
                    {numberToWords(activePayslip.netSalary)}
                  </div>
                </div>
                <div className="text-3xl font-black font-mono text-white tracking-tight">
                  {activePayslip.currencySymbol} {Number(activePayslip.netSalary).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Remarks & Sign-off */}
              <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-end gap-6 text-xs">
                <div className="max-w-md w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Remarks / Instructions
                  </span>
                  <textarea
                    rows={2}
                    value={activePayslip.notes || ""}
                    onChange={(e) =>
                      setActivePayslip({ ...activePayslip, notes: e.target.value })
                    }
                    className="w-full text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-slate-800 focus:outline-none resize-none leading-relaxed"
                    placeholder="Standard monthly salary disbursement. This is a computer-generated payslip and requires no physical signature."
                  />
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
            <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-start gap-3">
              <Mail size={20} className="text-orange-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-white">
                  Dispatch Salary Slip & Attached PDF
                </p>
                <p className="text-slate-300 mt-0.5">
                  Sends the corporate HTML salary slip along with an official PDF attachment via SMTP.
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
                onClick={handleSendViaSmtp}
                disabled={sendEmailMutation.isPending || !emailTarget}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sendEmailMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Dispatching Email & PDF...</span>
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
