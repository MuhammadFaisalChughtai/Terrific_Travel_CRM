import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { X, Loader2, Calculator, Calendar, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  startDate: string;
  endDate: string;
  agentId: string;
  dateType: string;
  onClose: () => void;
}

export default function RecalculateMarginModal({ startDate, endDate, agentId, dateType, onClose }: Props) {
  const queryClient = useQueryClient();
  
  const [includedBookingIds, setIncludedBookingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  // Fetch eligible bookings
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["eligible-margin-bookings", startDate, endDate, agentId, dateType],
    queryFn: async () => {
      const res = await apiClient.get(`/agent-margins/eligible-bookings?startDate=${startDate}&endDate=${endDate}&agentId=${agentId}&dateType=${dateType}`);
      return res.data.data as any[];
    },
    enabled: !!startDate && !!endDate
  });

  const handlePayAdditionalMargin = async (b: any) => {
    if (!window.confirm(`Are you sure you want to record payout of this additional agent margin of ${formatCurrency(b.additionalMargin)}? This will record an AGENT PAYOUT transaction and update the agent ledger.`)) {
      return;
    }
    setPayingBookingId(b.id);
    try {
      await apiClient.post(`/bookings/${b.id}/refund-surplus/pay-margin`, {
        amount: b.additionalMargin,
        notes: `Additional Agent Margin Payout for Refund Surplus: ${formatCurrency(b.additionalMargin)}`,
      });
      toast.success("Additional agent margin paid successfully!");
      queryClient.invalidateQueries({ queryKey: ["eligible-margin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to pay additional agent margin");
    } finally {
      setPayingBookingId(null);
    }
  };

  const tokens = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchQuery
      .toLowerCase()
      .split(/[\s,\n\r\t]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }, [searchQuery]);

  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];
    if (tokens.length === 0) return bookings;
    return bookings.filter((b: any) => {
      const ref = (b.bookingReference || "").toLowerCase();
      const agent = (b.agentName || "").toLowerCase();
      const customer = (b.leadPassenger || b.customerName || "").toLowerCase();
      return tokens.some(
        (token) =>
          ref.includes(token) || agent.includes(token) || customer.includes(token)
      );
    });
  }, [bookings, tokens]);

  const isSelectableBooking = (b: any) => b.marginStatus !== 'PAID' || b.isIncrementalAdjustment;

  // Automatically check all selectable bookings when they are fetched
  useEffect(() => {
    if (bookings) {
      const selectable = bookings.filter(isSelectableBooking);
      setIncludedBookingIds(new Set(selectable.map((b: any) => b.id)));
    }
  }, [bookings]);

  const toggleBooking = (id: string) => {
    const newSet = new Set(includedBookingIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setIncludedBookingIds(newSet);
  };

  const toggleAll = () => {
    const selectable = filteredBookings.filter(isSelectableBooking);
    const allSelected = selectable.every((b: any) => includedBookingIds.has(b.id));
    
    const newSet = new Set(includedBookingIds);
    if (allSelected) {
      selectable.forEach((b: any) => newSet.delete(b.id));
    } else {
      selectable.forEach((b: any) => newSet.add(b.id));
    }
    setIncludedBookingIds(newSet);
  };

  const selectOnlyFiltered = () => {
    const selectable = filteredBookings.filter(isSelectableBooking);
    const newSet = new Set(includedBookingIds);
    selectable.forEach((b: any) => newSet.add(b.id));
    setIncludedBookingIds(newSet);
    toast.success(`Selected ${selectable.length} filtered bookings`);
  };

  const deselectFiltered = () => {
    const selectable = filteredBookings.filter(isSelectableBooking);
    const newSet = new Set(includedBookingIds);
    selectable.forEach((b: any) => newSet.delete(b.id));
    setIncludedBookingIds(newSet);
    toast.info(`Deselected ${selectable.length} filtered bookings`);
  };

  const calculateMutation = useMutation({
    mutationFn: async () => {
      return apiClient.post("/agent-margins/calculate", {
        startDate,
        endDate,
        includedBookingIds: Array.from(includedBookingIds),
        agentId: agentId !== 'all' ? agentId : undefined,
        dateType
      });
    },
    onSuccess: (res) => {
      toast.success(res.data.message || "Margins calculated successfully");
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to calculate margins");
    }
  });

  return (
    <div className="margin__custom fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Recalculate Margin ({new Date(startDate).toLocaleDateString(undefined, { timeZone: "UTC" })} - {new Date(endDate).toLocaleDateString(undefined, { timeZone: "UTC" })})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose which bookings to include in this round. Paste multiple references to bulk filter at once.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              Loading eligible bookings...
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-border border-dashed">
              No eligible bookings found in this date range.
            </div>
          ) : (
            <>
              {/* Bulk Search & Filter Controls */}
              <div className="mb-4 space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      rows={tokens.length > 2 ? 3 : 1}
                      placeholder="Search single ref, or paste multiple refs (e.g. TT01044 TT01031 TT00943)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-background border border-input rounded-xl pl-9 pr-8 py-2 text-xs focus:ring-2 focus:ring-ring resize-none font-mono"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {tokens.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {filteredBookings.length} matched ({tokens.length} token{tokens.length !== 1 ? 's' : ''})
                      </span>
                      <button
                        type="button"
                        onClick={selectOnlyFiltered}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Select All Filtered
                      </button>
                      <button
                        type="button"
                        onClick={deselectFiltered}
                        className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-semibold transition-all border border-border"
                      >
                        Deselect Filtered
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
                  No bookings matching your search query were found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">
                          <input 
                            type="checkbox" 
                            checked={(() => {
                              const selectable = filteredBookings.filter(isSelectableBooking);
                              return selectable.length > 0 && selectable.every((b: any) => includedBookingIds.has(b.id));
                            })()}
                            onChange={toggleAll}
                            className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3">Booking Ref</th>
                        <th className="px-4 py-3">Agent</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Booking Date</th>
                        <th className="px-4 py-3 text-right">Profit</th>
                        <th className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">Additional Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredBookings.map((b: any) => {
                        const isChecked = includedBookingIds.has(b.id);
                        return (
                          <tr
                            key={b.id}
                            className={`transition-colors ${isChecked ? "" : "bg-muted/30 opacity-60"}`}
                          >
                            <td className="px-4 py-3 text-center">
                              {b.isIncrementalAdjustment ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => toggleBooking(b.id)}
                                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                                  />
                                  <span 
                                    className="text-[9px] uppercase font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 px-1 py-0.5 rounded-sm whitespace-nowrap"
                                    title="Original margin paid. Includes incremental price adjustments (upgrade/downgrade) or refund surplus."
                                  >
                                    Adj ({b.profit >= 0 ? `+£${b.profit}` : `-£${Math.abs(b.profit)}`})
                                  </span>
                                </div>
                              ) : b.marginStatus === 'PAID' ? (
                                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                  Margin Paid
                                </span>
                              ) : (
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => toggleBooking(b.id)}
                                  className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                                />
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-primary">
                              {b.bookingReference}
                            </td>
                            <td className="px-4 py-3">{b.agentName || "—"}</td>
                            <td className="px-4 py-3">{b.leadPassenger}</td>
                            <td className="px-4 py-3">{formatDate(b.date)}</td>
                            <td className="px-4 py-3 text-right font-medium">
                              {b.hasRefundSurplus || b.isIncrementalAdjustment ? (
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
                                    Additional Profit
                                  </span>
                                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    +{formatCurrency(b.profit)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                    {b.hasRefundSurplus ? "Retained Refund Surplus" : "Net Adjustment"}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  {formatCurrency(b.profit)}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {b.additionalMargin > 0 ? (
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                                    Additional Agent Margin
                                  </span>
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                    +{formatCurrency(b.additionalMargin)}
                                  </span>
                                  {b.additionalMarginPaid ? (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                      Paid
                                    </span>
                                  ) : (
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                        Unpaid
                                      </span>
                                      <button
                                        type="button"
                                        disabled={payingBookingId === b.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePayAdditionalMargin(b);
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs whitespace-nowrap"
                                        title="Record payout for additional agent margin"
                                      >
                                        {payingBookingId === b.id ? (
                                          <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                        ) : (
                                          <CheckCircle2 size={10} />
                                        )}
                                        <span>Pay Addl Margin</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t border-border font-semibold text-sm">
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-right">
                          Selected Total:
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                          <span className="text-xs text-muted-foreground mr-1">Profit:</span>
                          {formatCurrency(
                            bookings
                              .filter((b: any) => includedBookingIds.has(b.id))
                              .reduce((sum: number, b: any) => sum + b.profit, 0)
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">
                          <span className="text-xs text-muted-foreground mr-1">Addl Margin:</span>
                          +{formatCurrency(
                            bookings
                              .filter((b: any) => includedBookingIds.has(b.id))
                              .reduce((sum: number, b: any) => sum + (b.additionalMargin || 0), 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => calculateMutation.mutate()}
            disabled={calculateMutation.isPending || includedBookingIds.size === 0}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm font-medium shadow-sm"
          >
            {calculateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Calculate for {includedBookingIds.size} Booking{includedBookingIds.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
