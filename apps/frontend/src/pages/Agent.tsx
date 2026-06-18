import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency } from "@tms/shared-utils";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Wallet,
  Mail,
  Phone,
  User,
  Monitor,
  Building2,
  Hash,
  Briefcase,
  BarChart3,
  BadgeDollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Modal from "../components/Modal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

// Validation Schema for Agent basic fields (excluding slabs, which are validated manually)
const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  payrollEmail: z
    .string()
    .email("Please enter a valid payroll email")
    .or(z.literal(""))
    .optional(),
  phoneNumber: z.string().min(5, "Phone number must be at least 5 digits"),
  gdsSystem: z.string().min(1, "GDS System is required"),
  client: z.string().min(1, "Client name is required"),
  pcc: z.string().min(1, "PCC code is required"),
  jobStatus: z.enum(["Active", "Inactive"]),
});

interface Slab {
  id?: string;
  minSales: number;
  maxSales: number | null;
  commissionRate: number;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  payrollEmail?: string | null;
  phoneNumber: string;
  gdsSystem: string;
  client: string;
  pcc: string;
  jobStatus: "Active" | "Inactive";
  walletBalance: number;
  createdAt: string;
  slabs: Slab[];
}

const DEFAULT_SLABS_INIT = [
  { minSales: 1000, maxSales: 2000, commissionRate: 5 },
  { minSales: 2001, maxSales: 3000, commissionRate: 6 },
  { minSales: 3001, maxSales: 4000, commissionRate: 7 },
  { minSales: 4001, maxSales: 5000, commissionRate: 8 },
  { minSales: 5001, maxSales: null, commissionRate: 10 },
];

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

