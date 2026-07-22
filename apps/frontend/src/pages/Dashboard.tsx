import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import { useAuthStore } from "../store/auth.store";
import {
  TrendingUp,
  Users,
  CalendarRange,
  DollarSign,
  PlaneTakeoff,
  Hotel,
  Compass,
  Percent,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LabelList,
} from "recharts";
import { useMemo, useState } from "react";

type ChartPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
type KpiPeriod = "monthly" | "quarterly" | "yearly" | "all";
type AgentPeriod = "daily" | "weekly" | "monthly" | "yearly" | "all";
type CategoryPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "all";

export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [kpiPeriod, setKpiPeriod] = useState<KpiPeriod>("all");
  const [agentPeriod, setAgentPeriod] = useState<AgentPeriod>("all");
  const [categoryPeriod, setCategoryPeriod] = useState<CategoryPeriod>("all");
  const user = useAuthStore((state) => state.user);
  const isAgent =
    user?.roles.includes("Agent") || user?.roles.includes("TRAVEL_AGENT");
  const isAdmin =
    user?.roles.includes("SUPER_ADMIN") || user?.roles.includes("ADMIN");

  // Fetch dashboard summary stats (all-time, for category breakdowns + agent leaderboard)
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/stats");
      return res.data.data;
    },
  });

  // Fetch period-filtered KPI stats
  const { data: periodStatsData, isLoading: periodStatsLoading } = useQuery({
    queryKey: ["dashboard-stats-by-period", kpiPeriod],
    queryFn: async () => {
      const res = await apiClient.get(
        `/dashboard/stats-by-period?period=${kpiPeriod}`,
      );
      return res.data.data;
    },
  });

  // Fetch agent performance stats
  const { data: agentStatsData, isLoading: agentStatsLoading } = useQuery({
    queryKey: ["dashboard-stats-by-period", agentPeriod],
    queryFn: async () => {
      const res = await apiClient.get(
        `/dashboard/stats-by-period?period=${agentPeriod}`,
      );
      return res.data.data;
    },
  });

  // Fetch category breakdown stats
  const { data: categoryStatsData, isLoading: categoryStatsLoading } = useQuery(
    {
      queryKey: ["dashboard-stats-by-period", categoryPeriod],
      queryFn: async () => {
        const res = await apiClient.get(
          `/dashboard/stats-by-period?period=${categoryPeriod}`,
        );
        return res.data.data;
      },
    },
  );

  // Fetch trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery({
    queryKey: ["dashboard-trends"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/trends");
      return res.data.data;
    },
  });

  // Fallback UI data if loading/empty
  const stats = statsData || {
    totalUsers: 148,
    totalBookings: 64,
    totalRevenue: 28400,
    totalProfit: 9800,
    flightBookings: 32,
    hotelBookings: 20,
    tourBookings: 12,
  };

  const periodStats = periodStatsData || {
    totalRevenue: 0,
    totalVendorCost: 0,
    totalMargin: 0,
    totalProfit: 0,
    totalBookings: 0,
  };

  const defaultTrends = {
    daily: [
      { date: "06/10", bookings: 5, revenue: 2200, profit: 800 },
      { date: "06/11", bookings: 8, revenue: 3800, profit: 1300 },
      { date: "06/12", bookings: 12, revenue: 5400, profit: 1900 },
      { date: "06/13", bookings: 6, revenue: 2900, profit: 950 },
      { date: "06/14", bookings: 15, revenue: 6800, profit: 2400 },
      { date: "06/15", bookings: 18, revenue: 7300, profit: 2600 },
    ],
    weekly: [
      { date: "W1", bookings: 25, revenue: 12000, profit: 4100 },
      { date: "W2", bookings: 32, revenue: 15400, profit: 5300 },
      { date: "W3", bookings: 28, revenue: 13900, profit: 4800 },
      { date: "W4", bookings: 45, revenue: 21800, profit: 7600 },
    ],
    monthly: [
      { date: "Jan", bookings: 110, revenue: 53000, profit: 18200 },
      { date: "Feb", bookings: 125, revenue: 61000, profit: 21000 },
      { date: "Mar", bookings: 140, revenue: 68000, profit: 23500 },
      { date: "Apr", bookings: 135, revenue: 65000, profit: 22400 },
      { date: "May", bookings: 160, revenue: 78000, profit: 27000 },
      { date: "Jun", bookings: 185, revenue: 91000, profit: 31500 },
    ],
    quarterly: [
      { date: "Q1 2025", bookings: 375, revenue: 182000, profit: 62700 },
      { date: "Q2 2025", bookings: 480, revenue: 234000, profit: 80800 },
      { date: "Q3 2025", bookings: 520, revenue: 254000, profit: 87600 },
      { date: "Q4 2025", bookings: 445, revenue: 217000, profit: 74800 },
    ],
    yearly: [
      { date: "2024", bookings: 1200, revenue: 580000, profit: 201000 },
      { date: "2025", bookings: 1450, revenue: 710000, profit: 246000 },
      { date: "2026", bookings: 1800, revenue: 890000, profit: 310000 },
    ],
  };

  const activeTrends = useMemo(() => {
    if (trendsData && trendsData[chartPeriod]) {
      return trendsData[chartPeriod];
    }
    return defaultTrends[chartPeriod];
  }, [trendsData, chartPeriod]);

  const kpiPeriodLabel: Record<KpiPeriod, string> = {
    monthly: "This Month",
    quarterly: "This Quarter",
    yearly: "This Year",
    all: "All Time",
  };

  const cards = useMemo(() => {
    const list = [
      {
        name: isAgent && !isAdmin ? "My Revenue" : "Total Revenue",
        value: formatCurrency(periodStats.totalRevenue),
        icon: DollarSign,
        color:
          "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        name: isAgent && !isAdmin ? "My Bookings" : "Total Bookings",
        value: periodStats.totalBookings,
        icon: CalendarRange,
        color:
          "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        name: isAgent && !isAdmin ? "My Margin" : "Total Margin",
        value: formatCurrency(periodStats.totalMargin),
        icon: Percent,
        color:
          "from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400",
      },
      {
        name: isAgent && !isAdmin ? "My Net Profit" : "Net Profit",
        value: formatCurrency(periodStats.totalProfit),
        icon: TrendingUp,
        color:
          "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400",
      },
    ];

    if (isAdmin) {
      list.push({
        name: "Platform Users",
        value: stats.totalUsers,
        icon: Users,
        color:
          "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
      });
    }

    return list;
  }, [periodStats, stats, isAgent, isAdmin]);

  const categories = [
    {
      name: "Flight Bookings",
      value: categoryStatsData?.flightBookings ?? stats.flightBookings,
      icon: PlaneTakeoff,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      name: "Hotel Bookings",
      value: categoryStatsData?.hotelBookings ?? stats.hotelBookings,
      icon: Hotel,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      name: "Tour Bookings",
      value: categoryStatsData?.tourBookings ?? stats.tourBookings,
      icon: Compass,
      color: "text-rose-600 dark:text-rose-400",
    },
  ];

  const sortedAgents = useMemo(() => {
    const performanceData =
      agentStatsData?.agentPerformance || stats.agentPerformance || [];
    return [...performanceData].sort(
      (a, b) => b.bookingsCount - a.bookingsCount || b.profit - a.profit,
    );
  }, [agentStatsData?.agentPerformance, stats.agentPerformance]);

  const topAgents = useMemo(() => {
    if (sortedAgents.length === 0) return [];
    const count = Math.max(1, Math.ceil(sortedAgents.length / 3));
    return sortedAgents.filter((a, idx) => a.bookingsCount > 0 && idx < count);
  }, [sortedAgents]);

  const leastAgents = useMemo(() => {
    if (sortedAgents.length === 0) return [];
    if (sortedAgents.length <= 2) {
      return sortedAgents.filter(
        (a) => a.bookingsCount <= 0 || !topAgents.some((t) => t.id === a.id),
      );
    }
    const startIndex = Math.floor((sortedAgents.length * 2) / 3);
    return sortedAgents.filter(
      (a, idx) => idx >= startIndex || a.bookingsCount <= 0,
    );
  }, [sortedAgents, topAgents]);

  const avgAgents = useMemo(() => {
    return sortedAgents.filter(
      (a) =>
        !topAgents.some((t) => t.id === a.id) &&
        !leastAgents.some((l) => l.id === a.id),
    );
  }, [sortedAgents, topAgents, leastAgents]);

  return (
    <div className="space-y-5 font-sans text-xs">
      {/* Welcome Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-border">
        <h2 className="text-base font-bold mb-0.5">
          Welcome to your Travel Operations Hub
        </h2>
        <p className="text-xs text-muted-foreground">
          Monitor real-time bookings, payment records, and global travel
          capacity.
        </p>
      </div>

      {/* KPI Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            KPI Period
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
            Showing stats for:{" "}
            <span className="text-foreground font-semibold">
              {kpiPeriodLabel[kpiPeriod]}
            </span>
          </p>
        </div>
        <div className="flex bg-secondary/50 p-0.5 rounded-lg border border-border self-start sm:self-center">
          {(["monthly", "quarterly", "yearly", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setKpiPeriod(p)}
              className={`px-3 py-1 rounded-md text-[10px] font-semibold capitalize transition-all ${
                kpiPeriod === p
                  ? "bg-card text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {p === "all" ? "All Time" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div
        className={`grid grid-cols-1 gap-4 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-4"}`}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className={`p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm transition-opacity ${
                periodStatsLoading ? "opacity-60 animate-pulse" : "opacity-100"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {card.name}
                </p>
                <h3 className="text-xl font-bold mt-1">{card.value}</h3>
              </div>
              <div
                className={`p-2.5 rounded-lg bg-gradient-to-br ${card.color}`}
              >
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Category Breakdown
          </h4>
          <div className="flex bg-secondary/50 p-0.5 rounded-lg border border-border self-start sm:self-center overflow-x-auto max-w-full">
            {(
              [
                "daily",
                "weekly",
                "monthly",
                "quarterly",
                "yearly",
                "all",
              ] as const
            ).map((p) => (
              <button
                key={p}
                onClick={() => setCategoryPeriod(p)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold capitalize whitespace-nowrap transition-all ${
                  categoryPeriod === p
                    ? "bg-card text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {p === "all" ? "All Time" : p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-3.5 bg-card/60 border border-border rounded-xl flex items-center gap-3 shadow-sm"
              >
                <div className={`p-2.5 rounded-lg bg-secondary ${cat.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {cat.name}
                  </p>
                  <p className="text-base font-bold mt-0.5">{cat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 p-4 rounded-xl border border-border">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Sales & Standing Trends
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Monitor real-time revenue growth, net profits, and booking volumes
            across periods.
          </p>
        </div>
        <div className="flex bg-secondary/50 p-0.5 rounded-lg border border-border self-start sm:self-center">
          {(["daily", "weekly", "monthly", "quarterly", "yearly"] as const).map(
            (p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold capitalize transition-all ${
                  chartPeriod === p
                    ? "bg-card text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue & Profit Area Chart */}
        <div className="p-4 bg-card border border-border rounded-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Financial Standing (Revenue & Net Profit)
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              Real-time Analytics
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeTrends}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: "bold",
                  }}
                />
                <Legend
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
        <div className="p-4 bg-card border border-border rounded-xl space-y-3 shadow-sm">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Booking Volumes & Activity
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeTrends}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  iconSize={10}
                  wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="hsl(var(--ring))"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Performance Section */}
      {true && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Agent Performance (Based on Number of Bookings)
            </h4>
            <div className="flex bg-secondary/50 p-0.5 rounded-lg border border-border self-start sm:self-center">
              {(["daily", "weekly", "monthly", "yearly", "all"] as const).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setAgentPeriod(p)}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold capitalize transition-all ${
                      agentPeriod === p
                        ? "bg-card text-foreground shadow-sm border border-border/40"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    {p === "all" ? "All Time" : p}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Bookings by Agent Vertical Bar Chart */}
          {sortedAgents.length > 0 && (
            <div className="bg-card border border-border/80 rounded-xl p-4 shadow-sm">
              <h5 className="text-[11px] font-bold text-foreground mb-3 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Bookings by Agent – Selected Period (
                {agentPeriod === "all" ? "All Time" : agentPeriod})
              </h5>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedAgents}
                    margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      className="stroke-border/40"
                    />
                    <XAxis
                      dataKey="name"
                      type="category"
                      className="text-[10px] text-muted-foreground font-semibold"
                      tickLine={false}
                    />
                    <YAxis
                      type="number"
                      className="text-[10px] text-muted-foreground"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="bookingsCount"
                      fill="rgb(99, 102, 241)"
                      radius={[4, 4, 0, 0]}
                      barSize={24}
                    >
                      <LabelList
                        dataKey="bookingsCount"
                        position="top"
                        className="fill-foreground text-[10px] font-bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Top Performing */}
            <div className="p-4 bg-card border border-emerald-500/20 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold border-b border-border pb-1.5 uppercase tracking-wider text-[10px]">
                <span className="p-1 rounded bg-emerald-500/10">
                  <TrendingUp size={12} />
                </span>
                <span>Top Performers</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-border/40">
                {topAgents.length > 0 ? (
                  topAgents.map((a) => (
                    <div
                      key={a.id}
                      className="pt-2 first:pt-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-foreground">{a.name}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {a.bookingsCount} booking(s)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground italic text-[10px]">
                    No top performers recorded
                  </p>
                )}
              </div>
            </div>

            {/* Column 2: Average Performing */}
            <div className="p-4 bg-card border border-blue-500/20 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold border-b border-border pb-1.5 uppercase tracking-wider text-[10px]">
                <span className="p-1 rounded bg-blue-500/10">
                  <TrendingUp size={12} />
                </span>
                <span>Average Performers</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-border/40">
                {avgAgents.length > 0 ? (
                  avgAgents.map((a) => (
                    <div
                      key={a.id}
                      className="pt-2 first:pt-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-foreground">{a.name}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {a.bookingsCount} booking(s)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground italic text-[10px]">
                    No average performers recorded
                  </p>
                )}
              </div>
            </div>

            {/* Column 3: Least Performing */}
            <div className="p-4 bg-card border border-rose-500/20 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold border-b border-border pb-1.5 uppercase tracking-wider text-[10px]">
                <span className="p-1 rounded bg-rose-500/10">
                  <TrendingUp size={12} className="rotate-180" />
                </span>
                <span>Least Performers</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-border/40">
                {leastAgents.length > 0 ? (
                  leastAgents.map((a) => (
                    <div
                      key={a.id}
                      className="pt-2 first:pt-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-foreground">{a.name}</p>
                        <p className="text-[9px] text-muted-foreground">
                          {a.bookingsCount} booking(s)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground italic text-[10px]">
                    No least performers recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
