import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { formatCurrency } from '@tms/shared-utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Receipt,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  Building2,
  Users
} from 'lucide-react';

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { data: balanceSheet, isLoading } = useQuery({
    queryKey: ['balance-sheet', selectedMonth, selectedYear],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      
      const res = await apiClient.get(`/reports/balance-sheet?${params.toString()}`);
      return res.data.data;
    }
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return String(year);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { assets, liabilities, equity, metrics, trendData } = balanceSheet || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Balance Sheet</h2>
          <p className="text-sm text-muted-foreground">
            Aggregate company financials, profit margins, and liability ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card p-1.5 rounded-lg border border-border shadow-sm">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0 px-3 py-1.5"
          >
            <option value="">All Time (Months)</option>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-border"></div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0 px-3 py-1.5"
          >
            <option value="">All Time (Years)</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Landmark size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(metrics?.totalRevenue || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight size={14} className="text-emerald-500" /> Gross Paid Amount
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-destructive/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Vendor Cost</h3>
            <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
              <Building2 size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(metrics?.totalVendorCost || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownRight size={14} className="text-destructive" /> Paid to Suppliers
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Agent Margins</h3>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Users size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(metrics?.totalAgentMargins || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDownRight size={14} className="text-amber-500" /> Paid Commissions
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Net Profit</h3>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(metrics?.netProfit || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowUpRight size={14} className="text-emerald-500" /> After Costs & Margins
            </p>
          </div>
        </div>
      </div>

      {/* Balance Sheet Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-2">
            <Scale size={18} className="text-emerald-600" />
            <h3 className="font-bold">Assets</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">Cash at Hand (Retained Net Profit)</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(assets?.cashAtHand || 0)}</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">Accounts Receivable (Unpaid Bookings)</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(assets?.accountsReceivable || 0)}</td>
                </tr>
                <tr className="bg-emerald-50/50 dark:bg-emerald-950/20">
                  <td className="px-6 py-4 font-bold">Total Assets</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(assets?.totalAssets || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-2">
            <Receipt size={18} className="text-destructive" />
            <h3 className="font-bold">Liabilities & Equity</h3>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">Accounts Payable (Vendor Unpaid)</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(liabilities?.vendorPayables || 0)}</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">Agent Payable (Margins Unpaid)</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(liabilities?.agentPayables || 0)}</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">Retained Earnings (Equity)</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(equity?.retainedEarnings || 0)}</td>
                </tr>
                <tr className="bg-destructive/5 dark:bg-destructive/10">
                  <td className="px-6 py-4 font-bold">Total Liabilities & Equity</td>
                  <td className="px-6 py-4 text-right font-bold text-destructive">
                    {formatCurrency((liabilities?.totalLiabilities || 0) + (equity?.retainedEarnings || 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      {!selectedMonth && !selectedYear && trendData && trendData.length > 0 && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            6-Month Financial Trend
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(val) => `£${val}`}
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Total Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Total Costs (Vendor + Agent)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