export default function AgentPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // Search & Modals
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Form Field States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payrollEmail, setPayrollEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gdsSystem, setGdsSystem] = useState("");
  const [client, setClient] = useState("");
  const [pcc, setPcc] = useState("");
  const [jobStatus, setJobStatus] = useState<"Active" | "Inactive">("Active");
  const [walletBalance, setWalletBalance] = useState(0);
  const [slabs, setSlabs] = useState<
    Array<{
      minSales: number | "";
      maxSales: number | "" | null;
      commissionRate: number | "";
    }>
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ----------------------------------------------------
  // Queries
  // ----------------------------------------------------
  const { data: agentsData, isLoading: isAgentsLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items as Agent[];
    },
  });

  // ----------------------------------------------------
  // Mutations
  // ----------------------------------------------------
  const createAgentMutation = useMutation({
    mutationFn: async (newAgent: any) => {
      return apiClient.post("/agents", newAgent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent registered successfully!");
      closeFormModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to register agent.");
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: async (updatedAgent: any) => {
      return apiClient.patch(`/agents/${selectedAgent?.id}`, updatedAgent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent updated successfully!");
      closeFormModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update agent.");
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent profile permanently deleted.");
      setIsDeleteModalOpen(false);
      setSelectedAgent(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete agent.");
    },
  });

  // ----------------------------------------------------
  // Form Controls
  // ----------------------------------------------------
  const handleAddClick = () => {
    setSelectedAgent(null);
    setName("");
    setEmail("");
    setPayrollEmail("");
    setPhoneNumber("");
    setGdsSystem("");
    setClient("");
    setPcc("");
    setJobStatus("Active");
    setWalletBalance(0);
    setSlabs(DEFAULT_SLABS_INIT);
    setErrors({});
    setIsFormModalOpen(true);
  };

  const handleEditClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setName(agent.name);
    setEmail(agent.email);
    setPayrollEmail(agent.payrollEmail || "");
    setPhoneNumber(agent.phoneNumber);
    setGdsSystem(agent.gdsSystem);
    setClient(agent.client);
    setPcc(agent.pcc);
    setJobStatus(agent.jobStatus);
    setWalletBalance(agent.walletBalance || 0);
    setSlabs(
      agent.slabs
        ? agent.slabs.map((s) => ({
            minSales: s.minSales,
            maxSales: s.maxSales,
            commissionRate: s.commissionRate,
          }))
        : DEFAULT_SLABS_INIT,
    );
    setErrors({});
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedAgent(null);
  };

  const handleDeleteClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteModalOpen(true);
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const basicData = {
      name,
      email,
      payrollEmail: payrollEmail.trim() || undefined,
      phoneNumber,
      gdsSystem,
      client,
      pcc,
      jobStatus,
    };

    const validationResult = agentSchema.safeParse(basicData);
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

    // Validate slabs
    const validatedSlabs: any[] = [];
    for (let i = 0; i < slabs.length; i++) {
      const s = slabs[i];
      if (s.minSales === "" || s.minSales === undefined) {
        toast.error(`Slab row #${i + 1} is missing Minimum Sales`);
        return;
      }
      if (s.commissionRate === "" || s.commissionRate === undefined) {
        toast.error(`Slab row #${i + 1} is missing Commission Rate`);
        return;
      }
      if (
        s.maxSales !== null &&
        s.maxSales !== "" &&
        s.maxSales !== undefined
      ) {
        if (Number(s.maxSales) <= Number(s.minSales)) {
          toast.error(
            `Slab row #${i + 1}: Max sales must be greater than min sales`,
          );
          return;
        }
      }
      validatedSlabs.push({
        minSales: Number(s.minSales),
        maxSales:
          s.maxSales === null || s.maxSales === "" || s.maxSales === undefined
            ? null
            : Number(s.maxSales),
        commissionRate: Number(s.commissionRate),
      });
    }

    // Sort slabs by minSales to keep them chronological
    validatedSlabs.sort((a, b) => a.minSales - b.minSales);

    const payload = {
      ...basicData,
      slabs: validatedSlabs,
    };

    if (selectedAgent) {
      updateAgentMutation.mutate(payload);
    } else {
      createAgentMutation.mutate(payload);
    }
  };

  const confirmDeleteAgent = () => {
    if (selectedAgent) {
      deleteAgentMutation.mutate(selectedAgent.id);
    }
  };

  // Filter Agents list based on search
  const filteredAgents = agentsData?.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.gdsSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.client.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Agent Registry
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Manage travel agent profiles, configure custom commission
            structures, and review wallet ledgers.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/5 self-center shrink-0"
        >
          <Plus size={14} />
          Register Agent
        </button>
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
              placeholder="Search agents by name, email, or client..."
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
                  <th className="py-2.5 px-5">Contact / Email</th>
                  <th className="py-2.5 px-5">Wallet Balance</th>
                  <th className="py-2.5 px-5">GDS System</th>
                  <th className="py-2.5 px-5">Client Mapping</th>
                  <th className="py-2.5 px-5">PCC Code</th>
                  <th className="py-2.5 px-5">Job Status</th>
                  <th className="py-2.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {isAgentsLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                        <span>Loading registry data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAgents && filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-secondary/15 transition-colors"
                    >
                      <td className="py-2.5 px-5 font-semibold text-foreground">
                        {agent.name}
                      </td>
                      <td className="py-2.5 px-5">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground/90">
                            {agent.email}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {agent.phoneNumber}
                          </p>
                        </div>
                      </td>
                      <td className="py-2.5 px-5">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <Wallet size={12} className="text-muted-foreground" />
                          {formatCurrency(agent.walletBalance || 0)}
                        </div>
                      </td>
                      <td className="py-2.5 px-5 uppercase font-mono font-bold text-muted-foreground/70">
                        {agent.gdsSystem}
                      </td>
                      <td className="py-2.5 px-5 font-medium text-foreground">
                        {agent.client}
                      </td>
                      <td className="py-2.5 px-5 font-mono font-semibold">
                        {agent.pcc}
                      </td>
                      <td className="py-2.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-transparent ${
                            agent.jobStatus === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${agent.jobStatus === "Active" ? "bg-emerald-600 dark:bg-emerald-400" : "bg-muted-foreground"}`}
                          />
                          {agent.jobStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(agent)}
                            className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                            title="Update Profile"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(agent)}
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
                      colSpan={8}
                      className="py-10 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Users size={20} className="text-muted-foreground/45" />
                        <p className="text-xs">
                          No registered agents matched your search query.
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
          PREMIUM AGENT FORM MODAL
      ══════════════════════════════════════════ */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={
          selectedAgent
            ? `Update Profile — ${selectedAgent.name}`
            : "Register New Travel Agent"
        }
        maxWidth="4xl"
      >
        <form onSubmit={handleAgentSubmit}>
          {/* Two-column layout — divider between columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border/40">
            {/* ─────────────────────────────────────
                LEFT PANEL: Agent Details
            ───────────────────────────────────── */}
            <div className="pb-5 lg:pb-0 lg:pr-6 space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/15">
                  <User size={13} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">
                    Agent Details
                  </p>
                  <p className="text-[9px] text-muted-foreground/70">
                    Personal &amp; professional information
                  </p>
                </div>
              </div>

              {/* Name + Work Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel icon={User} label="Full Name" />
                  <input
                    type="text"
                    placeholder="Jane Doe"
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
                  <FieldLabel
                    icon={Mail}
                    label="Work Email"
                    badge={<span className="text-destructive ml-0.5">*</span>}
                  />
                  <input
                    type="email"
                    placeholder="jane.doe@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldCls}
                  />
                  {errors.email && (
                    <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Payroll Email */}
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <FieldLabel
                    icon={BadgeDollarSign}
                    label="Payroll Email"
                    badge={
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[7px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 uppercase tracking-wider">
                        Payroll
                      </span>
                    }
                  />
                  <input
                    type="email"
                    placeholder="personal@gmail.com"
                    value={payrollEmail}
                    onChange={(e) => setPayrollEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-amber-500/5 border border-amber-400/30 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 text-foreground placeholder:text-muted-foreground/40 transition-all focus:bg-background"
                  />
                  {errors.payrollEmail && (
                    <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {errors.payrollEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* GDS + Client */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel icon={Monitor} label="GDS System" />
                  <input
                    type="text"
                    placeholder="e.g. Amadeus, Sabre"
                    value={gdsSystem}
                    onChange={(e) => setGdsSystem(e.target.value)}
                    className={fieldCls}
                  />
                  {errors.gdsSystem && (
                    <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {errors.gdsSystem}
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel icon={Building2} label="Client" />
                  <input
                    type="text"
                    placeholder="e.g. Amex Global"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className={fieldCls}
                  />
                  {errors.client && (
                    <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {errors.client}
                    </p>
                  )}
                </div>
              </div>

              {/* PCC + Job Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel icon={Hash} label="PCC Code" />
                  <input
                    type="text"
                    placeholder="e.g. 1A2B"
                    value={pcc}
                    onChange={(e) => setPcc(e.target.value)}
                    className={fieldCls}
                  />
                  {errors.pcc && (
                    <p className="mt-0.5 text-[9px] text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                      {errors.pcc}
                    </p>
                  )}
                </div>
                <div>
                  <FieldLabel icon={Briefcase} label="Job Status" />
                  <select
                    value={jobStatus}
                    onChange={(e) =>
                      setJobStatus(e.target.value as "Active" | "Inactive")
                    }
                    className={fieldCls}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* ── Wallet Balance Card ── */}
              <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent p-4 flex items-center justify-between gap-4 mt-1">
                {/* Decorative glow */}
                <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
                <div className="absolute -left-6 bottom-0 w-20 h-20 rounded-full bg-emerald-500/8 blur-xl pointer-events-none" />
                <div className="space-y-1 z-10">
                  <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.12em]">
                    <Wallet size={9} />
                    Agent Wallet Balance
                  </span>
                  <span className="block text-[28px] font-black tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
                    {formatCurrency(walletBalance)}
                  </span>
                  <span className="block text-[8px] text-muted-foreground/60 italic leading-snug mt-1">
                    Auto-credited when booking margins are finalised by admin.
                  </span>
                </div>
                <div className="z-10 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-inner shrink-0">
                  <Wallet size={24} />
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────
                RIGHT PANEL: Commission Slabs
            ───────────────────────────────────── */}
            <div className="pt-5 lg:pt-0 lg:pl-6 flex flex-col gap-3 min-h-0">
              {/* Section Header + Add button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/15">
                    <BarChart3 size={13} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">
                      Commission Slabs
                    </p>
                    <p className="text-[9px] text-muted-foreground/70">
                      Sales-tier based commission rates
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSlabs([
                      ...slabs,
                      { minSales: "", maxSales: "", commissionRate: "" },
                    ])
                  }
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all border border-primary/20 hover:border-primary/40"
                >
                  <Plus size={10} />
                  Add Row
                </button>
              </div>

              {/* Column headers — only shown when there are slabs */}
              {slabs.length > 0 && (
                <div className="grid grid-cols-12 gap-2 px-1">
                  <p className="col-span-4 text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Min Sales
                  </p>
                  <p className="col-span-4 text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Max Sales
                  </p>
                  <p className="col-span-3 text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                    Rate
                  </p>
                  <p className="col-span-1" />
                </div>
              )}

              {/* Slab rows — overflow-y-auto ONLY when content exceeds height */}
              <div
                className="overflow-y-auto space-y-2 pr-0.5 flex-1"
                style={{ maxHeight: "min(310px, 44vh)" }}
              >
                {slabs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 py-12 border-2 border-dashed border-border/50 rounded-xl bg-secondary/5">
                    <div className="p-3 rounded-full bg-secondary/30">
                      <BarChart3
                        size={18}
                        className="text-muted-foreground/30"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-semibold text-muted-foreground/60">
                        No commission tiers yet
                      </p>
                      <p className="text-[9px] text-muted-foreground/40 mt-0.5">
                        Click "Add Row" to create your first tier
                      </p>
                    </div>
                  </div>
                ) : (
                  slabs.map((slab, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center bg-secondary/10 border border-border/30 hover:border-primary/25 hover:bg-secondary/20 px-3 pt-2 pb-2.5 rounded-xl transition-all group"
                    >
                      {/* Tier label */}
                      <div className="col-span-12 flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-primary/50 uppercase tracking-widest">
                          Tier {index + 1}
                        </span>
                        <div className="flex-1 h-px bg-border/30" />
                      </div>

                      {/* Min Sales */}
                      <div className="col-span-4">
                        <input
                          type="number"
                          step="any"
                          placeholder="1000"
                          value={slab.minSales}
                          onChange={(e) => {
                            const newSlabs = [...slabs];
                            newSlabs[index].minSales =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value);
                            setSlabs(newSlabs);
                          }}
                          className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground/25 transition-all"
                        />
                      </div>

                      {/* Max Sales */}
                      <div className="col-span-4">
                        <input
                          type="number"
                          step="any"
                          placeholder="∞"
                          value={
                            slab.maxSales === null ||
                            slab.maxSales === undefined
                              ? ""
                              : slab.maxSales
                          }
                          onChange={(e) => {
                            const newSlabs = [...slabs];
                            newSlabs[index].maxSales =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            setSlabs(newSlabs);
                          }}
                          className="w-full px-2.5 py-1.5 bg-background border border-border/60 rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground/25 transition-all"
                        />
                      </div>

                      {/* Commission Rate */}
                      <div className="col-span-3">
                        <div className="relative">
                          <input
                            type="number"
                            step="any"
                            placeholder="5"
                            value={slab.commissionRate}
                            onChange={(e) => {
                              const newSlabs = [...slabs];
                              newSlabs[index].commissionRate =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);
                              setSlabs(newSlabs);
                            }}
                            className="w-full pl-2.5 pr-6 py-1.5 bg-background border border-border/60 rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground/25 transition-all"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground/40 pointer-events-none">
                            %
                          </span>
                        </div>
                      </div>

                      {/* Delete row */}
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setSlabs(slabs.filter((_, i) => i !== index))
                          }
                          className="p-1 rounded-md text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Tier"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Slab count hint */}
              {slabs.length > 0 && (
                <p className="text-[8px] text-muted-foreground/40 text-right italic pr-0.5">
                  {slabs.length} tier{slabs.length !== 1 ? "s" : ""} configured
                </p>
              )}
            </div>
          </div>

          {/* ── Form Actions ── */}
          <div className="flex items-center justify-between gap-3 pt-4 mt-5 border-t border-border/40">
            <p className="text-[9px] text-muted-foreground/50 italic">
              Fields marked{" "}
              <span className="text-destructive font-bold">*</span> are required
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeFormModal}
                className="py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-lg text-xs transition-all border border-border/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createAgentMutation.isPending || updateAgentMutation.isPending
                }
                className="py-2 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg text-xs transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(createAgentMutation.isPending ||
                  updateAgentMutation.isPending) && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                {selectedAgent ? "Save Changes" : "Register Profile"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAgent(null);
        }}
        onConfirm={confirmDeleteAgent}
        loading={deleteAgentMutation.isPending}
        title="Archive Agent Record"
        message={`Are you sure you want to permanently delete travel agent "${selectedAgent?.name}"? All associated system configurations and access keys will be terminated immediately.`}
      />
    </div>
  );
}
