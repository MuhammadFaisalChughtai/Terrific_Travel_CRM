import React, { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Hotel,
  Car,
  AlertTriangle,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from '../utils/dangerAlarmAudio';
import { CancellationItem } from './FreeCancellationSection';

interface DashboardDangerCancellationWidgetProps {
  onOpenBooking: (bookingId: string, bookingRef?: string) => void;
  isAdmin?: boolean;
}

export default function DashboardDangerCancellationWidget({
  onOpenBooking,
  isAdmin = false,
}: DashboardDangerCancellationWidgetProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    items: CancellationItem[];
    counts: {
      total: number;
      danger: number;
      dangerPending?: number;
      warning: number;
      ok: number;
      expired: number;
      hotels: number;
      transports: number;
      pendingConfirmation: number;
      confirmed: number;
    };
  }>({
    queryKey: ['cancellation-deadlines'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/cancellation-deadlines');
      return res.data.data;
    },
    refetchInterval: 60000,
  });

  // Filter ONLY items under danger (<= 5 days remaining, not passed)
  const dangerItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(
      (item) => item.urgencyLevel === 'DANGER' && !item.isExpired && item.daysRemaining >= 0
    );
  }, [data?.items]);

  // Unconfirmed danger bookings (trigger buzzer sound every 1 hour)
  const unconfirmedDangerItems = useMemo(() => {
    return dangerItems.filter((item) => !item.isConfirmed);
  }, [dangerItems]);

  const hasUnconfirmedDanger = unconfirmedDangerItems.length > 0;

  // Danger buzzer sound: plays 4-second buzzer every 1 hour ONLY when unconfirmed danger bookings exist
  // Once all danger bookings are confirmed by admin, buzzer sound is COMPLETELY GONE.
  useEffect(() => {
    if (!hasUnconfirmedDanger) {
      stopDangerAlarm();
      return;
    }

    const checkAndPlay = () => {
      const now = Date.now();
      const snoozeUntil = Number(localStorage.getItem('cancellation_alert_snooze') || 0);
      if (snoozeUntil > now) return;

      const lastPlayed = Number(sessionStorage.getItem('cancellation_alert_last_played') || 0);
      const oneHourMs = 60 * 60 * 1000;

      // 4-second buzzer plays every 1 hour
      if (!lastPlayed || now - lastPlayed >= oneHourMs) {
        playDangerAlarm(4).then((success) => {
          if (success) {
            sessionStorage.setItem('cancellation_alert_last_played', String(now));
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
  }, [hasUnconfirmedDanger]);

  // Mark Booked / Confirm mutations
  const markHotelBookedMutation = useMutation({
    mutationFn: async ({ bookingId, accId }: { bookingId: string; accId: string }) => {
      await apiClient.patch(`/bookings/${bookingId}/accommodations/${accId}/mark-booked`);
    },
    onSuccess: () => {
      stopDangerAlarm();
      toast.success('Hotel marked booked! Free cancellation date cleared.');
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to mark hotel booked');
    },
  });

  const markTransferBookedMutation = useMutation({
    mutationFn: async ({ bookingId, transportId }: { bookingId: string; transportId: string }) => {
      await apiClient.patch(`/bookings/${bookingId}/transports/${transportId}/mark-booked`);
    },
    onSuccess: () => {
      stopDangerAlarm();
      toast.success('Transfer marked booked! Free cancellation date cleared.');
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to mark transfer booked');
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'CONFIRMED' });
    },
    onSuccess: () => {
      stopDangerAlarm();
      toast.success('Booking confirmed! Buzzer alarm silenced.');
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to confirm booking');
    },
  });

  const handleTestAlarm = async () => {
    await unlockAudioContext();
    const played = await playDangerAlarm(4);
    if (played) {
      toast.success('🚨 4-Second Danger Buzzer is sounding!');
    } else {
      toast.warning('Audio autoplay blocked by browser. Click anywhere on the page and try again.');
    }
  };

  const totalCount = data?.counts?.total || 0;

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-xs animate-pulse">
        <div className="h-6 bg-secondary/80 rounded w-1/3 mb-2" />
        <div className="h-4 bg-secondary/50 rounded w-1/2" />
      </div>
    );
  }

  // If there are NO danger items, show a clean, compact all-clear card with a link to the dedicated page
  if (dangerItems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">
              No Urgent Cancellation Deadlines (≤ 5 Days)
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              All upcoming hotel and transport cancellation deadlines are safe.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/cancellation-deadlines')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>View All Deadlines ({totalCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-rose-500/30 dark:border-rose-500/40 rounded-2xl shadow-sm overflow-hidden mb-6 transition-all ring-1 ring-rose-500/20">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-rose-500/10 via-card to-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs animate-bounce">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                {dangerItems.length} URGENT (≤ 5 DAYS)
              </span>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {hasUnconfirmedDanger
                  ? `${unconfirmedDangerItems.length} Pending Confirmation`
                  : 'All Confirmed (Buzzer Silent)'}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              Urgent Free Cancellation Hotels &amp; Transportation
            </h3>
          </div>
        </div>

        {/* Action Controls & Navigation Link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestAlarm}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              hasUnconfirmedDanger
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs animate-pulse ring-2 ring-rose-500/30'
                : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
            }`}
            title="Test 4-Second Danger Buzzer Sound"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{hasUnconfirmedDanger ? 'Sound Buzzer (Test)' : 'Test Buzzer'}</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
            title="Refresh deadlines"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/cancellation-deadlines')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
            title="Go to dedicated cancellation deadlines page"
          >
            <span>View All Deadlines ({totalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table Content - ONLY DANGER ITEMS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Service &amp; Booking</th>
              <th className="py-2.5 px-3">Guest / Customer</th>
              <th className="py-2.5 px-3">Supplier / Vendor</th>
              <th className="py-2.5 px-3">Travel Dates</th>
              <th className="py-2.5 px-3">Cancellation Deadline</th>
              <th className="py-2.5 px-3 text-center">Urgency / Days Left</th>
              <th className="py-2.5 px-3 text-center">Admin Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {dangerItems.map((item) => {
              const cancelDate = new Date(item.lastCancellationDate);
              const isHotel = item.serviceType === 'HOTEL';

              return (
                <tr
                  key={`${item.serviceType}-${item.id}`}
                  className="bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  {/* Service & Booking Reference */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isHotel
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                        }`}
                      >
                        {isHotel ? <Hotel className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground line-clamp-1">{item.serviceName}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{item.serviceDetails}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                            className="font-mono text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                            title={`Open Booking ${item.bookingReference}`}
                          >
                            <span>{item.bookingReference}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase border bg-secondary/80 text-muted-foreground">
                            {item.bookingStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Guest / Customer */}
                  <td className="py-3 px-3 align-middle">
                    <div className="font-semibold text-foreground">{item.customerName}</div>
                    {item.customerPhone && (
                      <div className="text-[11px] text-muted-foreground font-mono">{item.customerPhone}</div>
                    )}
                    <div className="text-[10px] text-muted-foreground">Agent: {item.agentName}</div>
                  </td>

                  {/* Supplier / Vendor */}
                  <td className="py-3 px-3 align-middle">
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{item.vendorName}</span>
                    </div>
                    {item.confirmationNumber && (
                      <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-0.5">
                        Conf: {item.confirmationNumber}
                      </div>
                    )}
                  </td>

                  {/* Travel Dates */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <div>
                      <div className="font-medium text-foreground">
                        {new Date(item.travelDates.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {isHotel ? (
                          <>
                            to{' '}
                            {new Date(item.travelDates.endDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </>
                        ) : (
                          item.travelDates.departureTime || 'Time N/A'
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cancellation Deadline */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <div className="font-bold text-foreground">
                      {cancelDate.toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'Europe/London',
                      })}
                    </div>
                    <div className="text-[10.5px] text-muted-foreground font-mono">
                      {cancelDate.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Europe/London',
                      })}{' '}
                      UK
                    </div>
                  </td>

                  {/* Urgency Badge */}
                  <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs animate-pulse">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {item.daysRemaining <= 0 ? 'EXPIRES TODAY' : `${item.daysRemaining}d REMAINING`}
                    </span>
                  </td>

                  {/* Admin Confirmation Status */}
                  <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                    {item.isConfirmed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                        className="px-2.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        title={`Open Booking ${item.bookingReference} detail directly`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Booking</span>
                      </button>

                      {isAdmin && !item.isConfirmed && (
                        <button
                          type="button"
                          onClick={() => confirmBookingMutation.mutate(item.bookingId)}
                          disabled={confirmBookingMutation.isPending}
                          className="px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          title="Confirm Booking (permanently silences buzzer sound)"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>
                      )}

                      {!item.isConfirmed && (
                        <button
                          type="button"
                          onClick={() => {
                            if (isHotel) {
                              markHotelBookedMutation.mutate({ bookingId: item.bookingId, accId: item.id });
                            } else {
                              markTransferBookedMutation.mutate({ bookingId: item.bookingId, transportId: item.id });
                            }
                          }}
                          disabled={markHotelBookedMutation.isPending || markTransferBookedMutation.isPending}
                          className="p-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          title={`Mark ${isHotel ? 'Hotel' : 'Transfer'} as Booked (removes free cancellation date)`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border bg-card/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Showing only <strong>Danger</strong> bookings (≤ 5 days remaining).
        </span>
        <button
          type="button"
          onClick={() => navigate('/cancellation-deadlines')}
          className="text-primary hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Open Full Free Cancellation Dashboard ({totalCount} Total)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
