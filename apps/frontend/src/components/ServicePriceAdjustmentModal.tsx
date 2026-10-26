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
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  BadgePercent,
  CheckCircle2,
  Loader2,
  Info,
} from 'lucide-react';

export type ServiceAdjustmentType = 'hotel' | 'transport' | 'visa' | 'additional';

interface ServicePriceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  serviceType: ServiceAdjustmentType;
  service: any;
  onSuccess: () => void;
}

export default function ServicePriceAdjustmentModal({
  isOpen,
  onClose,
  booking,
  serviceType,
  service,
  onSuccess,
}: ServicePriceAdjustmentModalProps) {
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
  const currentPrice = useMemo(() => {
    if (!service) return 0;
    if (serviceType === 'additional') return Number(service.servicePrice) || 0;
    return Number(service.price) || 0;
  }, [service, serviceType]);

  const originalPrice = service?.originalPrice ?? currentPrice;

  // Service Name and Title
  const serviceName = useMemo(() => {
    if (!service) return 'Service';
    switch (serviceType) {
      case 'hotel':
        return service.hotelName || 'Hotel';
      case 'transport':
        return service.vehicleType
          ? `${service.vehicleType} (${service.departureDestination} → ${service.arrivalDestination})`
          : 'Transfer';
      case 'visa':
        return service.visaType
          ? `${service.visaType} (${service.passportNumber})`
          : 'Visa';
      case 'additional':
        return service.serviceName || 'Additional Service';
      default:
        return 'Service';
    }
  }, [service, serviceType]);

  const serviceCategoryLabel = useMemo(() => {
    switch (serviceType) {
      case 'hotel': return 'Hotel';
      case 'transport': return 'Transfer';
      case 'visa': return 'Visa';
      case 'additional': return 'Additional Service';
    }
  }, [serviceType]);

  // Original booking date
  const originalBookingDate = useMemo(() => {
    const raw =
      service?.originalBookingDate ||
      service?.date ||
      service?.issueDate ||
      service?.createdAt ||
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
  }, [service, booking]);

  // Number parsing & live calculations
  const parsedNewPrice = parseFloat(newPriceInput);
  const isValidNumber = !isNaN(parsedNewPrice) && parsedNewPrice >= 0;
  const isChanged = isValidNumber && Math.abs(parsedNewPrice - currentPrice) > 0.001;
  const isUpgrade = isValidNumber && parsedNewPrice > currentPrice;
  const isDowngrade = isValidNumber && parsedNewPrice < currentPrice;
  const diffAmount = isChanged ? Math.round(Math.abs(parsedNewPrice - currentPrice) * 100) / 100 : 0;

  // Slab Commission Rate matching
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

  // Upgrade Calculations (Scenario B: when margin paid)
  const additionalAgentMargin = useMemo(() => {
    if (!hasPaidMargin || !isUpgrade || diffAmount <= 0 || commissionRate <= 0) {
      return 0;
    }
    return Math.round(diffAmount * (commissionRate / 100) * 100) / 100;
  }, [hasPaidMargin, isUpgrade, diffAmount, commissionRate]);

  const additionalProfit = useMemo(() => {
    if (!hasPaidMargin || !isUpgrade || diffAmount <= 0) {
      return 0;
    }
    return Math.round((diffAmount - additionalAgentMargin) * 100) / 100;
  }, [hasPaidMargin, isUpgrade, diffAmount, additionalAgentMargin]);

  // Downgrade Calculations (Scenario B: when margin paid)
  const reducedAgentMargin = useMemo(() => {
    if (!hasPaidMargin || !isDowngrade || diffAmount <= 0 || commissionRate <= 0) {
      return 0;
    }
    return Math.round(diffAmount * (commissionRate / 100) * 100) / 100;
  }, [hasPaidMargin, isDowngrade, diffAmount, commissionRate]);

  const reducedProfit = useMemo(() => {
    if (!hasPaidMargin || !isDowngrade || diffAmount <= 0) {
      return 0;
    }
    return Math.round((diffAmount - reducedAgentMargin) * 100) / 100;
  }, [hasPaidMargin, isDowngrade, diffAmount, reducedAgentMargin]);

  // Original profit calculation
  const originalProfit = useMemo(() => {
    if (!booking) return 0;
    const vendorCost =
      booking.bookingVendorPayments?.reduce(
        (sum: number, vp: any) => sum + (vp.originalCost || 0),
        0
      ) || 0;
    const vendorRefund =
      (booking.accommodations?.reduce((sum: number, a: any) => sum + (a.refundAmount || 0), 0) || 0) +
      (booking.flightServices?.reduce((sum: number, f: any) => sum + (f.refundAmount || 0), 0) || 0) +
      (booking.transportServices?.reduce((sum: number, t: any) => sum + (t.refundAmount || 0), 0) || 0) +
      (booking.visaServices?.reduce((sum: number, v: any) => sum + (v.refundAmount || 0), 0) || 0);
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
    if (isUpgrade) {
      return Math.round((originalProfit + additionalProfit) * 100) / 100;
    } else if (isDowngrade) {
      return Math.round((originalProfit - reducedProfit) * 100) / 100;
    }
    return originalProfit;
  }, [originalProfit, isUpgrade, isDowngrade, additionalProfit, reducedProfit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidNumber || !isChanged) {
      toast.error('Please enter a new price that is different from current price.');
      return;
    }

    setIsSubmitting(true);
    let endpoint = '';
    switch (serviceType) {
      case 'hotel':
        endpoint = `/bookings/${booking.id}/accommodations/${service.id}/adjust-price`;
        break;
      case 'transport':
        endpoint = `/bookings/${booking.id}/transports/${service.id}/adjust-price`;
        break;
      case 'visa':
        endpoint = `/bookings/${booking.id}/visas/${service.id}/adjust-price`;
        break;
      case 'additional':
        endpoint = `/bookings/${booking.id}/additional-services/${service.id}/adjust-price`;
        break;
    }

    try {
      const response = await apiClient.post(endpoint, {
        newPrice: parsedNewPrice,
        notes: notes.trim() || undefined,
      });

      toast.success(
        response.data?.message || `${serviceCategoryLabel} price adjusted successfully!`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          `Failed to record ${serviceCategoryLabel.toLowerCase()} price adjustment.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: service?.currency || 'GBP',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${serviceCategoryLabel} Price Adjustment — ${serviceName}`}
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
                ? 'Original margin has already been paid and will remain locked. Upgrades will generate Additional Profit & Additional Agent Margin, and downgrades will reflect Reduced Profit & Reduced Agent Margin.'
                : 'Agent margin has not been paid yet. Updating this service price will directly recalculate the booking profit and standard agent margin.'}
            </p>
          </div>
        </div>

        {/* Financial Baseline Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-secondary/30 p-3 rounded-lg border border-border">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Original {serviceCategoryLabel} Price
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
            <span>New {serviceCategoryLabel} Price ({service?.currency || 'GBP'})</span>
            {isUpgrade && (
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                <ArrowUpRight size={13} />
                Upgrade (+{formatCurrency(diffAmount)})
              </span>
            )}
            {isDowngrade && (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ArrowDownRight size={13} />
                Downgrade (-{formatCurrency(diffAmount)})
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
              value={newPriceInput}
              onChange={(e) => setNewPriceInput(e.target.value)}
              placeholder={`Enter new price (currently ${currentPrice})`}
              className="w-full pl-7 pr-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              required
              autoFocus
            />
          </div>
          {newPriceInput && !isChanged && (
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              New price must be different from current price ({formatCurrency(currentPrice)}).
            </p>
          )}
        </div>

        {/* Live Calculation Breakdown (Scenario B: Upgrade or Downgrade) */}
        {hasPaidMargin && isChanged && diffAmount > 0 && (
          <div className="bg-card p-3 rounded-lg border border-border shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">
                {isUpgrade ? 'Calculated Upgrade Breakdown' : 'Calculated Downgrade Breakdown'}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Adjustment Date: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>

            {/* UPGRADE BLOCKS */}
            {isUpgrade && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-secondary/40 border border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Upgrade Amount
                  </span>
                  <span className="text-[13px] font-extrabold text-blue-600 dark:text-blue-400">
                    +{formatCurrency(diffAmount)}
                  </span>
                </div>

                {/* Additional Agent Margin Block */}
                <div className="p-2 rounded bg-secondary/40 border border-border/50">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block flex items-center gap-0.5">
                    <BadgePercent size={11} />
                    Additional Agent Margin
                  </span>
                  <span className="text-[13px] font-extrabold text-blue-600 dark:text-blue-400">
                    +{formatCurrency(additionalAgentMargin)}
                  </span>
                  {commissionRate > 0 && (
                    <span className="text-[10px] text-muted-foreground ml-1 font-semibold">
                      ({commissionRate}%)
                    </span>
                  )}
                </div>

                {/* Additional Profit Block */}
                <div className="p-2 rounded bg-secondary/40 border border-border/50 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-0.5">
                    <TrendingUp size={11} />
                    Additional Profit
                  </span>
                  <span className="text-[13px] font-extrabold text-emerald-700 dark:text-emerald-400">
                    +{formatCurrency(additionalProfit)}
                  </span>
                </div>
              </div>
            )}

            {/* DOWNGRADE BLOCKS */}
            {isDowngrade && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 rounded bg-secondary/40 border border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Downgrade Reduction
                  </span>
                  <span className="text-[13px] font-extrabold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(diffAmount)}
                  </span>
                </div>

                {/* Reduced Agent Margin Block */}
                <div className="p-2 rounded bg-secondary/40 border border-border/50">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-0.5">
                    <BadgePercent size={11} />
                    Reduced Agent Margin
                  </span>
                  <span className="text-[13px] font-extrabold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(reducedAgentMargin)}
                  </span>
                  {commissionRate > 0 && (
                    <span className="text-[10px] text-muted-foreground ml-1 font-semibold">
                      ({commissionRate}%)
                    </span>
                  )}
                </div>

                {/* Reduced Profit Block */}
                <div className="p-2 rounded bg-secondary/40 border border-border/50 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block flex items-center gap-0.5">
                    <TrendingDown size={11} />
                    Reduced Profit
                  </span>
                  <span className="text-[13px] font-extrabold text-rose-700 dark:text-rose-400">
                    -{formatCurrency(reducedProfit)}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-dashed border-border/80 flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Total Projected Profit:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                {formatCurrency(totalProjectedProfit)}
                <span className="text-[11px] font-normal text-muted-foreground ml-1">
                  (Orig: {formatCurrency(originalProfit)} {isUpgrade ? `+ Addl: ${formatCurrency(additionalProfit)}` : `- Red: ${formatCurrency(reducedProfit)}`})
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
            placeholder="e.g. Upgrade to VIP transfer or cheaper room rate confirmed"
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
            disabled={!isValidNumber || !isChanged || isSubmitting}
            className={`px-4 py-1.5 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-xs transition-colors flex items-center gap-1.5 ${
              isUpgrade ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Saving Adjustment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                <span>Confirm {isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Adjustment'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
