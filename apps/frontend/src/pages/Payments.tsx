import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { formatCurrency } from '@tms/shared-utils';
import { CreditCard, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';

export default function Payments() {
  const { data: paymentsResult, isLoading } = useQuery({
    queryKey: ['payments-list'],
    queryFn: async () => {
      const res = await apiClient.get('/payments');
      return res.data.data;
    },
  });

  const payments = paymentsResult || [
    { id: 'pay-1', bookingId: 'bk-1234', amount: 800.0, status: 'SUCCESS', provider: 'STRIPE', transactionId: 'ch_3MvYkDLkd', createdAt: new Date().toISOString() },
    { id: 'pay-2', bookingId: 'bk-5678', amount: 450.0, status: 'PENDING', provider: 'PAYPAL', transactionId: 'PAYID-MT6W7', createdAt: new Date().toISOString() },
    { id: 'pay-3', bookingId: 'bk-9012', amount: 599.0, status: 'FAILED', provider: 'STRIPE', transactionId: 'ch_4JvKkFLmd', createdAt: new Date().toISOString() },
  ];

  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          Payment Audits & Receipts
        </h3>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading payments ledger...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {payments.map((payment: any) => {
                const statusIcon = 
                  payment.status === 'SUCCESS' ? <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> :
                  payment.status === 'PENDING' ? <Clock size={14} className="text-amber-600 dark:text-amber-400" /> :
                  <XCircle size={14} className="text-destructive" />;

                const statusColor = 
                  payment.status === 'SUCCESS' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                  payment.status === 'PENDING' ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10' :
                  'text-destructive bg-destructive/10';

                return (
                  <tr key={payment.id} className="hover:bg-secondary/25 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs truncate max-w-[150px]">{payment.transactionId || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{payment.bookingId.substring(0, 8).toUpperCase()}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payment.amount)}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold">{payment.provider}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-transparent ${statusColor}`}>
                        {statusIcon}
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
