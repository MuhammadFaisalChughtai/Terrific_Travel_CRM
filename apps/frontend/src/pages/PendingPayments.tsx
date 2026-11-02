import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { toast } from 'sonner';
import { formatCurrency } from '@tms/shared-utils';
import {
  CreditCard,
  AlertTriangle,
  Eye,
  Volume2,
  RefreshCw,
  Clock,
  Phone,
  Mail,
  User,
  Calendar,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from '../utils/dangerAlarmAudio';
import BookingManager from '../components/BookingManager';
import { CustomerPendingPaymentAlertItem } from '../components/DashboardCustomerPendingPaymentWidget';

export default function PendingPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'TODAY' | 'TOMORROW' | 'SOON'>('ALL');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBookingRef, setSelectedBookingRef] = useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    items: CustomerPendingPaymentAlertItem[];
    counts: {
      total: number;
      today: number;
      tomorrow: number;
      soon: number;
      totalPendingAmount: number;
    };
  }>({
    queryKey: ['customer-pending-alerts'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/customer-pending-alerts');
      return res.data.data;
    },
    refetchInterval: 30000,
  });

  const rawItems = data?.items || [];
  const counts = data?.counts || { total: 0, today: 0, tomorrow: 0, soon: 0, totalPendingAmount: 0 };

  // Filter items by tab and search
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      // Tab filter
      if (activeTab === 'TODAY' && item.urgencyTag !== 'TODAY' && item.urgencyTag !== 'OVERDUE') return false;
      if (activeTab === 'TOMORROW' && item.urgencyTag !== 'TOMORROW') return false;
      if (activeTab === 'SOON' && item.urgencyTag !== 'NEXT_5_DAYS') return false;

      // Search filter
      if (searchTerm.trim()) {
        const s = searchTerm.trim().toLowerCase();
        const matches =
          item.bookingReference.toLowerCase().includes(s) ||
          item.customerName.toLowerCase().includes(s) ||
          (item.customerPhone && item.customerPhone.toLowerCase().includes(s)) ||
          (item.customerEmail && item.customerEmail.toLowerCase().includes(s)) ||
          item.agentName.toLowerCase().includes(s);
        if (!matches) return false;
      }

      return true;
    });
  }, [rawItems, activeTab, searchTerm]);

  const handleSnooze = () => {
    const oneHourMs = 60 * 60 * 1000;
    localStorage.setItem('payment_pending_alert_snooze', String(Date.now() + oneHourMs));
    stopDangerAlarm();
    toast.info('Danger buzzer snoozed for 1 hour.');
  };

  const handleTestSound = async () => {
    await unlockAudioContext();
    const played = await playDangerAlarm(4);
    if (played) {
      toast.success('Playing 4-second danger buzzer sound...');
    } else {
      toast.info('Click anywhere on the page first to allow audio playback.');
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* Page Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md animate-bounce">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-600 text-white animate-pulse">
                {rawItems.length} ACTIVE ALERTS (TRAVEL ≤ 5 DAYS)
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                Total Unpaid: {formatCurrency(counts.totalPendingAmount)}
              </span>
            </div>
            <h1 className="text-xl font-black text-foreground tracking-tight mt-1">
              Customer Payment Pending Alerts
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
              Live operational board for bookings where customer travel date is within 5 days and payment is not cleared. Record payment in booking details to clear the alert.
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestSound}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
            title="Test Danger Buzzer Sound"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Buzzer</span>
          </button>

          <button
            type="button"
            onClick={handleSnooze}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
            title="Snooze buzzer for 1 hour"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Snooze 1h</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Alerts
          </span>
          <div className="text-2xl font-black text-foreground mt-2">
            {counts.total}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">
            Bookings travel ≤ 5 days
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-rose-500/30 bg-rose-500/5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Departing Today
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {counts.today}
          </div>
          <span className="text-[10px] text-rose-600/80 mt-1">
            Immediate collection required
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-amber-500/30 bg-amber-500/5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Departing Tomorrow
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {counts.tomorrow}
          </div>
          <span className="text-[10px] text-amber-600/80 mt-1">
            Final deadline tomorrow
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-blue-500/30 bg-blue-500/5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              In 2 - 5 Days
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {counts.soon}
          </div>
          <span className="text-[10px] text-blue-600/80 mt-1">
            Upcoming departures
          </span>
        </div>

        <div className="p-4 rounded-xl bg-card border border-emerald-500/30 bg-emerald-500/5 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Total Outstanding
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatCurrency(counts.totalPendingAmount)}
          </div>
          <span className="text-[10px] text-emerald-600/80 mt-1">
            Customer balance to collect
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        {/* Tab buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            All Alerts ({rawItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TODAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'TODAY'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Today / Overdue ({counts.today})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TOMORROW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'TOMORROW'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Tomorrow ({counts.tomorrow})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SOON')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SOON'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            In 2-5 Days ({counts.soon})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reference, customer, agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span>Loading urgent pending payment alerts...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span className="font-bold text-foreground text-sm">
              No Pending Payment Alerts Found
            </span>
            <p className="max-w-md">
              {rawItems.length === 0
                ? 'All customer travel departures within the next 5 days are fully paid or have zero outstanding balance.'
                : 'No alerts match the selected filter or search keyword.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                  <th className="py-3 px-4">Departure Date</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Client Paid</th>
                  <th className="py-3 px-4 text-rose-600 dark:text-rose-400">Balance Pending</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const isToday = item.urgencyTag === 'TODAY' || item.urgencyTag === 'OVERDUE';
                  const isTomorrow = item.urgencyTag === 'TOMORROW';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-muted/40 transition-colors ${
                        isToday ? 'bg-rose-500/5' : isTomorrow ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Booking Reference */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookingId(item.id);
                            setSelectedBookingRef(item.bookingReference);
                          }}
                          className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>#{item.bookingReference}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(item.bookingDate).toLocaleDateString('en-GB')}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">{item.customerName}</div>
                        <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-muted-foreground">
                          {item.customerPhone && (
                            <a
                              href={`https://wa.me/${item.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:underline text-emerald-600 dark:text-emerald-400 font-medium"
                              title="Message customer on WhatsApp"
                            >
                              <Phone size={11} /> {item.customerPhone}
                            </a>
                          )}
                          {item.customerEmail && (
                            <a
                              href={`mailto:${item.customerEmail}`}
                              className="inline-flex items-center gap-1 hover:underline truncate max-w-[180px]"
                              title={item.customerEmail}
                            >
                              <Mail size={11} /> {item.customerEmail}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 text-xs text-foreground font-medium">
                          <User size={12} className="text-muted-foreground" />
                          {item.agentName}
                        </div>
                        {item.agentPhone && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {item.agentPhone}
                          </div>
                        )}
                      </td>

                      {/* Travel Date & Countdown Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isToday
                                ? 'bg-rose-600 text-white animate-pulse'
                                : isTomorrow
                                ? 'bg-amber-500 text-white'
                                : 'bg-secondary text-foreground border border-border'
                            }`}
                          >
                            {isToday
                              ? 'Departs Today'
                              : isTomorrow
                              ? 'Departs Tomorrow'
                              : `In ${item.daysUntilTravel} Days`}
                          </span>
                        </div>
                        <div className="text-[11px] text-foreground font-semibold flex items-center gap-1">
                          <Calendar size={11} className="text-muted-foreground" />
                          {new Date(item.departureDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {formatCurrency(item.totalPrice)}
                      </td>

                      {/* Client Paid */}
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.paidAmount)}
                      </td>

                      {/* Pending Due */}
                      <td className="py-3 px-4">
                        <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                          {formatCurrency(item.pendingAmount)}
                        </div>
                        {item.hasInstallments && item.nextDueAmount ? (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                            Next due: {formatCurrency(item.nextDueAmount)}
                          </div>
                        ) : null}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-foreground border border-border">
                            {item.bookingStatus}
                          </span>
                          {item.hasInstallments && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                              <Layers size={9} /> Installment Plan
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookingId(item.id);
                            setSelectedBookingRef(item.bookingReference);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Eye size={12} />
                          <span>View &amp; Record Payment</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBookingId && (
        <BookingManager
          isOpen={!!selectedBookingId}
          onClose={() => {
            setSelectedBookingId(null);
            setSelectedBookingRef(null);
            refetch();
          }}
          bookingId={selectedBookingId}
          bookingReference={selectedBookingRef || undefined}
        />
      )}
    </div>
  );
}
