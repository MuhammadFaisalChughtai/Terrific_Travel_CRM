import React, { useState, useMemo } from 'react';
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
  Clock,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
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

interface MissingHotelConfirmationsSectionProps {
  onOpenBooking?: (bookingId: string, bookingRef?: string) => void;
  isAdmin?: boolean;
}

export default function MissingHotelConfirmationsSection({
  onOpenBooking,
  isAdmin = false,
}: MissingHotelConfirmationsSectionProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'TODAY' | 'TOMORROW' | 'NEXT_5_DAYS'>('ALL');
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

  const allItems = data?.items || [];
  const counts = data?.counts || { total: 0, today: 0, tomorrow: 0, soon: 0 };

  // Mutation to save hotel confirmation number (HCN)
  const saveHcnMutation = useMutation({
    mutationFn: async ({ id, confirmationNumber }: { id: string; confirmationNumber: string }) => {
      const res = await apiClient.patch(`/dashboard/hotel-confirmation/${id}`, {
        hotelConfirmationNumber: confirmationNumber,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Hotel confirmation number added successfully! Removed from alert list.');
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
      setSavingId(null);
      queryClient.invalidateQueries({ queryKey: ['missing-hotel-confirmations'] });
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
      queryClient.invalidateQueries({ queryKey: ['booking-manager'] });

      if (allItems.length <= 1) {
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

  // Filtered items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Urgency filter
      if (filterUrgency !== 'ALL' && item.urgencyTag !== filterUrgency) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesHotel = item.hotelName.toLowerCase().includes(q);
        const matchesCity = item.city?.toLowerCase().includes(q) || false;
        const matchesGuest = item.customerName.toLowerCase().includes(q);
        const matchesRef = item.bookingReference.toLowerCase().includes(q);
        const matchesAgent = item.agentName.toLowerCase().includes(q);
        if (!matchesHotel && !matchesCity && !matchesGuest && !matchesRef && !matchesAgent) {
          return false;
        }
      }
      return true;
    });
  }, [allItems, filterUrgency, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Missing Confirmations
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{counts.total}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Check-in ≤ 5 Days</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Hotel className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
              Check-in Today
            </p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{counts.today}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Critical Emergency</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-600 text-white shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Check-in Tomorrow
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{counts.tomorrow}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">High Priority</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-card border border-border rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Check-in 2-5 Days
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{counts.soon}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Upcoming Deadlines</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary text-foreground border border-border">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-card border-2 border-rose-500/30 dark:border-rose-500/40 rounded-2xl shadow-xs overflow-hidden transition-all ring-1 ring-rose-500/20">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-rose-500/10 via-card to-card flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                  {allItems.length} MISSING CONFIRMATIONS
                </span>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  {allItems.length > 0 ? 'Danger Buzzer Active' : 'All Confirmed'}
                </span>
              </div>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                Missing Hotel Confirmation Numbers (HCN)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hotels with check-in within 5 days requiring an official Hotel Confirmation Number. Enter HCN to clear from alerts.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestSound}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
              title="Test 4-second danger buzzer sound"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Buzzer</span>
            </button>

            <button
              type="button"
              onClick={handleSnooze}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
              title="Snooze buzzer for 1 hour"
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Snooze 1h</span>
            </button>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by hotel, guest, booking ref, or agent..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Urgency Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilterUrgency('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterUrgency === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterUrgency('TODAY')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterUrgency === 'TODAY'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              Today ({counts.today})
            </button>
            <button
              type="button"
              onClick={() => setFilterUrgency('TOMORROW')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterUrgency === 'TOMORROW'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              Tomorrow ({counts.tomorrow})
            </button>
            <button
              type="button"
              onClick={() => setFilterUrgency('NEXT_5_DAYS')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterUrgency === 'NEXT_5_DAYS'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
              }`}
            >
              2-5 Days ({counts.soon})
            </button>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            Loading missing hotel confirmations...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">
              {allItems.length === 0
                ? 'All Upcoming Hotels Confirmed!'
                : 'No hotels match your search criteria'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              {allItems.length === 0
                ? 'No bookings within the next 5 days are missing their hotel confirmation number.'
                : 'Try clearing the search query or changing urgency filters.'}
            </p>
          </div>
        ) : (
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
                {filteredItems.map((item) => {
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
                          onClick={() => onOpenBooking?.(item.bookingId, item.bookingReference)}
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

                          {onOpenBooking && (
                            <button
                              type="button"
                              onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                              className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-all cursor-pointer border border-border"
                              title="View full booking"
                            >
                              <Eye className="w-3.5 h-3.5" />
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
        )}
      </div>
    </div>
  );
}
