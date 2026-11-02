import React, { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  User,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from '../utils/dangerAlarmAudio';

export interface CustomerPendingPaymentAlertItem {
  id: string; // bookingId
  bookingReference: string;
  bookingStatus: string;
  bookingDate: string;
  departureDate: string;
  daysUntilTravel: number;
  hoursUntilTravel: number;
  urgencyTag: 'TODAY' | 'TOMORROW' | 'NEXT_5_DAYS' | 'OVERDUE';
  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;
  agentName: string;
  agentId?: string | null;
  agentEmail?: string | null;
  agentPhone?: string | null;
  totalPrice: number;
  paidAmount: number;
  pendingAmount: number;
  currency: string;
  paymentStatus: string;
  hasInstallments: boolean;
  nextDueDate?: string | null;
  nextDueAmount?: number;
}

interface DashboardCustomerPendingPaymentWidgetProps {
  onOpenBooking: (bookingId: string, bookingRef?: string) => void;
  isAdmin?: boolean;
}

export default function DashboardCustomerPendingPaymentWidget({
  onOpenBooking,
  isAdmin = false,
}: DashboardCustomerPendingPaymentWidgetProps) {
  const navigate = useNavigate();

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

  const items = data?.items || [];
  const counts = data?.counts || { total: 0, today: 0, tomorrow: 0, soon: 0, totalPendingAmount: 0 };
  const hasUrgentPending = items.length > 0;

  // Buzzer alarm logic: plays 4-second danger buzzer every 1 hour as long as unpaid travel <= 5 days remains
  useEffect(() => {
    if (!hasUrgentPending) {
      stopDangerAlarm();
      return;
    }

    const checkAndPlay = () => {
      const now = Date.now();
      const snoozeUntil = Number(localStorage.getItem('payment_pending_alert_snooze') || 0);
      if (snoozeUntil > now) return;

      const lastPlayed = Number(sessionStorage.getItem('payment_pending_alert_last_played') || 0);
      const oneHourMs = 60 * 60 * 1000;

      if (!lastPlayed || now - lastPlayed >= oneHourMs) {
        playDangerAlarm(4).then((success) => {
          if (success) {
            sessionStorage.setItem('payment_pending_alert_last_played', String(now));
          }
        });
      }
    };

    checkAndPlay();
    const interval = setInterval(checkAndPlay, 30000);

    const onUserInteraction = () => {
      unlockAudioContext().then((unlocked) => {
        if (unlocked) {
          checkAndPlay();
        }
      });
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('keydown', onUserInteraction, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('keydown', onUserInteraction);
    };
  }, [hasUrgentPending]);

  const handleSnooze = () => {
    const oneHourMs = 60 * 60 * 1000;
    localStorage.setItem('payment_pending_alert_snooze', String(Date.now() + oneHourMs));
    stopDangerAlarm();
    toast.info('Pending payment buzzer snoozed for 1 hour.');
  };

  const handleTestSound = async () => {
    await unlockAudioContext();
    const played = await playDangerAlarm(4);
    if (played) {
      toast.success('Playing 4-second danger alarm buzzer...');
    } else {
      toast.info('Click anywhere on the page first to allow audio playback.');
    }
  };

  // If there are no pending customer payments, do not clutter the dashboard
  if (!isLoading && items.length === 0) {
    return null;
  }

  // Display up to 5 items on dashboard widget
  const displayedItems = items.slice(0, 5);

  return (
    <div className="bg-card border-2 border-amber-500/40 dark:border-amber-500/50 rounded-2xl shadow-sm overflow-hidden mb-6 transition-all ring-1 ring-amber-500/20">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-amber-500/15 via-rose-500/5 to-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-xs animate-bounce">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-600 text-white animate-pulse">
                {items.length} PENDING PAYMENTS (TRAVEL ≤ 5 DAYS)
              </span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                Total Outstanding: {formatCurrency(counts.totalPendingAmount)}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              Customer Payment Pending Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer departure is within 5 days with an outstanding balance. Collect payment to clear alert.
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestSound}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs animate-pulse ring-2 ring-amber-500/30 transition-all cursor-pointer"
            title="Test 4-Second Danger Buzzer Sound"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound Buzzer</span>
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
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/pending-payments')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all cursor-pointer shadow-sm"
          >
            <span>View All ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-secondary/25 border-b border-border text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/60 rounded-lg border border-border/60">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span className="text-muted-foreground">Departing Today:</span>
          <strong className="text-rose-600 dark:text-rose-400 font-black">{counts.today}</strong>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/60 rounded-lg border border-border/60">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Departing Tomorrow:</span>
          <strong className="text-amber-600 dark:text-amber-400 font-black">{counts.tomorrow}</strong>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/60 rounded-lg border border-border/60">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">In 2 - 5 Days:</span>
          <strong className="text-blue-600 dark:text-blue-400 font-black">{counts.soon}</strong>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/60 rounded-lg border border-border/60">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">Departed / Overdue:</span>
          <strong className="text-purple-600 dark:text-purple-400 font-black">{(counts as any).overdue || 0}</strong>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-card/60 rounded-lg border border-border/60 col-span-2 sm:col-span-1">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">Pending Total:</span>
          <strong className="text-foreground font-black">{formatCurrency(counts.totalPendingAmount)}</strong>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
              <th className="py-2.5 px-4">Booking Ref</th>
              <th className="py-2.5 px-4">Customer</th>
              <th className="py-2.5 px-4">Assigned Agent</th>
              <th className="py-2.5 px-4">Travel Date</th>
              <th className="py-2.5 px-4">Total Price</th>
              <th className="py-2.5 px-4">Received</th>
              <th className="py-2.5 px-4 text-rose-600 dark:text-rose-400">Pending Due</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedItems.map((item) => {
              const isToday = item.urgencyTag === 'TODAY';
              const isTomorrow = item.urgencyTag === 'TOMORROW';
              const isOverdue = item.urgencyTag === 'OVERDUE';

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-muted/40 transition-colors ${
                    isToday ? 'bg-rose-500/10' : isTomorrow ? 'bg-amber-500/10' : isOverdue ? 'bg-purple-500/5' : ''
                  }`}
                >
                  {/* Booking Ref */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(item.id, item.bookingReference)}
                      className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>#{item.bookingReference}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>
                    {item.hasInstallments && (
                      <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                        <Layers size={9} /> Installment Plan
                      </span>
                    )}
                  </td>

                  {/* Customer Info */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-foreground">{item.customerName}</div>
                    {item.customerPhone && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Phone size={10} className="text-emerald-600" />
                        <a
                          href={`https://wa.me/${item.customerPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-emerald-600 dark:text-emerald-400 font-medium"
                          title="Message on WhatsApp"
                        >
                          {item.customerPhone}
                        </a>
                      </div>
                    )}
                  </td>

                  {/* Agent */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-foreground font-medium">
                      <User size={12} className="text-muted-foreground" />
                      {item.agentName}
                    </span>
                  </td>

                  {/* Travel Date & Countdown Badge */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isToday
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isTomorrow
                            ? 'bg-amber-500 text-white'
                            : isOverdue
                            ? 'bg-purple-600/90 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {isToday
                          ? 'Departs Today'
                          : isTomorrow
                          ? 'Departs Tomorrow'
                          : isOverdue
                          ? `Departed (${Math.abs(item.daysUntilTravel)}d ago)`
                          : `Departs in ${item.daysUntilTravel}d`}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(item.departureDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Total Price */}
                  <td className="py-3 px-4 font-medium text-foreground">
                    {formatCurrency(item.totalPrice)}
                  </td>

                  {/* Paid Amount */}
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.paidAmount)}
                  </td>

                  {/* Pending Amount */}
                  <td className="py-3 px-4">
                    <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                      {formatCurrency(item.pendingAmount)}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(item.id, item.bookingReference)}
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

      {/* Footer Banner */}
      {items.length > 5 && (
        <div className="p-3 bg-secondary/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 5 of {items.length} urgent customer pending payment bookings.</span>
          <button
            type="button"
            onClick={() => navigate('/pending-payments')}
            className="font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Open Dedicated Pending Payments Board</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
