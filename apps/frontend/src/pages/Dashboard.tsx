import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency } from "@tms/shared-utils";
import {
  TrendingUp,
  Users,
  CalendarRange,
  DollarSign,
  PlaneTakeoff,
  Hotel,
  Compass,
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
} from "recharts";

export default function Dashboard() {
  // Fetch dashboard summary stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/stats");
      return res.data.data;
    },
  });

  // Fetch daily trends
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
    flightBookings: 32,
    hotelBookings: 20,
    tourBookings: 12,
  };

  const trends = trendsData || [
    { date: "06/10", bookings: 5, revenue: 2200 },
    { date: "06/11", bookings: 8, revenue: 3800 },
    { date: "06/12", bookings: 12, revenue: 5400 },
    { date: "06/13", bookings: 6, revenue: 2900 },
    { date: "06/14", bookings: 15, revenue: 6800 },
    { date: "06/15", bookings: 18, revenue: 7300 },
  ];

  const cards = [
    {
      name: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      name: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarRange,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      name: "Platform Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  const categories = [
    {
      name: "Flight Bookings",
      value: stats.flightBookings,
      icon: PlaneTakeoff,
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      name: "Hotel Bookings",
      value: stats.hotelBookings,
      icon: Hotel,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      name: "Tour Bookings",
      value: stats.tourBookings,
      icon: Compass,
      color: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-border">
        <h2 className="text-xl font-bold mb-1">
          Welcome to your Travel Operations Hub
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitor real-time bookings, payment records, and global travel
          capacity.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="p-6 bg-card border border-border rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.name}
                </p>
                <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="p-5 bg-card/60 border border-border rounded-xl flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg bg-secondary ${cat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  {cat.name}
                </p>
                <p className="text-lg font-bold mt-0.5">{cat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Revenue Expansion Trends</h4>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">
              <TrendingUp size={14} />
              +14% increase
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: "bold",
                  }}
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
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Bar Chart */}
        <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
          <h4 className="text-sm font-semibold">Daily Booking Volumes</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="hsl(var(--ring))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
