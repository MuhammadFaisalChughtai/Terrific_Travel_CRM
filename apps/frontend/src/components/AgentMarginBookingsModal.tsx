import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { formatCurrency, formatDate } from "@tms/shared-utils";
import { X, Loader2, FileText, CheckCircle, XCircle } from "lucide-react";

interface Props {
  margin: any;
  onClose: () => void;
}

export default function AgentMarginBookingsModal({ margin, onClose }: Props) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["agent-margin-bookings", margin.id],
    queryFn: async () => {
      const res = await apiClient.get(`/agent-margins/${margin.id}/bookings`);
      return res.data.data as any[];
    },
  });

  return (
    <div className="margin__custom fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Margin Bookings
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Details of eligible bookings included in this calculation.
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
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Booking Ref</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Booking Date</th>
                    <th className="px-4 py-3 text-right">Customer Paid</th>
                    <th className="px-4 py-3 text-right">Vendor Cost</th>
                    <th className="px-4 py-3 text-right">Profit</th>
                    <th className="px-4 py-3 text-center">Included</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map((b: any) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-primary">
                        {b.bookingReference}
                      </td>
                      <td className="px-4 py-3">{b.customerName}</td>
                      <td className="px-4 py-3">{formatDate(b.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(b.paidAmount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(b.vendorCost)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(b.profit)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/30 border-t border-border font-medium">
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-right">
                      Total Profit:
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(
                        bookings?.reduce((sum: number, b: any) => sum + b.profit, 0) || 0
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {margin.marginPercentage === 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg flex items-start gap-3 text-amber-800 dark:text-amber-300 text-sm">
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Margin Voided</p>
                  <p>
                    Your total profit ({formatCurrency(margin.totalProfit)}) for this period is less than the minimum required threshold configured in the margin slabs. Therefore, no commission has been awarded for these bookings.
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
                    Your total profit ({formatCurrency(margin.totalProfit)}) successfully met the margin slab requirements. You have been awarded {formatCurrency(margin.marginAmount)}.
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
