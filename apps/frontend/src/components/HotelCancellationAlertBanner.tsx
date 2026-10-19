import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import {
  AlertTriangle,
  BellRing,
  Clock,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  Hotel,
  Car,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  playDangerAlarm,
  stopDangerAlarm,
  unlockAudioContext,
} from "../utils/dangerAlarmAudio";

export interface HotelCancellationAlert {
  id: string;
  bookingId: string;
  bookingReference: string;
  bookingStatus: string;
  hotelName: string;
  roomType: string;
  city?: string | null;
  checkInDate: string;
  checkOutDate: string;
  lastCancellationDate: string;
  daysLeft: number;
  hoursLeft: number;
  isOverdue: boolean;
  agentId?: string | null;
  agentName: string;
  customerName: string;
  customerPhone?: string;
  vendorName: string;
  price: number;
  currency: string;
}

export interface TransferCancellationAlert {
  id: string;
  bookingId: string;
  bookingReference: string;
  bookingStatus: string;
  vehicleType: string;
  departureDestination: string;
  arrivalDestination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  flightNo?: string | null;
  lastCancellationDate: string;
  daysLeft: number;
  hoursLeft: number;
  isOverdue: boolean;
  agentId?: string | null;
  agentName: string;
  customerName: string;
  customerPhone?: string;
  vendorName: string;
  price: number;
  currency: string;
}

interface HotelCancellationAlertBannerProps {
  onOpenBooking?: (bookingId: string) => void;
}

