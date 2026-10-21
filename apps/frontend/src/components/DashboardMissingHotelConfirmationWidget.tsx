import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { toast } from 'sonner';
import {
  Hotel,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Building2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from '../utils/dangerAlarmAudio';

export interface MissingHotelConfirmationItem {
  id: string; // accommodationId
  bookingId: string;
  bookingReference: string;
  bookingStatus: string;
  hotelName: string;
  city?: string | null;
  roomType: string;
  mealType?: string | null;
  checkInDate: string;
  checkOutDate: string;
  daysUntilCheckIn: number;
  hoursUntilCheckIn: number;
  urgencyTag: 'TODAY' | 'TOMORROW' | 'NEXT_5_DAYS';
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  agentName: string;
  agentId?: string | null;
  vendorName?: string | null;
  price: number;
  currency: string;
  hotelConfirmationNumber?: string | null;
}

interface DashboardMissingHotelConfirmationWidgetProps {
  onOpenBooking: (bookingId: string, bookingRef?: string) => void;
  isAdmin?: boolean;
}

export default function DashboardMissingHotelConfirmationWidget({
  onOpenBooking,
  isAdmin = false,
}: DashboardMissingHotelConfirmationWidgetProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery<{
    items: MissingHotelConfirmationItem[];
    counts: { total: number; today: number; tomorrow: number; soon: number };
  }>({
    queryKey: ['missing-hotel-confirmations'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard/missing-hotel-confirmations');
      return res.data.data;
    },
    refetchInterval: 30000,
  });

  const items = data?.items || [];
  const hasUrgentMissing = items.length > 0;

  // Strict buzzer logic:
  // 4-second electric alarm buzzer plays on load/interaction and repeats every 1 hour
  // as long as unconfirmed hotels remain with check-in <= 5 days.
  useEffect(() => {
    if (!hasUrgentMissing) {
      stopDangerAlarm();
      return;
    }

    const checkAndPlay = () => {
      const now = Date.now();
      const snoozeUntil = Number(localStorage.getItem('hotel_hcn_alert_snooze') || 0);
      if (snoozeUntil > now) return;

      const lastPlayed = Number(sessionStorage.getItem('hotel_hcn_alert_last_played') || 0);
      const oneHourMs = 60 * 60 * 1000;

      if (!lastPlayed || now - lastPlayed >= oneHourMs) {
        playDangerAlarm(4).then((success) => {
          if (success) {
            sessionStorage.setItem('hotel_hcn_alert_last_played', String(now));
          }
        });
      }
    };

    checkAndPlay();
    const interval = setInterval(checkAndPlay, 30000);

    // AudioContext unlock on first user interaction so strict buzzer plays immediately
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
  }, [hasUrgentMissing]);

  // Mutation to save hotel confirmation number (HCN)
  const saveHcnMutation = useMutation({
    mutationFn: async ({ id, confirmationNumber }: { id: string; confirmationNumber: string }) => {
      const res = await apiClient.patch(`/dashboard/hotel-confirmation/${id}`, {
        hotelConfirmationNumber: confirmationNumber,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Hotel confirmation number added successfully! Removed from dashboard.');
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
      setSavingId(null);
      // Invalidate queries so item immediately disappears
      queryClient.invalidateQueries({ queryKey: ['missing-hotel-confirmations'] });
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
      queryClient.invalidateQueries({ queryKey: ['booking-manager'] });

      // If this was the last item, stop the buzzer
      if (items.length <= 1) {
        stopDangerAlarm();
      }
    },
    onError: (err: any) => {
      setSavingId(null);
      toast.error(err?.response?.data?.message || 'Failed to save hotel confirmation number.');
    },
  });

  const handleSaveHcn = (id: string) => {
    const value = (inputValues[id] || '').trim();
    if (!value) {
      toast.error('Please enter the hotel confirmation number (HCN).');
      return;
    }
    setSavingId(id);
    saveHcnMutation.mutate({ id, confirmationNumber: value });
  };

  const handleSnooze = () => {
    const oneHourMs = 60 * 60 * 1000;
    localStorage.setItem('hotel_hcn_alert_snooze', String(Date.now() + oneHourMs));
    stopDangerAlarm();
    toast.info('Buzzer snoozed for 1 hour.');
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

  // If there are no missing hotels, do not clutter the dashboard
  if (!isLoading && items.length === 0) {
    return null;
  }

  // Strictly only show up to 5 items on the dashboard
  const displayedItems = items.slice(0, 5);

  return (
    <div className="bg-card border-2 border-rose-500/30 dark:border-rose-500/40 rounded-2xl shadow-sm overflow-hidden mb-6 transition-all ring-1 ring-rose-500/20">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-rose-500/10 via-card to-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs animate-bounce">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                {items.length} MISSING HCN (≤ 5 DAYS)
              </span>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {hasUrgentMissing ? 'Danger Buzzer Active' : 'All Confirmed'}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground mt-0.5">
              Missing Hotel Confirmation Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Check-in within 5 days. Enter Hotel Confirmation Number (HCN) to clear alert and silence buzzer.
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestSound}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs animate-pulse ring-2 ring-rose-500/30 transition-all cursor-pointer"
            title="Test 4-Second Danger Buzzer Sound"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound Buzzer (Test)</span>
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
            onClick={() => navigate('/hotels?tab=missing-confirmations')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
            title="View all missing confirmations in Hotels section"
          >
            <span>View in Hotels ({items.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table Content - ONLY TOP 5 ITEMS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Hotel &amp; Room</th>
              <th className="py-2.5 px-3">Booking Ref</th>
              <th className="py-2.5 px-3">Guest / Customer</th>
              <th className="py-2.5 px-3">Agent</th>
              <th className="py-2.5 px-3">Check-in Date</th>
              <th className="py-2.5 px-3 text-center">Urgency</th>
              <th className="py-2.5 px-3 text-right">Add Confirmation # (HCN)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {displayedItems.map((item) => {
              const currentInput = inputValues[item.id] !== undefined ? inputValues[item.id] : '';
              const isSaving = savingId === item.id;
              const checkInFormatted = new Date(item.checkInDate).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <tr
                  key={item.id}
                  className="bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  {/* Hotel & Room */}
                  <td className="py-3 px-3 align-middle">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground line-clamp-1">{item.hotelName}</div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {item.roomType} {item.city ? `• ${item.city}` : ''}
                        </p>
                        {item.vendorName && (
                          <p className="text-[10px] text-muted-foreground">Supplier: {item.vendorName}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Booking Ref */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                      className="font-mono text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                      title={`Open Booking ${item.bookingReference}`}
                    >
                      <span>{item.bookingReference}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                    <div className="text-[9.5px] px-1.5 py-0.2 rounded font-bold uppercase border bg-secondary/80 text-muted-foreground w-max mt-1">
                      {item.bookingStatus}
                    </div>
                  </td>

                  {/* Guest / Customer */}
                  <td className="py-3 px-3 align-middle">
                    <div className="font-semibold text-foreground">{item.customerName}</div>
                    {item.customerPhone && (
                      <div className="text-[11px] text-muted-foreground font-mono">{item.customerPhone}</div>
                    )}
                  </td>

                  {/* Agent */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <div className="font-medium text-foreground">{item.agentName}</div>
                  </td>

                  {/* Check-In Date */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <div className="font-bold text-foreground">{checkInFormatted}</div>
                    <div className="text-[10.5px] text-muted-foreground">
                      to{' '}
                      {new Date(item.checkOutDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </td>

                  {/* Urgency Badge */}
                  <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                    {item.daysUntilCheckIn === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-xs animate-pulse">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        CHECK-IN TODAY
                      </span>
                    ) : item.daysUntilCheckIn === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        TOMORROW
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-secondary text-foreground border border-border">
                        {item.daysUntilCheckIn} Days Left
                      </span>
                    )}
                  </td>

                  {/* Quick HCN Input & Save Action */}
                  <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) =>
                          setInputValues((prev) => ({
                            ...prev,
                            [item.id]: e.target.value.toUpperCase(),
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveHcn(item.id);
                        }}
                        placeholder="Enter HCN / Conf #"
                        className="w-36 sm:w-44 px-2.5 py-1.5 text-xs font-mono font-bold bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                        disabled={isSaving}
                      />

                      <button
                        type="button"
                        onClick={() => handleSaveHcn(item.id)}
                        disabled={isSaving || !currentInput.trim()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
                        title="Save Hotel Confirmation Number and silence buzzer"
                      >
                        {isSaving ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>Save HCN</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                        className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all cursor-pointer border border-border"
                        title="View full booking"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Banner when items > 5 */}
      {items.length > 5 && (
        <div className="p-3 bg-secondary/30 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground font-medium">
            Showing top <strong className="text-foreground">5</strong> of{' '}
            <strong className="text-rose-600 dark:text-rose-400 font-bold">{items.length}</strong> urgent unconfirmed hotels (≤ 5 days)
          </span>
          <button
            type="button"
            onClick={() => navigate('/hotels?tab=missing-confirmations')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>View remaining {items.length - 5} in Hotels Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
