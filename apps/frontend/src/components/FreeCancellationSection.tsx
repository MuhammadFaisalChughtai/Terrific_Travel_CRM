import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { toast } from 'sonner';
import {
  Hotel,
  Car,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bell,
  BellOff,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  Building2,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from '../utils/dangerAlarmAudio';

export interface CancellationItem {
  id: string;
  serviceType: 'HOTEL' | 'TRANSPORT';
  bookingId: string;
  bookingReference: string;
  bookingStatus: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  agentName: string;
  vendorId?: string | null;
  vendorName: string;
  serviceName: string;
  serviceDetails: string;
  travelDates: {
    startDate: string;
    endDate: string;
    checkInTime?: string;
    checkOutTime?: string;
    departureTime?: string;
    arrivalTime?: string;
  };
  price: number;
  currency: string;
  lastCancellationDate: string;
  daysRemaining: number;
  hoursRemaining: number;
  isExpired: boolean;
  urgencyLevel: 'DANGER' | 'WARNING' | 'OK' | 'EXPIRED';
  isConfirmed: boolean;
  adminConfirmationStatus: 'CONFIRMED' | 'PENDING';
  confirmationNumber?: string | null;
  externalUrl?: string | null;
}

interface FreeCancellationSectionProps {
  onOpenBooking: (bookingId: string, bookingRef?: string) => void;
  isAdmin?: boolean;
}

interface SnoozeRecord {
  snoozedUntil: number; // timestamp ms
  initialUrgency: 'DANGER' | 'WARNING' | 'OK' | 'EXPIRED';
}

const SNOOZE_STORAGE_KEY = 'tms_cancellation_snoozes';

export default function FreeCancellationSection({
  onOpenBooking,
  isAdmin = false,
}: FreeCancellationSectionProps) {
  const queryClient = useQueryClient();

  // Filters state - defaults to DANGER (within 5 days only)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'HOTEL' | 'TRANSPORT'>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'DANGER' | 'WARNING' | 'OK'>('DANGER');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED'>('ALL');
  const [snoozeFilter, setSnoozeFilter] = useState<'ALL' | 'ACTIVE' | 'SNOOZED'>('ALL');

  // Open snooze dropdown for specific item
  const [activeSnoozeMenuId, setActiveSnoozeMenuId] = useState<string | null>(null);

  // Snoozes state backed by localStorage
  const [snoozes, setSnoozes] = useState<Record<string, SnoozeRecord>>(() => {
    try {
      const saved = localStorage.getItem(SNOOZE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current timestamp tick to re-evaluate remaining snooze times
  const [nowMs, setNowMs] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Save snoozes to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(SNOOZE_STORAGE_KEY, JSON.stringify(snoozes));
    } catch (e) {
      console.error('Failed to save cancellation snoozes', e);
    }
  }, [snoozes]);

  // Fetch cancellation deadlines list
  const { data, isLoading, refetch, isRefetching } = useQuery<{
    items: CancellationItem[];
    counts: {
      total: number;
      danger: number;
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
    refetchInterval: 60000, // Automatic live update every 60s
  });

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
      toast.success('Booking confirmed by administrator! Alarm silenced.');
      queryClient.invalidateQueries({ queryKey: ['cancellation-deadlines'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to confirm booking');
    },
  });

  // Snooze handler
  const handleSnooze = (item: CancellationItem, durationMinutes: number) => {
    const until = Date.now() + durationMinutes * 60 * 1000;
    setSnoozes((prev) => ({
      ...prev,
      [item.id]: {
        snoozedUntil: until,
        initialUrgency: item.urgencyLevel,
      },
    }));
    setActiveSnoozeMenuId(null);
    const durationLabel =
      durationMinutes >= 1440
        ? `${Math.round(durationMinutes / 1440)} day(s)`
        : `${Math.round(durationMinutes / 60)} hour(s)`;
    toast.info(`Reminder for ${item.bookingReference} snoozed for ${durationLabel}.`);
  };

  const handleClearSnooze = (itemId: string) => {
    setSnoozes((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
    setActiveSnoozeMenuId(null);
    toast.success('Reminder resumed.');
  };

  // Unconfirmed danger bookings (cancellation deadline within 5 days, not yet confirmed by admin)
  const unconfirmedDangerItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(
      (item) => item.urgencyLevel === 'DANGER' && !item.isConfirmed && !item.isExpired && item.daysRemaining >= 0
    );
  }, [data?.items]);

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

  const handleTestAlarm = async () => {
    await unlockAudioContext();
    const played = await playDangerAlarm(4);
    if (played) {
      toast.success('🚨 4-Second Danger Buzzer is sounding!');
    } else {
      toast.warning('Audio autoplay blocked by browser. Click anywhere on the page and try again.');
    }
  };

  // Helper to check if an item is actively snoozed
  // Note requirement 4: Automatically resume reminders when snooze period ends OR urgency increases!
  const getItemSnoozeInfo = (item: CancellationItem) => {
    const record = snoozes[item.id];
    if (!record) return { isSnoozed: false, remainingMinutes: 0 };

    // If urgency increased (e.g. from WARNING to DANGER), automatically resume reminder
    if (record.initialUrgency === 'WARNING' && item.urgencyLevel === 'DANGER') {
      return { isSnoozed: false, remainingMinutes: 0, escalated: true };
    }

    if (record.snoozedUntil > nowMs) {
      const remainingMinutes = Math.ceil((record.snoozedUntil - nowMs) / (60 * 1000));
      return { isSnoozed: true, remainingMinutes };
    }

    return { isSnoozed: false, remainingMinutes: 0 };
  };

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((item) => {
      // Never show already passed or expired cancellation deadlines
      if (item.isExpired || item.daysRemaining < 0) return false;

      // Type filter
      if (typeFilter !== 'ALL' && item.serviceType !== typeFilter) return false;

      // Urgency filter
      if (urgencyFilter !== 'ALL' && item.urgencyLevel !== urgencyFilter) return false;

      // Confirmation filter
      if (statusFilter === 'CONFIRMED' && !item.isConfirmed) return false;
      if (statusFilter === 'PENDING' && item.isConfirmed) return false;

      // Snooze filter
      const snoozeInfo = getItemSnoozeInfo(item);
      if (snoozeFilter === 'SNOOZED' && !snoozeInfo.isSnoozed) return false;
      if (snoozeFilter === 'ACTIVE' && snoozeInfo.isSnoozed) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          item.bookingReference.toLowerCase().includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          item.customerPhone.toLowerCase().includes(q) ||
          item.vendorName.toLowerCase().includes(q) ||
          item.serviceName.toLowerCase().includes(q) ||
          item.serviceDetails.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [data?.items, typeFilter, urgencyFilter, statusFilter, snoozeFilter, searchQuery, nowMs, snoozes]);

  // Overall counts including live snoozes
  const liveSnoozeCount = useMemo(() => {
    if (!data?.items) return 0;
    return data.items.filter((i) => getItemSnoozeInfo(i).isSnoozed).length;
  }, [data?.items, snoozes, nowMs]);

  const rawCounts = data?.counts || {
    total: 0,
    danger: 0,
    warning: 0,
    ok: 0,
    expired: 0,
    hotels: 0,
    transports: 0,
    pendingConfirmation: 0,
    confirmed: 0,
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6 transition-all">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-card via-secondary/20 to-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                Free Cancellation Hotels &amp; Transportation
                {rawCounts.danger > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                    {rawCounts.danger} URGENT
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Centralized monitoring for free cancellation deadlines, automated color-coded urgency, and 1-click booking access.
              </p>
            </div>
          </div>
        </div>

        {/* Sound Alarm & Quick Refresh */}
        <div className="flex items-center gap-2">
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors cursor-pointer"
            title="Refresh deadlines"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 sm:p-4 bg-secondary/15 border-b border-border">
        {/* Danger - Within 5 Days */}
        <button
          type="button"
          onClick={() => {
            setUrgencyFilter('DANGER');
            setStatusFilter('ALL');
            setSnoozeFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            urgencyFilter === 'DANGER' && statusFilter === 'ALL' && snoozeFilter === 'ALL'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 shadow-xs ring-2 ring-rose-400/40'
              : 'bg-card/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full bg-rose-600 ${hasUnconfirmedDanger ? 'animate-ping' : ''}`} />
            🔴 Danger (&le; 5 Days)
          </div>
          <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{rawCounts.danger}</div>
          <div className="text-[9.5px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">
            {hasUnconfirmedDanger
              ? `${unconfirmedDangerItems.length} Pending (Buzzer active)`
              : 'All Confirmed (Buzzer silent)'}
          </div>
        </button>

        {/* Warning - 6 to 10 Days */}
        <button
          type="button"
          onClick={() => {
            setUrgencyFilter('WARNING');
            setStatusFilter('ALL');
            setSnoozeFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            urgencyFilter === 'WARNING' && statusFilter === 'ALL' && snoozeFilter === 'ALL'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 shadow-xs ring-2 ring-amber-400/40'
              : 'bg-card/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
            🟡 Warning (6–10 Days)
          </div>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{rawCounts.warning}</div>
          <div className="text-[9.5px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">Upcoming deadline</div>
        </button>

        {/* OK - Safe (> 10 Days) */}
        <button
          type="button"
          onClick={() => {
            setUrgencyFilter('OK');
            setStatusFilter('ALL');
            setSnoozeFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            urgencyFilter === 'OK' && statusFilter === 'ALL' && snoozeFilter === 'ALL'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 shadow-xs ring-2 ring-emerald-400/40'
              : 'bg-card/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
            🟢 Safe (&gt; 10 Days)
          </div>
          <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{rawCounts.ok}</div>
          <div className="text-[9.5px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">Ample time remaining</div>
        </button>

        {/* Total Upcoming */}
        <button
          type="button"
          onClick={() => {
            setUrgencyFilter('ALL');
            setStatusFilter('ALL');
            setSnoozeFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            urgencyFilter === 'ALL' && statusFilter === 'ALL' && snoozeFilter === 'ALL'
              ? 'bg-card border-primary/50 shadow-xs ring-2 ring-primary/40'
              : 'bg-card/60 hover:bg-card border-border'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-muted-foreground">All Deadlines</div>
          <div className="text-lg font-extrabold text-foreground mt-0.5">{rawCounts.total}</div>
          <div className="text-[9.5px] text-muted-foreground mt-0.5">{rawCounts.hotels} Hotels &bull; {rawCounts.transports} Transports</div>
        </button>

        {/* Pending Confirmation */}
        <button
          type="button"
          onClick={() => {
            setStatusFilter('PENDING');
            setUrgencyFilter('ALL');
            setSnoozeFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-card border-amber-500 shadow-xs ring-1 ring-amber-500/30'
              : 'bg-card/60 hover:bg-card border-border'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Confirm
          </div>
          <div className="text-lg font-extrabold text-foreground mt-0.5">{rawCounts.pendingConfirmation}</div>
          <div className="text-[9.5px] text-muted-foreground mt-0.5">Awaiting admin review</div>
        </button>

        {/* Snoozed */}
        <button
          type="button"
          onClick={() => {
            setSnoozeFilter('SNOOZED');
            setUrgencyFilter('ALL');
            setStatusFilter('ALL');
          }}
          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            snoozeFilter === 'SNOOZED'
              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 shadow-xs ring-1 ring-sky-400/30'
              : 'bg-card/60 hover:bg-card border-border'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <BellOff className="w-3 h-3" />
            Snoozed Reminders
          </div>
          <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">{liveSnoozeCount}</div>
          <div className="text-[9.5px] text-muted-foreground mt-0.5">Temporarily muted</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 border-b border-border bg-card/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by passenger, TT reference, hotel, route, or vendor..."
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Service Type */}
          <div className="flex bg-secondary/60 p-0.5 rounded-xl border border-border">
            {(['ALL', 'HOTEL', 'TRANSPORT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'ALL' ? 'All Services' : t === 'HOTEL' ? 'Hotels' : 'Transfers'}
              </button>
            ))}
          </div>

          {/* Urgency */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value as any)}
            className="text-[11px] font-semibold py-1 px-2.5 bg-secondary/60 border border-border rounded-xl text-foreground focus:outline-none cursor-pointer"
          >
            <option value="DANGER">🔴 Within 5 Days (Urgent)</option>
            <option value="WARNING">🟡 6–10 Days (Warning)</option>
            <option value="OK">🟢 &gt;10 Days (Safe)</option>
            <option value="ALL">All Upcoming Deadlines</option>
          </select>

          {/* Admin Confirmation */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-[11px] font-semibold py-1 px-2.5 bg-secondary/60 border border-border rounded-xl text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Confirmations</option>
            <option value="PENDING">Pending Confirm</option>
            <option value="CONFIRMED">Admin Confirmed</option>
          </select>

          {/* Snooze Filter */}
          <select
            value={snoozeFilter}
            onChange={(e) => setSnoozeFilter(e.target.value as any)}
            className="text-[11px] font-semibold py-1 px-2.5 bg-secondary/60 border border-border rounded-xl text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Reminders</option>
            <option value="ACTIVE">Active Alerts</option>
            <option value="SNOOZED">Snoozed</option>
          </select>
        </div>
      </div>

      {/* Main Table Content */}
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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground italic">
                  Loading free cancellation bookings...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                  <p className="font-semibold text-sm text-foreground">No bookings match the selected filters</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All upcoming hotel and transport cancellation deadlines are in order.
                  </p>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const cancelDate = new Date(item.lastCancellationDate);
                const isHotel = item.serviceType === 'HOTEL';
                const snoozeInfo = getItemSnoozeInfo(item);

                // Row background tint based on urgency
                const rowTint =
                  item.urgencyLevel === 'DANGER'
                    ? 'bg-rose-50/40 dark:bg-rose-950/15 hover:bg-rose-50 dark:hover:bg-rose-950/25'
                    : item.urgencyLevel === 'WARNING'
                    ? 'bg-amber-50/30 dark:bg-amber-950/10 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                    : item.urgencyLevel === 'EXPIRED'
                    ? 'bg-slate-100/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                    : 'hover:bg-secondary/40';

                return (
                  <tr key={`${item.serviceType}-${item.id}`} className={`transition-colors ${rowTint}`}>
                    {/* Service & Booking Reference */}
                    <td className="py-3 px-3 align-middle">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            isHotel
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
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
                      {isHotel ? (
                        <div>
                          <div className="font-medium text-foreground">
                            {new Date(item.travelDates.startDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            to{' '}
                            {new Date(item.travelDates.endDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-foreground">
                            {new Date(item.travelDates.startDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.travelDates.departureTime || 'Time N/A'}
                          </div>
                        </div>
                      )}
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
                      {item.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          DEADLINE PASSED
                        </span>
                      ) : item.urgencyLevel === 'DANGER' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs animate-pulse">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {item.daysRemaining <= 0 ? 'EXPIRES TODAY' : `${item.daysRemaining}d REMAINING`}
                        </span>
                      ) : item.urgencyLevel === 'WARNING' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-amber-950 border border-amber-600/30">
                          <Clock className="w-3 h-3 shrink-0" />
                          {item.daysRemaining}d REMAINING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          {item.daysRemaining}d REMAINING
                        </span>
                      )}

                      {/* Snooze tag if active */}
                      {snoozeInfo.isSnoozed && (
                        <div className="mt-1 flex items-center justify-center gap-1 text-[9.5px] text-sky-600 dark:text-sky-400 font-bold">
                          <BellOff className="w-2.5 h-2.5" />
                          <span>Snoozed ({snoozeInfo.remainingMinutes}m)</span>
                        </div>
                      )}
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
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 relative">
                        {/* 1-Click Open Booking (Requirement 3) */}
                        <button
                          type="button"
                          onClick={() => onOpenBooking(item.bookingId, item.bookingReference)}
                          className="px-2.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          title={`Open Booking ${item.bookingReference} detail directly`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Booking</span>
                        </button>

                        {/* Open in new tab option */}
                        <button
                          type="button"
                          onClick={() => window.open(`/bookings?bookingId=${item.bookingId}&ref=${item.bookingReference}`, '_blank')}
                          className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                          title="Open booking in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {/* Snooze Menu Toggle */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSnoozeMenuId(activeSnoozeMenuId === item.id ? null : item.id)
                            }
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              snoozeInfo.isSnoozed
                                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 text-sky-600 dark:text-sky-400'
                                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                            title="Snooze deadline reminder"
                          >
                            <BellOff className="w-3.5 h-3.5" />
                          </button>

                          {/* Snooze Popup Dropdown */}
                          {activeSnoozeMenuId === item.id && (
                            <div className="absolute right-0 top-full mt-1.5 z-40 bg-popover border border-border rounded-xl shadow-xl py-1 w-44 text-left">
                              <div className="px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60">
                                Snooze Reminders
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSnooze(item, 60)}
                                className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary flex items-center justify-between cursor-pointer"
                              >
                                <span>Snooze 1 Hour</span>
                                <span className="text-[10px] text-muted-foreground">1h</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSnooze(item, 1440)}
                                className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary flex items-center justify-between cursor-pointer"
                              >
                                <span>Snooze 24 Hours</span>
                                <span className="text-[10px] text-muted-foreground">1d</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSnooze(item, 4320)}
                                className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary flex items-center justify-between cursor-pointer"
                              >
                                <span>Snooze 3 Days</span>
                                <span className="text-[10px] text-muted-foreground">3d</span>
                              </button>
                              {snoozeInfo.isSnoozed && (
                                <button
                                  type="button"
                                  onClick={() => handleClearSnooze(item.id)}
                                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-border/60 flex items-center gap-1 cursor-pointer font-semibold"
                                >
                                  <Bell className="w-3 h-3" />
                                  <span>Resume Reminder</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Admin Action: Confirm Booking (Permanently silences buzzer) */}
                        {isAdmin && !item.isConfirmed && (
                          <button
                            type="button"
                            onClick={() => confirmBookingMutation.mutate(item.bookingId)}
                            disabled={confirmBookingMutation.isPending}
                            className="px-2 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            title="Confirm Booking (permanently silences buzzer sound)"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {/* Mark Hotel / Transfer Booked */}
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-border bg-card/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Showing {filteredItems.length} of {data?.items?.length || 0} recorded free cancellation deadlines
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600" /> &le;5d Danger
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 6-10d Warning
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;10d OK
          </span>
        </span>
      </div>
    </div>
  );
}
