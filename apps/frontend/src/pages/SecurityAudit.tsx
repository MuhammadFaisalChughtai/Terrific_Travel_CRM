import React, { useState } from 'react';
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
  lastPingAt: string;
  elapsedSeconds: number;
  isOnline: boolean;
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

export default function SecurityAuditPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = Boolean(
    user?.roles?.some((r) => {
      const raw = typeof r === "string" ? r : (r as any)?.name || "";
      const clean = raw.toUpperCase().replace(/[\s_-]+/g, "");
      return ["ADMIN", "SUPERADMIN", "ADMINISTRATOR", "ROOT"].includes(clean);
    })
  );

  const [activeTab, setActiveTab] = useState<'live' | 'clipboard'>('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<AuditLogItem | null>(null);

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

  // Clipboard Audit Logs Query
  const {
    data: auditData,
    isLoading: isLoadingAudit,
    refetch: refetchAudit,
  } = useQuery<{ data: AuditLogItem[]; meta: any }>({
    queryKey: ['security-audit', 'audit', searchTerm, actionFilter],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (searchTerm) params.search = searchTerm;
      if (actionFilter) params.action = actionFilter;
      const res = await apiClient.get('/agent-monitor/audit', { params });
      return res.data;
    },
    enabled: isAdmin && activeTab === 'clipboard',
  });

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
              else refetchAudit();
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
                        agent.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-bold text-foreground">{agent.userName}</div>
                      <div className="text-[11px] text-muted-foreground">{agent.userEmail}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      agent.isOnline
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {agent.isOnline ? 'Active' : 'Offline'}
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

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                    <span>Last Ping: {new Date(agent.lastPingAt).toLocaleTimeString()}</span>
                    <span>v{agent.appVersion}</span>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="text-xs py-2 px-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="">All Actions</option>
                <option value="COPY">COPY Events Only</option>
                <option value="PASTE">PASTE Events Only</option>
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
                    <th className="p-3">Source Window</th>
                    <th className="p-3">Location & IP</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-center">Screen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {auditData?.data?.map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3 font-bold text-foreground">
                        <div>{log.agentName}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{log.agentEmail}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            log.action === 'COPY'
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
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

                      <td className="p-3 text-[11px] text-foreground max-w-[180px]">
                        <div className="truncate font-medium" title={log.sourceWindow}>
                          {log.sourceWindow}
                        </div>
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
          </div>
        </div>
      )}

      {/* Screenshot Viewer Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3.5 border-b border-border flex items-center justify-between bg-secondary/40">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Workstation Screenshot — {selectedScreenshot.agentName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {selectedScreenshot.action} Triggered
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Captured: {new Date(selectedScreenshot.createdAt).toLocaleString('en-GB')} &bull; Active App:{' '}
                  {selectedScreenshot.sourceWindow}
                </div>
              </div>

              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-neutral-950 flex flex-col items-center justify-center">
              {selectedScreenshot.screenshotUrl ? (
                <img
                  src={selectedScreenshot.screenshotUrl}
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
