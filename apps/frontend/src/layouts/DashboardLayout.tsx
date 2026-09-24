import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { apiClient } from "../api/client";
import { useThemeStore } from "../store/theme.store";
import { useDashboardStore } from "../store/dashboard.store";
import { useNotificationStore } from "../store/notification.store";
import {
  LayoutDashboard,
  PieChart,
  Plane,
  Hotel,
  Map,
  CalendarRange,
  Compass,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Store,
  BookOpen,
  FileText,
  Layers,
  DollarSign,
  Clock,
  Calculator,
  ArrowRightLeft,
  UserCheck,
  ShieldAlert,
  Receipt,
  Ticket,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [headerClocks, setHeaderClocks] = useState({ uk: "", pkt: "" });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Desktop Workstation Security Companion Status (checks every 20s)
  const {
    data: companionStatus,
    isLoading: isCheckingCompanion,
    refetch: refetchCompanionStatus,
  } = useQuery({
    queryKey: ["workstation-companion-status"],
    queryFn: async () => {
      const res = await apiClient.get("/agent-monitor/status");
      return res.data?.data;
    },
    refetchInterval: 20000,
    enabled: !!user,
  });

  const isCompanionOffline = Boolean(
    companionStatus && companionStatus.isCompanionActive === false
  );

  useEffect(() => {
    const updateNavbarClocks = () => {
      const now = new Date();
      const uk = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const pkt = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setHeaderClocks({ uk, pkt });
    };
    updateNavbarClocks();
    const interval = setInterval(updateNavbarClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: pendingApprovals } = useQuery({
    queryKey: ["payment-requests", "PENDING"],
    queryFn: async () => {
      const res = await apiClient.get("/payments/requests?status=PENDING");
      return res.data.data;
    },
    enabled:
      !!user &&
      (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")),
  });

  useEffect(() => {
    if (user?.id) {
      apiClient
        .get(`/users/${user.id}`)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            // Merge so we never wipe out permissions or other token-only fields
            useAuthStore.setState((state) => ({
              user: state.user
                ? { ...state.user, ...res.data.data }
                : res.data.data,
            }));
          }
        })
        .catch((err) => {
          console.error("Failed to sync user profile:", err);
        });
    }
    // Re-run whenever agentId is missing so stale sessions heal without logout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.agentId === null || user?.agentId === undefined]);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);

  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [user?.id, fetchNotifications]);

  // Query agent's fines for navbar badge (scoped to current month)
  const { data: myFinesData } = useQuery({
    queryKey: ["fines", "my-fines", "navbar"],
    queryFn: async () => {
      const res = await apiClient.get("/fines/my-fines");
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const pendingFinesList =
    myFinesData?.items?.filter((f: any) => {
      if (f.status !== "PENDING") return false;
      const fineDate = new Date(f.date);
      const now = new Date();
      return (
        fineDate.getMonth() === now.getMonth() &&
        fineDate.getFullYear() === now.getFullYear()
      );
    }) || [];

  const currentMonthFineTotal = pendingFinesList.reduce(
    (sum: number, f: any) => sum + (f.amount || 0),
    0
  );
  const currentMonthFineCurrency = pendingFinesList[0]?.currency || "GBP";

  const formatNavbarFine = (amount: number, curr: string) => {
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
    return `${symbol}${amount.toFixed(2)}`;
  };

  useEffect(() => {
    // Auto-close mobile drawer when route/location changes
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      toggleSidebar();
    }
  };

  const userHasRole = (allowed: string[]) => {
    if (!user?.roles || !Array.isArray(user.roles)) return false;
    return user.roles.some((r) => {
      const raw = typeof r === "string" ? r : (r as any)?.name || "";
      if (!raw) return false;
      const clean = raw.toUpperCase().replace(/[\s_-]+/g, "");
      if (
        clean === "ADMIN" ||
        clean === "SUPERADMIN" ||
        clean === "ADMINISTRATOR" ||
        clean === "ROOT"
      ) {
        return (
          allowed.includes("Admin") ||
          allowed.includes("SUPERADMIN") ||
          allowed.includes("SUPER_ADMIN")
        );
      }
      if (clean === "TRAVELAGENT" || clean === "AGENT") {
        return allowed.includes("Agent") || allowed.includes("AGENT");
      }
      if (clean === "MANAGER" || clean === "BRANCHMANAGER") {
        return allowed.includes("Manager") || allowed.includes("MANAGER");
      }
      return allowed.some(
        (a) => a.toUpperCase().replace(/[\s_-]+/g, "") === clean
      );
    });
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Bookings", path: "/bookings", icon: CalendarRange },
    { name: "Issuance Board", path: "/issuance", icon: Ticket },
    { name: "Leads Log Book", path: "/leads", icon: UserCheck },
    { name: "Upcoming Tours", path: "/tours", icon: Compass },
    { name: "Invoices", path: "/invoices", icon: FileText },
    { name: "Agent", path: "/agent", icon: Users, roles: ["Admin"] },
    {
      name: "Vendors",
      path: "/vendors",
      icon: Store,
      roles: ["Admin"],
    },
    {
      name: "Ledger",
      path: "/ledger",
      icon: BookOpen,
      roles: ["Admin"],
    },
    {
      name: "Templates",
      path: "/invoice-templates",
      icon: Layers,
      roles: ["Admin"],
    },
    { name: "Users", path: "/users", icon: User, roles: ["Admin"] },
    {
      name: "Security & DLP",
      path: "/security-audit",
      icon: ShieldAlert,
      roles: ["Admin"],
    },
    {
      name: "Payment Approvals",
      path: "/payments",
      icon: DollarSign,
      roles: ["Admin"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: Clock,
      roles: ["Admin", "Manager", "Agent"],
    },
    {
      name: "Agent Margins",
      path: "/agent-margins",
      icon: Calculator,
      roles: ["Admin", "Manager", "Agent"],
    },
    {
      name: "Booked Services",
      path: "/booked-services",
      icon: ArrowRightLeft,
      roles: ["Admin", "Manager", "Agent"],
    },
    {
      name: "Payroll",
      path: "/payroll",
      icon: Receipt,
      roles: ["Admin"],
    },
    // {
    //   name: "Financials",
    //   path: "/reports",
    //   icon: PieChart,
    //   roles: ["Admin", "Manager"],
    // },
    { name: "Settings", path: "/settings", icon: Settings, roles: ["Admin"] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles ? userHasRole(item.roles) : true,
  );

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          md:translate-x-0 md:shadow-none
          ${sidebarOpen ? "md:w-64" : "md:w-20"}
          w-64
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl">✈️</span>
            {(isMobileOpen || sidebarOpen) && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                Terrific Travel
              </span>
            )}
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
            title="Close Menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const showFull = isMobileOpen || sidebarOpen;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {showFull ? (
                  <span className="text-sm whitespace-nowrap flex-1 flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {item.name === "Payment Approvals" &&
                      pendingApprovals &&
                      pendingApprovals.length > 0 && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none flex items-center justify-center ${
                            isActive ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {pendingApprovals.length}
                        </span>
                      )}
                  </span>
                ) : (
                  item.name === "Payment Approvals" &&
                  pendingApprovals &&
                  pendingApprovals.length > 0 && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card shadow-sm" />
                  )
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-primary/10 text-primary">
              <User size={20} />
            </div>
            {(isMobileOpen || sidebarOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
            {(isMobileOpen || sidebarOpen) && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 pl-0 ${
          sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleToggle}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-bold truncate max-w-[150px] sm:max-w-none">
              {filteredMenuItems.find((m) => m.path === location.pathname)
                ?.name || "Terrific Travel"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Live Dual Timezone Clocks (UK & Pakistan) */}
            <div className="hidden sm:flex items-center gap-2 bg-secondary/80 dark:bg-secondary/40 border border-border/80 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-inner">
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-border/60">
                <span className="text-xs">🇬🇧</span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">UK:</span>
                <span className="font-bold font-mono text-foreground text-xs">{headerClocks.uk || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5 pl-0.5">
                <span className="text-xs">🇵🇰</span>
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">PKT:</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-300 text-xs">{headerClocks.pkt || "—"}</span>
              </div>
            </div>

            {/* Desktop Security Bridge Live Indicator */}
            {companionStatus && (
              companionStatus.isCompanionActive ? (
                <div
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                  title="Terrific Travel Security Bridge Connected & Active"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Bridge Active</span>
                </div>
              ) : (
                <button
                  onClick={() => refetchCompanionStatus()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all shadow-sm"
                  title="Desktop Security Service Disconnected - Click to check connection"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>Bridge Offline</span>
                </button>
              )
            )}

            {/* Active Fine Badge for Current Month */}
            {currentMonthFineTotal > 0 && (
              <Link
                to="/attendance"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/80 transition-all shadow-sm"
                title="Current Month Pending Fine (Resets at month end)"
              >
                <ShieldAlert size={14} className="animate-pulse text-rose-600 dark:text-rose-400" />
                <span>Fine: {formatNavbarFine(currentMonthFineTotal, currentMonthFineCurrency)}</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Alert */}
            <Link
              to="/notifications"
              className="relative p-2 sm:p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Avatar Dropdown for mobile */}
            {!sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Workstation Desktop Companion Alert Banner */}
        {isCompanionOffline && (
          <div className="bg-amber-500/10 dark:bg-amber-950/50 border-b border-amber-500/30 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Desktop Security Service Disconnected:</strong> Terrific Travel Security Bridge is not running or connected on this workstation.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80 hidden md:inline">
                Launch TerrificTravelBridge.exe on your computer to connect
              </span>
              <button
                onClick={() => refetchCompanionStatus()}
                disabled={isCheckingCompanion}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 rounded-lg transition-colors border border-amber-500/30"
              >
                <RefreshCw size={12} className={isCheckingCompanion ? "animate-spin" : ""} />
                Check Status
              </button>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
