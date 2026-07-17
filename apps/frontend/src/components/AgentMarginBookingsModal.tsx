import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { X, Loader2, FileText, CheckCircle, XCircle, Search } from "lucide-react";
import { toast } from "sonner";

interface Props {
  margin: any;
  onClose: () => void;
}

export default function AgentMarginBookingsModal({ margin, onClose }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes("SUPER_ADMIN") || user?.roles.includes("ADMIN");
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["agent-margin-bookings", margin.id],
    queryFn: async () => {
      const res = await apiClient.get(`/agent-margins/${margin.id}/bookings`);
      return res.data.data as any[];
    },
  });

  const toggleVoidMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return apiClient.patch(`/agent-margins/bookings/${bookingId}/toggle-void`);
    },
    onSuccess: () => {
      toast.success("Booking qualification updated");
      queryClient.invalidateQueries({ queryKey: ["agent-margin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["agent-margins"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update booking status");
    }
  });

  const qualifyingProfit = React.useMemo(() => {
    if (!bookings) return 0;
    return bookings
      .filter((b: any) => !b.agentMarginVoided)
      .reduce((sum: number, b: any) => sum + b.profit, 0);
  }, [bookings]);

  const filteredBookings = React.useMemo(() => {
    if (!bookings) return [];
    if (!searchQuery) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter((b: any) =>
      b.bookingReference.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

  return (
    <div className="margin__custom fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Margin Bookings
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Details of eligible bookings included in this calculation. Deductions are calculated in real time.
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
              Loading bookings...
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-border border-dashed">
              No eligible bookings found for this margin record.
            </div>
          ) : (
            <>
              <div className="mb-4 relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-input rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-ring"
                />
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-border">
                  No bookings matching "{searchQuery}" found.
                </div>
              ) : (
                <div className="overflow-auto max-h-[55vh] rounded-lg border border-border relative">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-left">Booking Ref</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-left">Customer</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-left">Booking Date</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-right">Total Cost</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-right">Customer Paid</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-right">Vendor Cost</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-violet-500 text-right">Vendor Refund</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-red-500 text-right">Refund</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-amber-500 text-right">Card Charges</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-right">Net Profit</th>
                        <th className="sticky top-0 bg-muted/95 px-4 py-3 z-10 font-semibold text-muted-foreground text-center">Included</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredBookings.map((b: any) => {
                        const canToggle = margin?.status !== 'PAID' && isAdmin;
                        return (
                          <tr
                            key={b.id}
                            className={`hover:bg-muted/30 transition-colors ${b.agentMarginVoided ? 'opacity-60 bg-red-500/5' : ''}`}
                          >
                            <td className="px-4 py-3 font-medium text-primary">
                              {b.bookingReference}
                            </td>
                            <td className="px-4 py-3">{b.customerName}</td>
                            <td className="px-4 py-3">{formatDate(b.createdAt)}</td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(b.totalPrice)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(b.paidAmount)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatCurrency(b.vendorCost)}
                            </td>
                            <td className="px-4 py-3 text-right text-violet-500 font-medium">
                              {b.vendorRefund > 0 ? `+${formatCurrency(b.vendorRefund)}` : '—'}
                            </td>
                            <td className="px-4 py-3 text-right text-red-500 font-medium">
                              {b.refundAmount > 0 ? `-${formatCurrency(b.refundAmount)}` : '—'}
                            </td>
                            <td className="px-4 py-3 text-right text-amber-500 font-medium">
                              {b.cardPaymentCharges > 0 ? `-${formatCurrency(b.cardPaymentCharges)}` : '—'}
                            </td>
                            <td className={`px-4 py-3 text-right font-medium ${b.agentMarginVoided ? 'text-muted-foreground line-through' : 'text-emerald-600 dark:text-emerald-400'}`}>
                              {formatCurrency(b.profit)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {margin?.status === 'PAID' ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  PAID
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (!canToggle) return;
                                    const confirmMsg = b.agentMarginVoided
                                      ? "Are you sure you want to qualify this booking for margin calculation?"
                                      : "Are you sure you want to withdraw/exclude this booking from margin calculation?";
                                    if (window.confirm(confirmMsg)) {
                                      toggleVoidMutation.mutate(b.id);
                                    }
                                  }}
                                  disabled={!canToggle || toggleVoidMutation.isPending}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                                    b.agentMarginVoided 
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  } ${!canToggle ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                  title={canToggle ? "Click to toggle qualification" : "Admin access only"}
                                >
                                  {b.agentMarginVoided ? (
                                    <>
                                      <XCircle className="h-3.5 w-3.5" />
                                      Not Qualify
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      Qualifies
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t border-border font-semibold text-sm">
                      <tr>
                        <td colSpan={9} className="px-4 py-3 text-right">
                          Total Profit (Qualifying):
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(qualifyingProfit)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
              
              {margin.marginPercentage === 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg flex items-start gap-3 text-amber-800 dark:text-amber-300 text-sm">
                  <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Margin Voided</p>
                    <p>
                      Your total profit ({formatCurrency(qualifyingProfit)}) for this period is less than the minimum required threshold configured in the margin slabs. Therefore, no commission has been awarded for these bookings.
                    </p>
                  </div>
                </div>
              )}
              
              {margin.marginPercentage > 0 && (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Margin Applied ({margin.marginPercentage}%)</p>
                    <p>
                      Your total profit ({formatCurrency(qualifyingProfit)}) successfully met the margin slab requirements. You have been awarded {formatCurrency(margin.marginAmount)}.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