export default function HotelCancellationAlertBanner({
  onOpenBooking,
}: HotelCancellationAlertBannerProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const isAdminOrManager = useMemo(() => {
    if (!user?.roles) return false;
    return user.roles.some((r: any) => {
      const clean = (typeof r === "string" ? r : r?.name || "")
        .toUpperCase()
        .replace(/[\s_-]+/g, "");
      return ["ADMIN", "SUPERADMIN", "SUPER_ADMIN", "MANAGER", "BRANCHMANAGER"].includes(clean);
    });
  }, [user]);

  const [snoozeUntil, setSnoozeUntil] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("cancellation_alert_snooze") || 0);
    } catch {
      return 0;
    }
  });

  const [remainingSnoozeMinutes, setRemainingSnoozeMinutes] = useState<number>(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  // Poll hotel cancellation alerts every 30 seconds
  const { data: hotelAlerts = [] } = useQuery<HotelCancellationAlert[]>({
    queryKey: ["hotel-cancellation-alerts"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings/accommodations/cancellation-alerts");
      return res.data?.data || [];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Poll transfer cancellation alerts every 30 seconds
  const { data: transferAlerts = [] } = useQuery<TransferCancellationAlert[]>({
    queryKey: ["transfer-cancellation-alerts"],
    queryFn: async () => {
      const res = await apiClient.get("/bookings/transports/cancellation-alerts");
      return res.data?.data || [];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const totalAlertsCount = hotelAlerts.length + transferAlerts.length;

  // Track snooze countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      if (snoozeUntil > now) {
        setRemainingSnoozeMinutes(Math.ceil((snoozeUntil - now) / 60000));
      } else {
        setRemainingSnoozeMinutes(0);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 10000);
    return () => clearInterval(timer);
  }, [snoozeUntil]);

  // Audio trigger effect: plays danger sound every hour until confirmed or cancelled
  useEffect(() => {
    if (totalAlertsCount === 0) {
      stopDangerAlarm();
      return;
    }

    const checkAndPlayAlarm = () => {
      const now = Date.now();
      const currentSnooze = Number(localStorage.getItem("cancellation_alert_snooze") || 0);

      // If currently snoozed, do not play
      if (currentSnooze > now) {
        return;
      }

      // Check last played timestamp (play every hour: 3600000 ms)
      const lastPlayed = Number(sessionStorage.getItem("cancellation_alert_last_played") || 0);
      const oneHourMs = 60 * 60 * 1000;

      if (!lastPlayed || now - lastPlayed >= oneHourMs) {
        playDangerAlarm(6).then((played) => {
          if (played) {
            sessionStorage.setItem("cancellation_alert_last_played", String(now));
          }
        });
      }
    };

    // Run immediately and every 30 seconds check if hour boundary passed
    checkAndPlayAlarm();
    const interval = setInterval(checkAndPlayAlarm, 30000);

    // Unlock audio on first click or keydown in window and play if due
    const handleUserInteraction = () => {
      unlockAudioContext().then((unlocked) => {
        setIsAudioUnlocked(unlocked);
        if (unlocked) {
          checkAndPlayAlarm();
        }
      });
    };
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, [totalAlertsCount]);

  // Mutation: Mark Hotel Booked (Removes Free Cancellation Date)
  const markHotelBookedMutation = useMutation({
    mutationFn: async ({ bookingId, accommodationId }: { bookingId: string; accommodationId: string }) => {
      const res = await apiClient.patch(`/bookings/${bookingId}/accommodations/${accommodationId}/mark-booked`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Hotel marked as booked! Free cancellation deadline removed.");
      queryClient.invalidateQueries({ queryKey: ["hotel-cancellation-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      stopDangerAlarm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update hotel status.");
    },
  });

  // Mutation: Mark Transfer Booked (Removes Free Cancellation Date)
  const markTransferBookedMutation = useMutation({
    mutationFn: async ({ bookingId, transportId }: { bookingId: string; transportId: string }) => {
      const res = await apiClient.patch(`/bookings/${bookingId}/transports/${transportId}/mark-booked`);
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Transfer marked as booked! Free cancellation deadline removed.");
      queryClient.invalidateQueries({ queryKey: ["transfer-cancellation-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] });
      stopDangerAlarm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update transfer status.");
    },
  });

  // Mutation: Confirm Booking (Admin/Manager)
  const confirmBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await apiClient.patch(`/bookings/${bookingId}/status`, {
        status: "CONFIRMED",
      });
      return res.data;
    },
    onSuccess: (data, bookingId) => {
      toast.success(`Booking #${bookingId} confirmed! Services secured.`);
      queryClient.invalidateQueries({ queryKey: ["hotel-cancellation-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-cancellation-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      stopDangerAlarm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to confirm booking.");
    },
  });

  // Snooze handler (snoozes for 1 hour, not permanently stoppable)
  const handleSnooze = () => {
    stopDangerAlarm();
    const until = Date.now() + 60 * 60 * 1000;
    localStorage.setItem("cancellation_alert_snooze", String(until));
    setSnoozeUntil(until);
    setRemainingSnoozeMinutes(60);
    toast.info("Danger alarm sound snoozed for 1 hour. Active warning banner remains visible until booking is confirmed or services are marked booked.");
  };

  const handleTestSound = async () => {
    await unlockAudioContext();
    const played = await playDangerAlarm(3);
    if (played) {
      toast.success("Playing 3-second test of emergency danger siren.");
    } else {
      toast.warning("Audio blocked by browser. Please click again to activate audio.");
    }
  };

  if (totalAlertsCount === 0) {
    return null;
  }

  const isSnoozed = remainingSnoozeMinutes > 0;

  return (
    <div className="mb-4 rounded-xl border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/60 p-4 shadow-lg text-rose-950 dark:text-rose-100 animate-pulse-slow">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-300 dark:border-rose-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-600 text-white rounded-lg shadow-sm animate-bounce">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                DANGER ALERT · ACTION REQUIRED
              </span>
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                {totalAlertsCount} Service{totalAlertsCount > 1 ? "s" : ""} Free Cancellation Expiring (≤ 5 Days Left)
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-rose-900 dark:text-rose-100 mt-0.5">
              Urgent Hotel & Transfer Free Cancellation Deadlines Approaching!
            </h2>
          </div>
        </div>

        {/* Audio Control / Snooze Actions */}
        <div className="flex items-center gap-2">
          {isSnoozed ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold rounded-lg">
              <VolumeX className="w-3.5 h-3.5 text-amber-600" />
              <span>Alarm Snoozed ({remainingSnoozeMinutes}m left)</span>
            </div>
          ) : (
            <button
              onClick={handleSnooze}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              title="Snooze danger alarm sound for 1 hour"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Snooze Sound (1 Hr)</span>
            </button>
          )}

          <button
            onClick={handleTestSound}
            className="p-1.5 bg-rose-200 dark:bg-rose-900 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-800 dark:text-rose-200 rounded-lg text-xs transition-colors"
            title="Test Danger Alarm Sound"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notice info */}
      <div className="mt-2 text-xs text-rose-800 dark:text-rose-200 font-medium flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-600" />
        <span>
          Danger alarm plays every hour. Sound will only permanently stop when <strong>Admin confirms the booking</strong> or the agent clicks <strong>Hotel Booked / Transfer Booked</strong> to remove the cancellation deadline.
        </span>
      </div>

      {/* Alert list cards */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {/* Hotel Alerts */}
        {hotelAlerts.map((alert) => {
          const daysText =
            alert.daysLeft < 0
              ? `EXPIRED ${Math.abs(alert.daysLeft)} DAYS AGO`
              : alert.daysLeft === 0
              ? "EXPIRES TODAY!"
              : `${alert.daysLeft} Day${alert.daysLeft > 1 ? "s" : ""} Left`;

          return (
            <div
              key={`hotel-${alert.id}`}
              className="bg-card border border-rose-300 dark:border-rose-900 rounded-lg p-3 shadow-xs flex flex-col justify-between gap-2.5 hover:border-rose-500 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        HOTEL
                      </span>
                      <span
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        onClick={() => onOpenBooking && onOpenBooking(alert.bookingId)}
                      >
                        Booking #{alert.bookingReference}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                      <Hotel className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{alert.hotelName}</span>
                      {alert.city && <span className="text-muted-foreground font-normal">({alert.city})</span>}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      alert.daysLeft <= 1
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {daysText}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Guest:</span> {alert.customerName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Agent:</span> {alert.agentName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Room:</span> {alert.roomType}
                  </div>
                  <div>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Cancel By:</span>{" "}
                    <strong>
                      {new Date(alert.lastCancellationDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-border/50">
                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => onOpenBooking(alert.bookingId)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-secondary rounded border border-border transition-colors"
                    title="Open Booking Management"
                  >
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    <span>View Booking</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    markHotelBookedMutation.mutate({
                      bookingId: alert.bookingId,
                      accommodationId: alert.id,
                    })
                  }
                  disabled={markHotelBookedMutation.isPending}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-xs"
                  title="Marks hotel booked and removes free cancellation date so alarm stops"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Hotel Booked</span>
                </button>

                {isAdminOrManager && (
                  <button
                    type="button"
                    onClick={() => confirmBookingMutation.mutate(alert.bookingId)}
                    disabled={confirmBookingMutation.isPending}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors shadow-xs"
                    title="Admin: Confirm entire booking"
                  >
                    <span>Confirm Booking</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Transfer Alerts */}
        {transferAlerts.map((alert) => {
          const daysText =
            alert.daysLeft < 0
              ? `EXPIRED ${Math.abs(alert.daysLeft)} DAYS AGO`
              : alert.daysLeft === 0
              ? "EXPIRES TODAY!"
              : `${alert.daysLeft} Day${alert.daysLeft > 1 ? "s" : ""} Left`;

          return (
            <div
              key={`transfer-${alert.id}`}
              className="bg-card border border-rose-300 dark:border-rose-900 rounded-lg p-3 shadow-xs flex flex-col justify-between gap-2.5 hover:border-rose-500 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                        TRANSFER
                      </span>
                      <span
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        onClick={() => onOpenBooking && onOpenBooking(alert.bookingId)}
                      >
                        Booking #{alert.bookingReference}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                      <Car className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{alert.departureDestination} &rarr; {alert.arrivalDestination}</span>
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      alert.daysLeft <= 1
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {daysText}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Guest:</span> {alert.customerName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Agent:</span> {alert.agentName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Vehicle:</span> {alert.vehicleType}
                  </div>
                  <div>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Cancel By:</span>{" "}
                    <strong>
                      {new Date(alert.lastCancellationDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                    </strong>
                  </div>
                  <div className="col-span-2 text-[10.5px]">
                    <span className="font-semibold text-foreground">Date:</span>{" "}
                    {new Date(alert.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      timeZone: "Europe/London",
                    })}{" "}
                    {alert.departureTime ? `@ ${alert.departureTime}` : ""}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-border/50">
                {onOpenBooking && (
                  <button
                    type="button"
                    onClick={() => onOpenBooking(alert.bookingId)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-secondary rounded border border-border transition-colors"
                    title="Open Booking Management"
                  >
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    <span>View Booking</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    markTransferBookedMutation.mutate({
                      bookingId: alert.bookingId,
                      transportId: alert.id,
                    })
                  }
                  disabled={markTransferBookedMutation.isPending}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-xs"
                  title="Marks transfer booked and removes free cancellation date so alarm stops"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Transfer Booked</span>
                </button>

                {isAdminOrManager && (
                  <button
                    type="button"
                    onClick={() => confirmBookingMutation.mutate(alert.bookingId)}
                    disabled={confirmBookingMutation.isPending}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors shadow-xs"
                    title="Admin: Confirm entire booking"
                  >
                    <span>Confirm Booking</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
