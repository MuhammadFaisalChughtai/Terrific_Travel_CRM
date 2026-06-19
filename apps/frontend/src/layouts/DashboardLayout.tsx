import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useThemeStore } from "../store/theme.store";
import { useDashboardStore } from "../store/dashboard.store";
import { useNotificationStore } from "../store/notification.store";
import {
  LayoutDashboard,
  Plane,
  Hotel,
  Map,
  CalendarRange,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  User,
  Users,
  Store,
  BookOpen,
} from "lucide-react";
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);

  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Bookings", path: "/bookings", icon: CalendarRange },
    { name: "Agent", path: "/agent", icon: Users },
    { name: "Vendors", path: "/vendors", icon: Store },
    // { name: "Flights", path: "/flights", icon: Plane },
    // { name: "Hotels", path: "/hotels", icon: Hotel },
    // { name: "Tours", path: "/tours", icon: Map },
    // { name: "Payments", path: "/payments", icon: CreditCard },
    // { name: "Reports", path: "/reports", icon: BarChart3 },
    // { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl">✈️</span>
            {sidebarOpen && (
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                Terrific Travel
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm whitespace-nowrap">{item.name}</span>
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
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
            {sidebarOpen && (
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
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-20"}`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-8 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold">
              {menuItems.find((m) => m.path === location.pathname)?.name ||
                "Terrific Travel"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications Alert */}
            <Link
              to="/notifications"
              className="relative p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <Bell size={20} />
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
                className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
