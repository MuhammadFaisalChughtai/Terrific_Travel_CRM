import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/auth.store';
import {
  ShieldAlert,
  Activity,
  ClipboardCopy,
  Monitor,
  Search,
  RefreshCw,
  Globe,
  Clock,
  Eye,
  X,
  AlertTriangle,
  User,
  Filter,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Zap,
  Coffee,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

interface LiveAgent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roles: string[];
  machineId: string;
  hostname?: string;
  ipAddress: string;
  city: string;
  region?: string;
  country: string;
  isp?: string;
  activeWindow: string;
  appVersion: string;
  isIdle?: boolean;
  activeMinutes?: number;
  idleMinutes?: number;
  lastPingAt: string;
  elapsedSeconds: number;
  isOnline: boolean;
}

interface ProductivityReportItem {
  id: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  totalShiftMinutes: number;
  activeMinutes: number;
  idleMinutes: number;
  productivityScore: number;
}

interface AuditLogItem {
  id: string;
  userId: string;
  agentName: string;
  agentEmail: string;
  action: string;
  textSnippet: string;
  charCount: number;
  sourceWindow: string;
  targetWindow: string;
  screenshotUrl?: string;
  hasScreenshot: boolean;
  ipAddress?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

function PaginationControl({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 15, 25, 50],
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card/60 text-xs">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-muted-foreground">
        <span>
          Showing <strong className="text-foreground font-semibold">{startItem}</strong> to{' '}
          <strong className="text-foreground font-semibold">{endItem}</strong> of{' '}
          <strong className="text-foreground font-semibold">{totalItems}</strong> records
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 border-l border-border pl-2.5">
            <span className="text-[11px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-secondary/80 border border-border rounded px-2 py-0.5 text-foreground text-xs cursor-pointer focus:outline-none"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium pr-1">Prev</span>
        </button>

        <div className="flex items-center gap-1 px-1">
          {startPage > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className="w-7 h-7 rounded-md border border-border bg-card hover:bg-secondary text-foreground text-xs font-medium cursor-pointer"
              >
                1
              </button>
              {startPage > 2 && <span className="text-muted-foreground px-0.5">...</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
                p === currentPage
                  ? 'bg-orange-500 border-orange-600 text-white shadow-xs'
                  : 'border-border bg-card hover:bg-secondary text-foreground'
              }`}
            >
              {p}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-muted-foreground px-0.5">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className="w-7 h-7 rounded-md border border-border bg-card hover:bg-secondary text-foreground text-xs font-medium cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 cursor-pointer"
          title="Next Page"
        >
          <span className="hidden sm:inline text-[11px] font-medium pl-1">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function SecurityAuditPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(
    user?.roles?.some((r) => {
      const raw = typeof r === "string" ? r : (r as any)?.name || "";
      const clean = raw.toUpperCase().replace(/[\s_-]+/g, "");
      return ["ADMIN", "SUPERADMIN", "ADMINISTRATOR", "ROOT", "MANAGER", "BRANCHMANAGER"].includes(clean);
    })
  );

  const [activeTab, setActiveTab] = useState<'live' | 'clipboard' | 'productivity'>('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<AuditLogItem | null>(null);
  const [screenshotBlobUrl, setScreenshotBlobUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [productivityDate, setProductivityDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Dedicated Agent History Modal State
  const [detailAgent, setDetailAgent] = useState<{
    userId?: string;
    agentId?: string;
    name: string;
    email: string;
  } | null>(null);
  const [agentModalTab, setAgentModalTab] = useState<'audit' | 'productivity'>('audit');
  const [agentModalPage, setAgentModalPage] = useState(1);
  const [agentModalLimit, setAgentModalLimit] = useState(15);
  const [agentModalActionFilter, setAgentModalActionFilter] = useState('');
  const [agentModalSearch, setAgentModalSearch] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Main Clipboard Table Pagination State
  const [clipboardPage, setClipboardPage] = useState(1);
  const [clipboardLimit, setClipboardLimit] = useState(25);

  const openAgentModal = (agent: { userId?: string; agentId?: string; name: string; email: string }) => {
    setDetailAgent(agent);
    setAgentModalTab('audit');
    setAgentModalPage(1);
    setAgentModalSearch('');
    setAgentModalActionFilter('');
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => {
      setCopiedSnippetId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  useEffect(() => {
    if (!selectedScreenshot) {
      if (screenshotBlobUrl) {
        URL.revokeObjectURL(screenshotBlobUrl);
      }
      setScreenshotBlobUrl(null);
      setIsLoadingImage(false);
      setImageError(false);
      return;
    }

    if (!selectedScreenshot.hasScreenshot && !selectedScreenshot.screenshotUrl) {
      setScreenshotBlobUrl(null);
      setIsLoadingImage(false);
      setImageError(false);
      return;
    }

    let active = true;
    setIsLoadingImage(true);
    setImageError(false);

    const targetUrl = selectedScreenshot.id
      ? `/agent-monitor/screenshot/log/${selectedScreenshot.id}`
      : selectedScreenshot.screenshotUrl?.replace(/^\/api/, '') || '';

    apiClient
      .get(targetUrl, { responseType: 'blob' })
      .then((res) => {
        if (!active) return;
        const objectUrl = URL.createObjectURL(res.data);
        setScreenshotBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to load screenshot evidence:', err);
        setImageError(true);
      })
      .finally(() => {
        if (active) setIsLoadingImage(false);
      });

    return () => {
      active = false;
    };
  }, [selectedScreenshot]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedScreenshot) {
          setSelectedScreenshot(null);
        } else if (detailAgent) {
          setDetailAgent(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScreenshot, detailAgent]);

  // Live Workstations Query (refetches every 15s)
  const {
    data: liveAgents = [],
    isLoading: isLoadingLive,
    refetch: refetchLive,
  } = useQuery<LiveAgent[]>({
    queryKey: ['security-audit', 'live'],
    queryFn: async () => {
      const res = await apiClient.get('/agent-monitor/live');
      return res.data.data;
    },
    enabled: isAdmin,
    refetchInterval: 15000,
  });

  // Clipboard Audit Logs Query (with pagination)
  const {
    data: auditData,
    isLoading: isLoadingAudit,
    refetch: refetchAudit,
  } = useQuery<{ data: AuditLogItem[]; meta: any }>({
    queryKey: ['security-audit', 'audit', searchTerm, actionFilter, clipboardPage, clipboardLimit],
    queryFn: async () => {
      const params: any = { page: clipboardPage, limit: clipboardLimit };
      if (searchTerm) params.search = searchTerm;
      if (actionFilter) params.action = actionFilter;
      const res = await apiClient.get('/agent-monitor/audit', { params });
      return res.data;
    },
    enabled: isAdmin && activeTab === 'clipboard',
  });

  // Agent Specific Modal Audit Logs Query (paginated)
  const {
    data: agentAuditData,
    isLoading: isLoadingAgentAudit,
    refetch: refetchAgentAudit,
  } = useQuery<{ data: AuditLogItem[]; meta: any }>({
    queryKey: [
      'security-audit',
      'agent-modal-audit',
      detailAgent?.userId,
      detailAgent?.agentId,
      agentModalPage,
      agentModalLimit,
      agentModalActionFilter,
      agentModalSearch,
    ],
    queryFn: async () => {
      const params: any = {
        page: agentModalPage,
        limit: agentModalLimit,
      };
      if (detailAgent?.userId) params.userId = detailAgent.userId;
      if (detailAgent?.agentId) params.agentId = detailAgent.agentId;
      if (agentModalActionFilter) params.action = agentModalActionFilter;
      if (agentModalSearch) params.search = agentModalSearch;
      const res = await apiClient.get('/agent-monitor/audit', { params });
      return res.data;
    },
    enabled: Boolean(detailAgent) && agentModalTab === 'audit',
  });

  // Agent Specific Modal Productivity Reports Query (paginated)
  const {
    data: agentProductivityData,
    isLoading: isLoadingAgentProductivity,
    refetch: refetchAgentProductivity,
  } = useQuery<{ data: ProductivityReportItem[]; meta: any }>({
    queryKey: [
      'security-audit',
      'agent-modal-productivity',
      detailAgent?.userId,
      detailAgent?.agentId,
      agentModalPage,
      agentModalLimit,
    ],
    queryFn: async () => {
      const params: any = {
        page: agentModalPage,
        limit: agentModalLimit,
      };
      if (detailAgent?.userId) params.userId = detailAgent.userId;
      if (detailAgent?.agentId) params.agentId = detailAgent.agentId;
      const res = await apiClient.get('/agent-monitor/productivity-reports', { params });
      return res.data;
    },
    enabled: Boolean(detailAgent) && agentModalTab === 'productivity',
  });

  // Productivity Reports Query
  const {
    data: productivityData,
    isLoading: isLoadingProductivity,
    refetch: refetchProductivity,
  } = useQuery<{ data: ProductivityReportItem[]; meta: any }>({
    queryKey: ['security-audit', 'productivity', productivityDate],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (productivityDate) {
        params.startDate = productivityDate;
        params.endDate = productivityDate;
      }
      const res = await apiClient.get('/agent-monitor/productivity-reports', { params });
      return res.data;
    },
    enabled: isAdmin && activeTab === 'productivity',
  });

  function formatMinutes(totalMins: number): string {
    if (!totalMins || totalMins <= 0) return '0m';
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const onlineCount = liveAgents.filter((a) => a.isOnline).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Security & DLP Audit
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor workstation companion heartbeats, public IP geolocations, and clipboard activity logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} Workstation{onlineCount !== 1 ? 's' : ''} Online
          </span>

          <button
            onClick={() => {
              if (activeTab === 'live') refetchLive();
              else if (activeTab === 'clipboard') refetchAudit();
              else refetchProductivity();
            }}
            className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'live'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Workstations ({liveAgents.length})
        </button>

        <button
          onClick={() => setActiveTab('clipboard')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'clipboard'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ClipboardCopy className="w-4 h-4" />
          Clipboard & Screenshot Events
        </button>

        <button
          onClick={() => setActiveTab('productivity')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'productivity'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Productivity & Shifts
        </button>
      </div>

      {/* TAB 1: Live Workstations */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {liveAgents.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border transition-all ${
                  agent.isOnline
                    ? 'bg-card border-border shadow-xs'
                    : 'bg-secondary/30 border-border/60 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        agent.isOnline
                          ? agent.isIdle
                            ? 'bg-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          openAgentModal({
                            userId: agent.userId,
                            name: agent.userName,
                            email: agent.userEmail,
                          })
                        }
                        className="text-sm font-bold text-foreground hover:text-orange-500 hover:underline transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                        title="Click to view all activity records for this agent"
                      >
                        <span>{agent.userName}</span>
                        <ExternalLink className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="text-[11px] text-muted-foreground">{agent.userEmail}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      agent.isOnline
                        ? agent.isIdle
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {agent.isOnline ? (agent.isIdle ? 'Idle (>5m)' : 'Active') : 'Offline'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-border/70">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-sky-500" /> Public IP:
                    </span>
                    <span className="font-mono font-semibold text-foreground">{agent.ipAddress}</span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Location:</span>
                    <span className="font-medium text-foreground">
                      {agent.city}, {agent.country}
                    </span>
                  </div>

                  {agent.isp && (
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>ISP / Network:</span>
                      <span className="font-medium text-foreground truncate max-w-[170px]" title={agent.isp}>
                        {agent.isp}
                      </span>
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-border/50">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-primary" /> Active Window:
                    </div>
                    <div
                      className="text-[11px] font-mono p-1.5 rounded bg-secondary/60 text-foreground truncate"
                      title={agent.activeWindow}
                    >
                      {agent.activeWindow}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-border/40 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Zap className="w-3 h-3" />
                      <span>{formatMinutes(agent.activeMinutes || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium justify-end">
                      <Coffee className="w-3 h-3" />
                      <span>{formatMinutes(agent.idleMinutes || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-b border-border/30 pb-2">
                    <span>Last Ping: {new Date(agent.lastPingAt).toLocaleTimeString()}</span>
                    <span>v{agent.appVersion}</span>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        openAgentModal({
                          userId: agent.userId,
                          name: agent.userName,
                          email: agent.userEmail,
                        })
                      }
                      className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      View Activity Records &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {liveAgents.length === 0 && !isLoadingLive && (
              <div className="col-span-full p-8 text-center bg-card rounded-xl border border-border">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-foreground">No Companion Heartbeats Received</div>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  Workstation agents will appear here once the desktop connector service is installed and started on employee computers.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Clipboard & Screenshot Events */}
      {activeTab === 'clipboard' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search copied text, window titles, or keywords..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setClipboardPage(1);
                }}
                className="w-full text-xs pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setClipboardPage(1);
                }}
                className="text-xs py-2 px-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">All Actions</option>
                <option value="COPY">COPY Events</option>
                <option value="CUT">CUT Events</option>
                <option value="PASTE">PASTE Events</option>
                <option value="SCREEN_RECORDING">Screen Captures</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground border-b border-border text-[11px] uppercase font-bold tracking-wider">
                    <th className="p-3">Agent</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Copied / Pasted Content</th>
                    <th className="p-3">Source & Where Pasted</th>
                    <th className="p-3">Location & IP</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-center">Screen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {auditData?.data?.map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3 font-bold text-foreground">
                        <button
                          type="button"
                          onClick={() =>
                            openAgentModal({
                              userId: log.userId,
                              name: log.agentName,
                              email: log.agentEmail,
                            })
                          }
                          className="font-bold text-foreground hover:text-orange-500 hover:underline transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                          title="Click to view all activity records for this agent"
                        >
                          <span>{log.agentName}</span>
                          <ExternalLink className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="text-[10px] text-muted-foreground font-normal">{log.agentEmail}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            log.action === 'COPY'
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                              : log.action === 'CUT'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              : log.action === 'PASTE'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="font-mono text-[11px] bg-secondary/50 p-2 rounded border border-border/50 text-foreground whitespace-pre-wrap break-all line-clamp-3">
                          {log.textSnippet}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          {log.charCount} characters
                        </span>
                      </td>

                      <td className="p-3 text-[11px] text-foreground max-w-[220px]">
                        {log.action === 'PASTE' ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                Pasted Into
                              </span>
                              <span className="font-bold text-foreground truncate max-w-[140px]" title={log.targetWindow || 'Target App'}>
                                {log.targetWindow || 'Target App'}
                              </span>
                            </div>
                            {log.sourceWindow && log.sourceWindow !== 'N/A' && (
                              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                  From
                                </span>
                                <span className="truncate max-w-[140px]" title={log.sourceWindow}>
                                  {log.sourceWindow}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="truncate font-medium" title={log.sourceWindow}>
                            {log.sourceWindow}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-[11px] text-muted-foreground">
                        <div className="font-mono text-foreground font-medium">{log.ipAddress || '—'}</div>
                        <div>{log.city ? `${log.city}, ${log.country}` : '—'}</div>
                      </td>

                      <td className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}{' '}
                        {new Date(log.createdAt).toLocaleTimeString('en-GB')}
                      </td>

                      <td className="p-3 text-center">
                        {log.hasScreenshot ? (
                          <button
                            type="button"
                            onClick={() => setSelectedScreenshot(log)}
                            className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {(!auditData?.data || auditData.data.length === 0) && !isLoadingAudit && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                        No clipboard activity recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <PaginationControl
              currentPage={clipboardPage}
              totalPages={auditData?.meta?.totalPages || 1}
              totalItems={auditData?.meta?.total || 0}
              pageSize={clipboardLimit}
              onPageChange={(p) => setClipboardPage(p)}
              onPageSizeChange={(size) => {
                setClipboardLimit(size);
                setClipboardPage(1);
              }}
              pageSizeOptions={[15, 25, 50, 100]}
            />
          </div>
        </div>
      )}

      {/* TAB 3: Productivity & Shift Reports */}
      {activeTab === 'productivity' && (
        <div className="space-y-4">
          {/* Top Filter and Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Report Date:</span>
              <input
                type="date"
                value={productivityDate}
                onChange={(e) => setProductivityDate(e.target.value)}
                className="text-xs bg-secondary/80 border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-hidden focus:ring-1 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setProductivityDate(new Date().toISOString().split('T')[0])}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground font-medium transition-all cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="text-xs text-muted-foreground">
              Automated tracking from Check-in to Check-out
            </div>
          </div>

          {/* Metric Overview Cards */}
          {productivityData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-card rounded-xl border border-border space-y-1">
                <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" /> Active Agents
                </div>
                <div className="text-lg font-black text-foreground">
                  {productivityData.data?.length || 0}
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border space-y-1">
                <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" /> Total Active Work
                </div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {formatMinutes(
                    (productivityData.data || []).reduce((acc, curr) => acc + (curr.activeMinutes || 0), 0)
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border space-y-1">
                <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-500" /> Total Idle Time
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {formatMinutes(
                    (productivityData.data || []).reduce((acc, curr) => acc + (curr.idleMinutes || 0), 0)
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-card rounded-xl border border-border space-y-1">
                <div className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-500" /> Avg Productivity
                </div>
                <div className="text-lg font-black text-foreground">
                  {(() => {
                    const list = productivityData.data || [];
                    if (list.length === 0) return '0%';
                    const avg = Math.round(
                      list.reduce((acc, curr) => acc + (curr.productivityScore || 0), 0) / list.length
                    );
                    return `${avg}%`;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">Agent</th>
                    <th className="p-3">Shift Window</th>
                    <th className="p-3">Total Shift</th>
                    <th className="p-3">Active PC Time</th>
                    <th className="p-3">Idle Time</th>
                    <th className="p-3">Productivity Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {productivityData?.data?.map((item) => (
                    <tr key={item.id} className="hover:bg-secondary/30 transition-all">
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() =>
                            openAgentModal({
                              agentId: item.agentId,
                              name: item.agentName,
                              email: item.agentEmail,
                            })
                          }
                          className="font-bold text-foreground hover:text-orange-500 hover:underline transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                          title="Click to view all activity records for this agent"
                        >
                          <span>{item.agentName}</span>
                          <ExternalLink className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="text-[11px] text-muted-foreground">{item.agentEmail}</div>
                      </td>

                      <td className="p-3 text-muted-foreground">
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <span>
                            {item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </span>
                          <span>&rarr;</span>
                          <span>
                            {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-foreground">
                        {formatMinutes(item.totalShiftMinutes)}
                      </td>

                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-500" />
                          {formatMinutes(item.activeMinutes)}
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">
                        <div className="flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-amber-500" />
                          {formatMinutes(item.idleMinutes)}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1 min-w-[130px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-foreground">{item.productivityScore}%</span>
                            <span className="text-[10px] text-muted-foreground">
                              {item.productivityScore >= 80 ? 'Optimal' : item.productivityScore >= 60 ? 'Moderate' : 'Low'}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.productivityScore >= 80
                                  ? 'bg-emerald-500'
                                  : item.productivityScore >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, item.productivityScore))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.checkOutTime
                              ? 'bg-secondary text-muted-foreground'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {item.checkOutTime ? 'Completed' : 'On Shift'}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {(!productivityData?.data || productivityData.data.length === 0) && !isLoadingProductivity && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                        No attendance shift or productivity records found for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Agent Records & History Modal */}
      {detailAgent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-card border border-border rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-base">
                  {detailAgent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      {detailAgent.name}
                    </h2>
                    {(() => {
                      const isLive = liveAgents.find(
                        (a) => a.userId === detailAgent.userId || a.userEmail === detailAgent.email
                      );
                      if (isLive?.isOnline) {
                        return (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {isLive.isIdle ? 'Idle on PC' : 'Online / Active'}
                          </span>
                        );
                      }
                      return (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                          Offline
                        </span>
                      );
                    })()}
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                    <span>{detailAgent.email}</span>
                    {detailAgent.userId && (
                      <>
                        <span>&bull;</span>
                        <span className="font-mono text-[10px] opacity-75">User ID: {detailAgent.userId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (agentModalTab === 'audit') refetchAgentAudit();
                    else refetchAgentProductivity();
                  }}
                  className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Refresh records"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDetailAgent(null)}
                  className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Sub-navigation Tabs */}
            <div className="flex items-center justify-between px-4 sm:px-5 border-b border-border bg-card">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAgentModalTab('audit');
                    setAgentModalPage(1);
                  }}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    agentModalTab === 'audit'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  Clipboard & Screen Audit
                  {agentAuditData?.meta?.total !== undefined && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary font-semibold">
                      {agentAuditData.meta.total}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAgentModalTab('productivity');
                    setAgentModalPage(1);
                  }}
                  className={`py-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    agentModalTab === 'productivity'
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Productivity & Shift History
                  {agentProductivityData?.meta?.total !== undefined && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary font-semibold">
                      {agentProductivityData.meta.total}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Body / Tab 1: Clipboard Logs */}
            {agentModalTab === 'audit' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Action Filter Bar inside modal */}
                <div className="p-3 sm:px-5 border-b border-border bg-secondary/10 flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="relative flex-1 w-full">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search copied text, active windows, target apps..."
                      value={agentModalSearch}
                      onChange={(e) => {
                        setAgentModalSearch(e.target.value);
                        setAgentModalPage(1);
                      }}
                      className="w-full text-xs pl-8 pr-3 py-1.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={agentModalActionFilter}
                      onChange={(e) => {
                        setAgentModalActionFilter(e.target.value);
                        setAgentModalPage(1);
                      }}
                      className="text-xs py-1.5 px-2.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="">All Actions</option>
                      <option value="COPY">COPY Events</option>
                      <option value="CUT">CUT Events</option>
                      <option value="PASTE">PASTE Events</option>
                      <option value="SCREEN_RECORDING">Screen Captures</option>
                    </select>
                  </div>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-xs text-muted-foreground border-b border-border text-[11px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-3">Action</th>
                        <th className="p-3">Copied / Pasted Content</th>
                        <th className="p-3">Source & Where Pasted</th>
                        <th className="p-3">Location & IP</th>
                        <th className="p-3">Date & Time</th>
                        <th className="p-3 text-center">Screen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {agentAuditData?.data?.map((log) => (
                        <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                log.action === 'COPY'
                                  ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                                  : log.action === 'CUT'
                                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                  : log.action === 'PASTE'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>

                          <td className="p-3 max-w-sm">
                            <div className="relative group">
                              <div className="font-mono text-[11px] bg-secondary/50 p-2 rounded border border-border/50 text-foreground whitespace-pre-wrap break-all line-clamp-3">
                                {log.textSnippet}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopySnippet(log.id, log.textSnippet)}
                                className="absolute right-1 top-1 p-1 rounded bg-card/90 border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Copy content to clipboard"
                              >
                                {copiedSnippetId === log.id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-0.5 block">
                              {log.charCount} characters
                            </span>
                          </td>

                          <td className="p-3 text-[11px] text-foreground max-w-[220px]">
                            {log.action === 'PASTE' ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    Pasted Into
                                  </span>
                                  <span
                                    className="font-bold text-foreground truncate max-w-[140px]"
                                    title={log.targetWindow || 'Target App'}
                                  >
                                    {log.targetWindow || 'Target App'}
                                  </span>
                                </div>
                                {log.sourceWindow && log.sourceWindow !== 'N/A' && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                                      From
                                    </span>
                                    <span className="truncate max-w-[140px]" title={log.sourceWindow}>
                                      {log.sourceWindow}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="truncate font-medium" title={log.sourceWindow}>
                                {log.sourceWindow}
                              </div>
                            )}
                          </td>

                          <td className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                            <div className="font-mono text-foreground font-medium">{log.ipAddress || '—'}</div>
                            <div>{log.city ? `${log.city}, ${log.country}` : '—'}</div>
                          </td>

                          <td className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                            <div>
                              {new Date(log.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="font-mono text-[10px]">
                              {new Date(log.createdAt).toLocaleTimeString('en-GB')}
                            </div>
                          </td>

                          <td className="p-3 text-center whitespace-nowrap">
                            {log.hasScreenshot ? (
                              <button
                                type="button"
                                onClick={() => setSelectedScreenshot(log)}
                                className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">None</span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {isLoadingAgentAudit && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                              <span>Loading records for {detailAgent.name}...</span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {(!agentAuditData?.data || agentAuditData.data.length === 0) && !isLoadingAgentAudit && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                            No clipboard or screenshot events recorded for this agent yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Modal Table Pagination */}
                <PaginationControl
                  currentPage={agentModalPage}
                  totalPages={agentAuditData?.meta?.totalPages || 1}
                  totalItems={agentAuditData?.meta?.total || 0}
                  pageSize={agentModalLimit}
                  onPageChange={(p) => setAgentModalPage(p)}
                  onPageSizeChange={(size) => {
                    setAgentModalLimit(size);
                    setAgentModalPage(1);
                  }}
                  pageSizeOptions={[10, 15, 25, 50]}
                />
              </div>
            )}

            {/* Modal Body / Tab 2: Productivity & Shift History */}
            {agentModalTab === 'productivity' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-secondary/90 backdrop-blur-xs text-muted-foreground border-b border-border text-[11px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Shift Window</th>
                        <th className="p-3">Total Shift Duration</th>
                        <th className="p-3">Active PC Time</th>
                        <th className="p-3">Idle Time</th>
                        <th className="p-3">Productivity Score</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {agentProductivityData?.data?.map((item) => (
                        <tr key={item.id} className="hover:bg-secondary/30 transition-all">
                          <td className="p-3 font-semibold text-foreground whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="p-3 text-muted-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              <span>
                                {item.checkInTime
                                  ? new Date(item.checkInTime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '—'}
                              </span>
                              <span>&rarr;</span>
                              <span>
                                {item.checkOutTime
                                  ? new Date(item.checkOutTime).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'In Progress'}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 font-semibold text-foreground">
                            {formatMinutes(item.totalShiftMinutes)}
                          </td>

                          <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-500" />
                              {formatMinutes(item.activeMinutes)}
                            </div>
                          </td>

                          <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">
                            <div className="flex items-center gap-1">
                              <Coffee className="w-3 h-3 text-amber-500" />
                              {formatMinutes(item.idleMinutes)}
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="space-y-1 min-w-[130px]">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-foreground">
                                  {item.productivityScore}%
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {item.productivityScore >= 80
                                    ? 'Optimal'
                                    : item.productivityScore >= 60
                                    ? 'Moderate'
                                    : 'Low'}
                                </span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    item.productivityScore >= 80
                                      ? 'bg-emerald-500'
                                      : item.productivityScore >= 60
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, item.productivityScore))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                item.checkOutTime
                                  ? 'bg-secondary text-muted-foreground'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              {item.checkOutTime ? 'Completed' : 'On Shift'}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {isLoadingAgentProductivity && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                            <div className="flex items-center justify-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                              <span>Loading productivity history...</span>
                            </div>
                          </td>
                        </tr>
                      )}

                      {(!agentProductivityData?.data || agentProductivityData.data.length === 0) &&
                        !isLoadingAgentProductivity && (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                              No shift or attendance records found for this agent.
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>

                {/* Modal Table Pagination */}
                <PaginationControl
                  currentPage={agentModalPage}
                  totalPages={agentProductivityData?.meta?.totalPages || 1}
                  totalItems={agentProductivityData?.meta?.total || 0}
                  pageSize={agentModalLimit}
                  onPageChange={(p) => setAgentModalPage(p)}
                  onPageSizeChange={(size) => {
                    setAgentModalLimit(size);
                    setAgentModalPage(1);
                  }}
                  pageSizeOptions={[10, 15, 25, 50]}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screenshot Viewer Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3.5 border-b border-border flex items-center justify-between bg-secondary/40">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Workstation Screenshot — {selectedScreenshot.agentName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      selectedScreenshot.action === 'COPY'
                        ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
                        : selectedScreenshot.action === 'CUT'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : selectedScreenshot.action === 'PASTE'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {selectedScreenshot.action}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Captured: {new Date(selectedScreenshot.createdAt).toLocaleString('en-GB')}</span>
                  {selectedScreenshot.action === 'PASTE' ? (
                    <>
                      &bull;
                      <span className="font-bold text-foreground">
                        Pasted Into:{' '}
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          {selectedScreenshot.targetWindow || 'Destination App'}
                        </span>
                      </span>
                      {selectedScreenshot.sourceWindow && selectedScreenshot.sourceWindow !== 'N/A' && (
                        <>
                          &bull;
                          <span>Copied From: {selectedScreenshot.sourceWindow}</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      &bull;
                      <span>Active Window: {selectedScreenshot.sourceWindow}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-neutral-950 flex flex-col items-center justify-center min-h-[320px]">
              {isLoadingImage ? (
                <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                  <span className="text-xs font-semibold text-neutral-300">Retrieving screen evidence...</span>
                </div>
              ) : imageError ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground gap-2 max-w-md">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <span className="text-xs font-bold text-neutral-200">Screen capture image unavailable</span>
                  <span className="text-[11px] text-neutral-400">
                    The clipboard text was captured, but the screenshot payload could not be loaded.
                  </span>
                </div>
              ) : screenshotBlobUrl ? (
                <img
                  src={screenshotBlobUrl}
                  alt="Captured Screen Evidence"
                  className="max-h-[60vh] max-w-full rounded-lg border border-neutral-800 shadow-lg object-contain"
                />
              ) : (
                <div className="text-muted-foreground text-xs">Screenshot unavailable</div>
              )}

              {/* Copied Text Snippet details below */}
              <div className="w-full mt-4 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-left">
                <div className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                  Copied Text Content:
                </div>
                <div className="text-xs font-mono text-neutral-200 whitespace-pre-wrap break-all max-h-24 overflow-y-auto">
                  {selectedScreenshot.textSnippet}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
