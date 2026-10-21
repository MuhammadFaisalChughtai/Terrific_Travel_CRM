import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Calendar,
  Save,
  Clock,
  Sparkles,
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
    refetchInterval: 60000,
  });

  const items = data?.items || [];
  const hasUrgentMissing = items.length > 0;

  // 4-second electric alarm buzzer plays every 1 hour while unconfirmed hotels remain
  useEffect(() => {
    if (!hasUrgentMissing) {
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
    const interval = setInterval(checkAndPlay, 30000); // Check periodic condition every 30s
    return () => clearInterval(interval);
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
      toast.success('Hotel confirmation number added successfully! Removed from alerts.');
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

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-rose-950/40 via-red-950/20 to-slate-900/40 border-2 border-red-500/40 p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in duration-300">
      {/* Background glowing danger pulse */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
            <Hotel className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Missing Hotel Confirmation Alerts
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/40">
                  Check-in ≤ 5 Days
                </span>
              </h3>
            </div>
            <p className="text-xs text-red-200/80 mt-0.5">
              Urgent: Hotel confirmation number (HCN) is missing. Buzzer active until HCN is entered.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestSound}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 bg-red-950/60 hover:bg-red-900/60 border border-red-700/50 rounded-lg transition-all shadow-sm"
            title="Test 4-second danger buzzer"
          >
            <Volume2 className="w-3.5 h-3.5 text-red-400" />
            Test Buzzer
          </button>

          <button
            type="button"
            onClick={handleSnooze}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all shadow-sm"
            title="Snooze buzzer for 1 hour"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Snooze 1h
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg transition-all"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="flex flex-wrap items-center gap-2 my-3 text-xs">
        <span className="font-semibold text-red-400 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          Urgent Action Required:
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 font-medium">
          Total: <strong className="text-white font-bold">{data?.counts?.total ?? items.length}</strong>
        </span>
        {(data?.counts?.today ?? 0) > 0 && (
          <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white font-bold animate-pulse shadow-sm">
            Check-in TODAY: {data?.counts?.today}
          </span>
        )}
        {(data?.counts?.tomorrow ?? 0) > 0 && (
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold">
            Check-in TOMORROW: {data?.counts?.tomorrow}
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-3 mt-3">
        {items.map((item) => {
          const currentInput = inputValues[item.id] !== undefined ? inputValues[item.id] : '';
          const isSaving = savingId === item.id;
          const checkInFormatted = new Date(item.checkInDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={item.id}
              className="rounded-xl bg-slate-900/90 border border-red-500/30 p-4 transition-all hover:border-red-500/60 hover:shadow-lg shadow-black/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Column: Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {/* Countdown Badge */}
                  {item.daysUntilCheckIn === 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                      🚨 Check-in TODAY
                    </span>
                  ) : item.daysUntilCheckIn === 1 ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-500/40 text-red-200 border border-red-500/60 text-[11px] font-bold uppercase tracking-wider">
                      ⚠️ Check-in Tomorrow
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                      Check-in in {item.daysUntilCheckIn} Days
                    </span>
                  )}

                  {/* Booking Reference Pill (Clickable) */}
                  <button
                    type="button"
                    onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 text-xs font-mono font-bold transition-colors"
                    title="View full booking"
                  >
                    <span>{item.bookingReference}</span>
                    <Eye className="w-3 h-3 ml-0.5 opacity-70" />
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    Agent: <span className="text-slate-200 font-semibold">{item.agentName}</span>
                  </span>
                </div>

                {/* Hotel & Guest Details */}
                <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                  <Building2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">{item.hotelName}</span>
                  {item.city && <span className="text-slate-400 text-xs font-normal">({item.city})</span>}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                  <span>
                    Guest: <strong className="text-slate-200">{item.customerName}</strong>
                    {item.customerPhone && <span className="text-slate-400"> ({item.customerPhone})</span>}
                  </span>
                  <span>
                    Room: <strong className="text-slate-300">{item.roomType}</strong>
                  </span>
                  <span>
                    Check-in: <strong className="text-red-300">{checkInFormatted}</strong>
                  </span>
                </div>
              </div>

              {/* Right Column: Quick HCN Input & Save Button */}
              <div className="flex items-center gap-2 shrink-0 bg-slate-950/60 p-2 rounded-xl border border-red-500/20">
                <div className="relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) =>
                      setInputValues((prev) => ({ ...prev, [item.id]: e.target.value.toUpperCase() }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveHcn(item.id);
                    }}
                    placeholder="Enter HCN / Conf #"
                    className="w-48 sm:w-56 px-3 py-2 text-xs font-mono font-bold bg-slate-900 border border-red-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    disabled={isSaving}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveHcn(item.id)}
                  disabled={isSaving || !currentInput.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md shadow-emerald-700/30 transition-all shrink-0"
                  title="Save Hotel Confirmation Number and silence buzzer"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Save HCN
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
