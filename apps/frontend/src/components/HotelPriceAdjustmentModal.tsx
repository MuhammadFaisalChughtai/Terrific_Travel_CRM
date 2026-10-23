import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { toast } from 'sonner';
import { apiClient } from '../api/client';
import {
  Tag,
  AlertTriangle,
  Calendar,
  Lock,
  ArrowDownRight,
  TrendingUp,
  BadgePercent,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';

interface HotelPriceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  accommodation: any;
  onSuccess: () => void;
}

export default function HotelPriceAdjustmentModal({
  isOpen,
  onClose,
  booking,
  accommodation,
  onSuccess,
}: HotelPriceAdjustmentModalProps) {
  const [newPriceInput, setNewPriceInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if original agent margin has already been paid for this booking
  const hasPaidMargin = useMemo(() => {
    if (!booking) return false;
    const hasPayoutTx = booking.transactions?.some(
      (tx: any) =>
        tx.paymentMethod === 'AGENT PAYOUT' || tx.paymentMethod === 'AGENT_PAYOUT'
    );
    const isMarginPaid = booking.agentMargin?.status === 'PAID';
    return Boolean(hasPayoutTx || isMarginPaid);
  }, [booking]);

  // Current baseline price and original price
  const currentPrice = accommodation?.price || 0;
  const originalPrice = accommodation?.originalPrice ?? currentPrice;

  // Original booking date
  const originalBookingDate = useMemo(() => {
    const raw =
      accommodation?.originalBookingDate ||
      accommodation?.issueDate ||
      booking?.bookingDate ||
      booking?.createdAt;
    if (!raw) return 'N/A';
    try {
      return new Date(raw).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }, [accommodation, booking]);

  // Free cancellation deadline check
  const cancellationStatus = useMemo(() => {
    if (!accommodation?.lastCancellationDate) return null;
    const cancelDate = new Date(accommodation.lastCancellationDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (cancelDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isExpired = diffDays < 0;
    return {
      dateFormatted: cancelDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      diffDays,
      isExpired,
    };
  }, [accommodation]);

  // Number parsing & live calculations
  const parsedNewPrice = parseFloat(newPriceInput);
  const isValidPrice =
    !isNaN(parsedNewPrice) && parsedNewPrice >= 0 && parsedNewPrice < currentPrice;
  const savedPrice = isValidPrice
    ? Math.round((currentPrice - parsedNewPrice) * 100) / 100
    : 0;

  // Helper: Slab Commission Rate matching
  const commissionRate = useMemo(() => {
    if (!booking?.agent?.slabs || booking.agent.slabs.length === 0 || booking.agentMarginVoided) {
      return 0;
    }
    const totalPrice = booking.totalPrice || 0;
    const slabs = booking.agent.slabs;
    const slab = slabs.find(
      (s: any) =>
        totalPrice >= s.minSales && (s.maxSales === null || totalPrice <= s.maxSales)
    );
    if (slab) return slab.commissionRate;

    // Fallback: highest slab
    const highestSlab = slabs.reduce((prev: any, cur: any) =>
      prev.minSales > cur.minSales ? prev : cur
    );
    if (totalPrice > highestSlab.minSales) {
      return highestSlab.commissionRate;
    }
    return 0;
  }, [booking]);

  // Additional margin & profit for Scenario B
  const additionalAgentMargin = useMemo(() => {
    if (!hasPaidMargin || !isValidPrice || savedPrice <= 0 || commissionRate <= 0) {
      return 0;
    }
    return Math.round(savedPrice * (commissionRate / 100) * 100) / 100;
  }, [hasPaidMargin, isValidPrice, savedPrice, commissionRate]);

  const additionalProfit = useMemo(() => {
    if (!hasPaidMargin || !isValidPrice || savedPrice <= 0) {
      return 0;
    }
    return Math.round((savedPrice - additionalAgentMargin) * 100) / 100;
  }, [hasPaidMargin, isValidPrice, savedPrice, additionalAgentMargin]);

  // Original profit calculation
  const originalProfit = useMemo(() => {
    if (!booking) return 0;
    const vendorCost =
      booking.bookingVendorPayments?.reduce(
        (sum: number, vp: any) => sum + (vp.originalCost || 0),
        0
      ) || 0;
    const vendorRefund =
      (booking.accommodations?.reduce(
        (sum: number, a: any) => sum + (a.refundAmount || 0),
        0
      ) || 0) +
      (booking.flightServices?.reduce(
        (sum: number, f: any) => sum + (f.refundAmount || 0),
        0
      ) || 0) +
      (booking.transportServices?.reduce(
        (sum: number, t: any) => sum + (t.refundAmount || 0),
        0
      ) || 0) +
      (booking.visaServices?.reduce(
        (sum: number, v: any) => sum + (v.refundAmount || 0),
        0
      ) || 0);
    const rawProfit =
      (booking.totalPrice || 0) -
      vendorCost +
      vendorRefund -
      (booking.refundAmount || 0) -
      (booking.cardPaymentCharges || 0);

    const actualPayout =
      booking.transactions
        ?.filter(
          (tx: any) =>
            tx.paymentMethod === 'AGENT PAYOUT' || tx.paymentMethod === 'AGENT_PAYOUT'
        )
        ?.reduce((sum: number, tx: any) => sum + Math.abs(tx.amount || 0), 0) || 0;

    return booking.agentMarginVoided ? rawProfit : rawProfit - actualPayout;
  }, [booking]);

  const totalProjectedProfit = useMemo(() => {
    return Math.round((originalProfit + additionalProfit) * 100) / 100;
  }, [originalProfit, additionalProfit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPrice) {
      toast.error('Please enter a valid new hotel price that is strictly lower than current price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post(
        `/bookings/${booking.id}/accommodations/${accommodation.id}/adjust-price`,
        {
          newPrice: parsedNewPrice,
          notes: notes.trim() || undefined,
        }
      );

      toast.success(
        response.data?.message || 'Hotel price adjusted and savings successfully recorded!'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to record hotel price adjustment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: accommodation?.currency || 'GBP',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Hotel Price Adjustment — ${accommodation?.hotelName || 'Accommodation'}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Scenario Banner */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            hasPaidMargin
              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          }`}
        >
          <Info size={16} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              {hasPaidMargin ? 'Scenario B: Agent Margin Paid' : 'Scenario A: Agent Margin Unpaid'}
            </span>
            <p className="text-[12px] opacity-90 leading-relaxed">
              {hasPaidMargin
                ? 'Original margin has already been paid and will remain locked. Savings will generate a separate Additional Profit and Additional Agent Margin record.'
                : 'Agent margin has not been paid yet. Updating the hotel price will directly recalculate the booking profit and standard agent margin.'}
            </p>
          </div>
        </div>

        {/* Free-Cancellation Notice */}
        {cancellationStatus && (
          <div
            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
              cancellationStatus.isExpired
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span className="font-semibold">
                Free Cancellation Deadline: <strong>{cancellationStatus.dateFormatted}</strong>
              </span>
            </div>
            {cancellationStatus.isExpired ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                Deadline Passed
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                {cancellationStatus.diffDays}d Left
              </span>
            )}
          </div>
        )}

        {/* Financial Baseline Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-secondary/30 p-3 rounded-lg border border-border">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Original Hotel Price
            </span>
            <span className="text-[14px] font-bold text-foreground">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Current Active Price
            </span>
            <span className="text-[14px] font-bold text-foreground">
              {formatCurrency(currentPrice)}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Original Booking Date
            </span>
            <span className="text-[12px] font-bold text-foreground">
              {originalBookingDate}
            </span>
          </div>
        </div>

        {/* Price Adjustment Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>New Hotel Price ({accommodation?.currency || 'GBP'})</span>
            {isValidPrice && (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ArrowDownRight size={13} />
                Saved: {formatCurrency(savedPrice)}
              </span>
            )}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
              £
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              max={currentPrice > 0 ? currentPrice - 0.01 : undefined}
              value={newPriceInput}
              onChange={(e) => setNewPriceInput(e.target.value)}
              placeholder={`Enter new lower price (must be < ${currentPrice})`}
              className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              required
              autoFocus
            />
          </div>
          {newPriceInput && !isValidPrice && (
            <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
              New hotel price must be strictly lower than current price ({formatCurrency(currentPrice)}).
            </p>
          )}
        </div>

        {/* Live Savings & Margin Calculation Breakdown (Scenario B only) */}
        {hasPaidMargin && isValidPrice && savedPrice > 0 && (
          <div className="bg-card p-3 rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">Calculated Savings Breakdown</span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Adjustment Date: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2 rounded bg-secondary/40 border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Saved Price
                </span>
                <span className="text-[13px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(savedPrice)}
                </span>
              </div>

              <div className="p-2 rounded bg-secondary/40 border border-border/50">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block flex items-center gap-0.5">
                  <BadgePercent size={11} />
                  Addl Agent Margin
                </span>
                <span className="text-[13px] font-extrabold text-blue-600 dark:text-blue-400">
                  {formatCurrency(additionalAgentMargin)}
                </span>
                {commissionRate > 0 && (
                  <span className="text-[10px] text-muted-foreground ml-1 font-semibold">
                    ({commissionRate}%)
                  </span>
                )}
              </div>

              <div className="p-2 rounded bg-secondary/40 border border-border/50 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-0.5">
                  <TrendingUp size={11} />
                  Additional Profit
                </span>
                <span className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(additionalProfit)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-border/80 flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Total Projected Profit:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                {formatCurrency(totalProjectedProfit)}
                <span className="text-[11px] font-normal text-muted-foreground ml-1">
                  (Orig: {formatCurrency(originalProfit)} + Addl: {formatCurrency(additionalProfit)})
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">
            Adjustment Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cheaper rate confirmed with supplier portal"
            className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValidPrice || isSubmitting}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Saving Adjustment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span>Confirm Price Adjustment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
