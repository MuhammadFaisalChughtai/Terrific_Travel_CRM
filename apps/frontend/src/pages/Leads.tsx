import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import {
  Users,
  Plus,
  Search,
  Pencil,
  Eye,
  Trash2,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Calendar,
  Phone,
  User as UserIcon,
  FileText,
  AlertTriangle,
  X,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  SlidersHorizontal,
  History,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../components/Modal";

export interface LeadUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LeadStatusLog {
  id: string;
  leadId: string;
  status:
    | "NEW"
    | "CONTACTED"
    | "FOLLOW_UP"
    | "QUALIFIED"
    | "CLOSED"
    | "VOICE_MAIL"
    | "BOOK_ELSE_WHERE"
    | "PLAN_CANCEL"
    | "EXPENSIVE"
    | "PENDING"
    | "INTERESTING"
    | "NOT_INTERESTED"
    | "SALE";
  notes?: string | null;
  createdById?: string | null;
  createdBy?: LeadUser | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  phoneNumber: string;
  notes?: string | null;
  status:
    | "NEW"
    | "CONTACTED"
    | "FOLLOW_UP"
    | "QUALIFIED"
    | "CLOSED"
    | "VOICE_MAIL"
    | "BOOK_ELSE_WHERE"
    | "PLAN_CANCEL"
    | "EXPENSIVE"
    | "PENDING"
    | "INTERESTING"
    | "NOT_INTERESTED"
    | "SALE";
  assignedAgentId?: string | null;
  assignedAgent?: LeadUser | null;
  createdById?: string | null;
  createdBy?: LeadUser | null;
  updatedById?: string | null;
  updatedBy?: LeadUser | null;
  createdAt: string;
  updatedAt: string;
  statusLogs?: LeadStatusLog[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: "New",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
  },
  FOLLOW_UP: {
    label: "Follow-up",
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
  },
  QUALIFIED: {
    label: "Qualified",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-gray-500/10 dark:bg-gray-500/20",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-500/30",
  },
  VOICE_MAIL: {
    label: "Voice Mail",
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
  },
  BOOK_ELSE_WHERE: {
    label: "Book Else Where",
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
  },
  PLAN_CANCEL: {
    label: "Plan Cancel",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
  },
  EXPENSIVE: {
    label: "Expensive",
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-sky-500/10 dark:bg-sky-500/20",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
  },
  INTERESTING: {
    label: "Interesting",
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
  },
  NOT_INTERESTED: {
    label: "Not Interested",
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
  },
  SALE: {
    label: "Sale",
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/30",
  },
};

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  // Check admin privileges for delete operations
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    if (Array.isArray((currentUser as any).roles)) {
      const hasAdmin = (currentUser as any).roles.some((r: string) => {
        const up = String(r).toUpperCase();
        return up === "ADMIN" || up === "SUPER_ADMIN" || up === "SUPERADMIN";
      });
      if (hasAdmin) return true;
    }
    if ((currentUser as any).role) {
      const up = String((currentUser as any).role).toUpperCase();
      if (up === "ADMIN" || up === "SUPER_ADMIN" || up === "SUPERADMIN") {
        return true;
      }
    }
    return false;
  }, [currentUser]);

  // Check if current user is an Agent (and therefore cannot assign leads)
  const isAgent = useMemo(() => {
    if (!currentUser) return false;
    if (Array.isArray((currentUser as any).roles)) {
      const hasAgent = (currentUser as any).roles.some((r: string) => {
        const up = String(r).toUpperCase();
        return up === "AGENT" || up === "TRAVEL_AGENT";
      });
      if (hasAgent) return true;
    }
    if ((currentUser as any).role) {
      const up = String((currentUser as any).role).toUpperCase();
      if (up === "AGENT" || up === "TRAVEL_AGENT") {
        return true;
      }
    }
    return false;
  }, [currentUser]);

  // Managers and Admins can assign leads; Agents cannot
  const canAssignLeads = useMemo(() => {
    return isAdmin || !isAgent;
  }, [isAdmin, isAgent]);

  // Filters, Pagination, Search & Sorting States
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Log Modal Tab Filter
  const [activeLogTab, setActiveLogTab] = useState<string>("ALL");

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Users/Agents for dropdown filters and forms
  const { data: usersList = [] } = useQuery<LeadUser[]>({
    queryKey: ["lead-agents-list"],
    queryFn: async () => {
      const res = await apiClient.get("/users?limit=200");
      if (res.data?.data?.items) {
        return res.data.data.items;
      }
      if (Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      return [];
    },
  });

  // Main Query for Leads with Server-Side Pagination, Filtering & Sorting
  const {
    data: leadsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "leads",
      page,
      limit,
      debouncedSearch,
      statusFilter,
      agentFilter,
      startDateFilter,
      endDateFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);
      if (agentFilter) params.append("assignedAgentId", agentFilter);
      if (startDateFilter) params.append("startDate", startDateFilter);
      if (endDateFilter) params.append("endDate", endDateFilter);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);

      const res = await apiClient.get(`/leads?${params.toString()}`);
      return res.data;
    },
  });

  const leads: Lead[] = leadsResponse?.data || [];
  const meta = leadsResponse?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    assignedAgentId: "",
    status: "NEW",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
  }>({});

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      assignedAgentId: "",
      status: "NEW",
      notes: "",
    });
    setFormErrors({});
  };

  const handleOpenAddModal = () => {
    if (!canAssignLeads) {
      toast.error("You do not have permission to create leads.");
      return;
    }
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      fullName: lead.fullName,
      phoneNumber: lead.phoneNumber,
      assignedAgentId: lead.assignedAgentId || "",
      status: lead.status || "NEW",
      notes: lead.notes || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveLogTab("ALL");
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (lead: Lead) => {
    if (!isAdmin) {
      toast.error("Only Administrators are permitted to delete leads.");
      return;
    }
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors: { fullName?: string; phoneNumber?: string } = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Lead Full Name is required";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone Number is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiClient.post("/leads", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Lead created successfully!");
      setIsAddModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to create lead.";
      toast.error(msg);
    },
  });

  // Edit Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiClient.put(`/leads/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Lead & Status Logs updated successfully!",
      );
      setIsEditModalOpen(false);
      setSelectedLead(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to update lead.";
      toast.error(msg);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/leads/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Lead permanently deleted.");
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete lead.";
      toast.error(msg);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    if (!validateForm()) return;
    updateMutation.mutate({ id: selectedLead.id, data: formData });
  };

  const handleDeleteSubmit = () => {
    if (!selectedLead) return;
    deleteMutation.mutate(selectedLead.id);
  };

  // Sorting handler
  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Helper for rendering column header with sort icons
  const renderSortHeader = (title: string, columnKey: string) => {
    const isActive = sortBy === columnKey;
    return (
      <button
        onClick={() => handleSort(columnKey)}
        className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors group focus:outline-none"
      >
        <span>{title}</span>
        {isActive ? (
          sortOrder === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("");
    setAgentFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Boolean(statusFilter) ||
    Boolean(agentFilter) ||
    Boolean(startDateFilter) ||
    Boolean(endDateFilter);

  // Calculate X - Y of Z pagination display
  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  // Fetch real-time detailed lead data including statusLogs when View Modal is opened
  const { data: viewLeadDetail } = useQuery({
    queryKey: ["lead-detail", selectedLead?.id],
    queryFn: async () => {
      if (!selectedLead?.id) return null;
      const res = await apiClient.get(`/leads/${selectedLead.id}`);
      return res.data?.data || res.data;
    },
    enabled: Boolean(isViewModalOpen && selectedLead?.id),
  });

  const activeViewLead = viewLeadDetail || selectedLead;

  // Filtered status logs for View Modal
  const filteredStatusLogs = useMemo(() => {
    if (!activeViewLead?.statusLogs) return [];
    if (activeLogTab === "ALL") return activeViewLead.statusLogs;
    return activeViewLead.statusLogs.filter((log: LeadStatusLog) => log.status === activeLogTab);
  }, [activeViewLead, activeLogTab]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Leads Log Book
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Shared collaborative lead management system for all agents
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Leads Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
          </button>
          {canAssignLeads && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, phone, notes, agent..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CLOSED">Closed</option>
              <option value="VOICE_MAIL">Voice Mail</option>
              <option value="BOOK_ELSE_WHERE">Book Else Where</option>
              <option value="PLAN_CANCEL">Plan Cancel</option>
              <option value="EXPENSIVE">Expensive</option>
              <option value="PENDING">Pending</option>
              <option value="INTERESTING">Interesting</option>
              <option value="NOT_INTERESTED">Not Interested</option>
              <option value="SALE">Sale</option>
            </select>
          </div>

          {/* Assigned Agent Filter */}
          <div>
            <select
              value={agentFilter}
              onChange={(e) => {
                setAgentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Agents</option>
              <option value="UNASSIGNED">Unassigned</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Created Filter Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              title="Start Date"
              value={startDateFilter}
              onChange={(e) => {
                setStartDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span className="text-muted-foreground text-xs">to</span>
            <input
              type="date"
              title="End Date"
              value={endDateFilter}
              onChange={(e) => {
                setEndDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Filter Summary & Reset Action */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>Active filters applied</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-primary hover:underline font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Leads Responsive Table View */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[650px] relative">
          <table className="w-full text-left text-sm border-collapse">
            {/* Sticky Table Header */}
            <thead className="bg-muted/80 backdrop-blur sticky top-0 z-10 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 px-4 font-semibold">
                  {renderSortHeader("Lead Name", "fullName")}
                </th>
                <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">
                  {renderSortHeader("Assigned Agent", "assignedAgent")}
                </th>
                <th className="py-3.5 px-4 font-semibold">Latest Log / Note</th>
                <th className="py-3.5 px-4 font-semibold">
                  {renderSortHeader("Created Date", "createdAt")}
                </th>
                <th className="py-3.5 px-4 font-semibold">
                  {renderSortHeader("Updated Date", "updatedAt")}
                </th>
                <th className="py-3.5 px-4 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                // Skeleton Loading State
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-32 mb-1" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 bg-muted rounded-full w-20" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-40" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-muted rounded w-28" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-6 bg-muted rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="max-w-xs mx-auto text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        No leads found
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {hasActiveFilters
                          ? "No leads match your current search or filter criteria. Try resetting filters."
                          : "No leads recorded in the system yet. Click 'Add New Lead' to create one."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Table Rows
                leads.map((lead) => {
                  const statusConf =
                    STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
                  const latestLog = lead.statusLogs?.[0];
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Lead Name */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {lead.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {lead.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-3.5 px-4 text-foreground/80 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>{lead.phoneNumber}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConf.bg} ${statusConf.text} ${statusConf.border}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-4 text-foreground/80">
                        {lead.assignedAgent ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[10px] font-bold">
                              {lead.assignedAgent.firstName.charAt(0)}
                            </div>
                            <span className="text-xs font-medium">
                              {lead.assignedAgent.firstName}{" "}
                              {lead.assignedAgent.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Notes / Latest Status Log */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p
                          className="text-xs text-muted-foreground truncate"
                          title={latestLog?.notes || lead.notes || ""}
                        >
                          {latestLog?.notes
                            ? latestLog.notes
                            : lead.notes
                              ? lead.notes
                              : "—"}
                        </p>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(lead.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenViewModal(lead)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
                            title="View Information & Status Logs"
                          >
                            <Eye className="w-4 h-4" />
                            {lead.statusLogs && lead.statusLogs.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                                {lead.statusLogs.length}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(lead)}
                            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit Lead / Add Status Log"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenDeleteModal(lead)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete Lead (Admin Only)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Display item count: "Showing X–Y of Z leads" */}
          <div className="flex items-center gap-3">
            <span>
              Showing{" "}
              <strong className="text-foreground font-semibold">
                {startItem}
              </strong>
              –
              <strong className="text-foreground font-semibold">
                {endItem}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground font-semibold">
                {meta.total}
              </strong>{" "}
              leads
            </span>

            {/* Rows per page select */}
            <div className="flex items-center gap-1.5 ml-2">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Page numbers and Previous / Next controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="px-2.5 py-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium text-foreground"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Page number buttons */}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1
                );
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        page === p
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted border border-border text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages || isLoading}
              className="px-2.5 py-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium text-foreground"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE LEAD MODAL */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create New Lead"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mohammad Ali"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 ${
                  formErrors.fullName
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
              />
              {formErrors.fullName && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. +44 7911 123456"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 ${
                  formErrors.phoneNumber
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
              />
              {formErrors.phoneNumber && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Assigned Agent
                </label>
                <select
                  value={formData.assignedAgentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedAgentId: e.target.value,
                    })
                  }
                  disabled={!canAssignLeads}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Unassigned</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CLOSED">Closed</option>
                  <option value="VOICE_MAIL">Voice Mail</option>
                  <option value="BOOK_ELSE_WHERE">Book Else Where</option>
                  <option value="PLAN_CANCEL">Plan Cancel</option>
                  <option value="EXPENSIVE">Expensive</option>
                  <option value="PENDING">Pending</option>
                  <option value="INTERESTING">Interesting</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="SALE">Sale</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Initial Activity Note
              </label>
              <textarea
                rows={3}
                placeholder="Add lead background details, initial client inquiry notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Save Lead
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT LEAD MODAL */}
      {isEditModalOpen && selectedLead && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Update Lead: ${selectedLead.fullName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 ${
                  formErrors.fullName
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
              />
              {formErrors.fullName && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={`w-full px-3 py-2 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 ${
                  formErrors.phoneNumber
                    ? "border-destructive focus:ring-destructive/50"
                    : "border-border focus:ring-primary/50"
                }`}
              />
              {formErrors.phoneNumber && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Assigned Agent
                </label>
                <select
                  value={formData.assignedAgentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assignedAgentId: e.target.value,
                    })
                  }
                  disabled={!canAssignLeads}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Unassigned</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CLOSED">Closed</option>
                  <option value="VOICE_MAIL">Voice Mail</option>
                  <option value="BOOK_ELSE_WHERE">Book Else Where</option>
                  <option value="PLAN_CANCEL">Plan Cancel</option>
                  <option value="EXPENSIVE">Expensive</option>
                  <option value="PENDING">Pending</option>
                  <option value="INTERESTING">Interesting</option>
                  <option value="NOT_INTERESTED">Not Interested</option>
                  <option value="SALE">Sale</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Add New Status Update Log / Activity Note
              </label>
              <textarea
                rows={3}
                placeholder="Type a new activity note."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                💡 Submitting a note appends a new status log to this lead's
                activity history.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Update Lead
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW LEAD DETAILS & STATUS LOGS HISTORY MODAL */}
      {isViewModalOpen && activeViewLead && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Lead Information & Status Logs History"
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm pt-2">
            {/* Top Summary Header Card */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                  {activeViewLead.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground leading-tight">
                    {activeViewLead.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{activeViewLead.phoneNumber}</span>
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                  STATUS_CONFIG[activeViewLead.status]?.bg
                } ${STATUS_CONFIG[activeViewLead.status]?.text} ${
                  STATUS_CONFIG[activeViewLead.status]?.border
                }`}
              >
                {STATUS_CONFIG[activeViewLead.status]?.label ||
                  activeViewLead.status}
              </span>
            </div>

            {/* Lead Meta Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-card rounded-lg border border-border/70 flex items-center justify-between">
                <span className="text-muted-foreground font-medium">
                  Assigned Agent:
                </span>
                <strong className="text-foreground font-semibold">
                  {activeViewLead.assignedAgent
                    ? `${activeViewLead.assignedAgent.firstName} ${activeViewLead.assignedAgent.lastName}`
                    : "Unassigned"}
                </strong>
              </div>

              <div className="p-3 bg-card rounded-lg border border-border/70 flex items-center justify-between">
                <span className="text-muted-foreground font-medium">
                  Lead ID:
                </span>
                <code className="text-[11px] bg-muted px-2 py-0.5 rounded text-foreground font-mono">
                  {activeViewLead.id.length > 20
                    ? `${activeViewLead.id.substring(0, 18)}...`
                    : activeViewLead.id}
                </code>
              </div>
            </div>

            {/* STATUS ACTIVITY LOGS & HISTORY SECTION */}
            <div className="p-4 bg-card rounded-xl border border-border/80 space-y-3">
              {/* Header Title Row */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-foreground text-sm tracking-tight">
                    Status Activity Logs & History
                  </h4>
                </div>
                <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full border border-primary/20">
                  {activeViewLead.statusLogs?.length || 0} Logs
                </span>
              </div>

              {/* Status Filter Chips (Flex Wrap - Clean Layout) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setActiveLogTab("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLogTab === "ALL"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground border border-border/50"
                  }`}
                >
                  All Logs ({activeViewLead.statusLogs?.length || 0})
                </button>
                {[
                  "NEW",
                  "CONTACTED",
                  "FOLLOW_UP",
                  "QUALIFIED",
                  "CLOSED",
                  "VOICE_MAIL",
                  "BOOK_ELSE_WHERE",
                  "PLAN_CANCEL",
                  "EXPENSIVE",
                  "PENDING",
                  "INTERESTING",
                  "NOT_INTERESTED",
                  "SALE",
                ].map((st) => {
                    const count =
                      activeViewLead.statusLogs?.filter((l: LeadStatusLog) => l.status === st)
                        .length || 0;
                    const isActive = activeLogTab === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setActiveLogTab(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/60 hover:bg-muted text-muted-foreground border border-border/50"
                        }`}
                      >
                        {STATUS_CONFIG[st]?.label} ({count})
                      </button>
                    );
                  },
                )}
              </div>

              {/* Log Entries Timeline List */}
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 pt-1">
                {filteredStatusLogs.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground space-y-2 bg-muted/10 rounded-lg border border-dashed border-border/60">
                    <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-muted-foreground" />
                    <p className="font-medium text-foreground/70">
                      No activity logs found for{" "}
                      {activeLogTab === "ALL"
                        ? "this lead"
                        : STATUS_CONFIG[activeLogTab]?.label}
                      .
                    </p>
                  </div>
                ) : (
                  filteredStatusLogs.map((log: LeadStatusLog) => {
                    const stConf =
                      STATUS_CONFIG[log.status] || STATUS_CONFIG.NEW;
                    const agentName = log.createdBy
                      ? `${log.createdBy.firstName} ${log.createdBy.lastName}`
                      : "System Admin";
                    return (
                      <div
                        key={log.id}
                        className="p-3.5 bg-muted/20 hover:bg-muted/30 rounded-xl border border-border/70 space-y-2 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs pb-1 border-b border-border/40">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stConf.bg} ${stConf.text} ${stConf.border}`}
                            >
                              {stConf.label}
                            </span>
                            <span className="font-bold text-foreground flex items-center gap-1">
                              <UserIcon className="w-3.5 h-3.5 text-primary" />
                              <span>{agentName}</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span>{formatDate(log.createdAt)}</span>
                          </span>
                        </div>
                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed pt-0.5">
                          {log.notes
                            ? log.notes
                            : "No log details recorded for this update."}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Audit Trail Footnote Card */}
            <div className="p-3.5 bg-muted/30 rounded-xl border border-border/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <UserIcon className="w-3.5 h-3.5 text-primary" />
                  <span>Created By:</span>
                </span>
                <strong className="text-foreground font-semibold">
                  {activeViewLead.createdBy
                    ? `${activeViewLead.createdBy.firstName} ${activeViewLead.createdBy.lastName}`
                    : "System Admin"}
                </strong>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {formatDate(activeViewLead.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Last Modified By:</span>
                </span>
                <strong className="text-foreground font-semibold">
                  {activeViewLead.updatedBy
                    ? `${activeViewLead.updatedBy.firstName} ${activeViewLead.updatedBy.lastName}`
                    : "System Admin"}
                </strong>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {formatDate(activeViewLead.updatedAt)}
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedLead && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Permanent Deletion"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="font-semibold block text-sm">
                  Are you sure you want to delete this lead?
                </strong>
                <p className="text-destructive/90">
                  This action cannot be undone. Lead record for{" "}
                  <strong>"{selectedLead.fullName}"</strong> will be permanently
                  removed from the system.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Permanently Delete Lead
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
