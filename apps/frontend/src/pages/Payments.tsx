import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { formatCurrency } from '@tms/shared-utils';
import { CreditCard, CheckCircle2, XCircle, Clock, Search, FileText, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'requests' | 'ledger'>('requests');
  const queryClient = useQueryClient();

  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['payment-requests', 'PENDING'],
    queryFn: async () => {
      const res = await apiClient.get('/payments/requests?status=PENDING');
      return res.data.data;
    },
    enabled: activeTab === 'requests',
  });

  const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments-list'],
    queryFn: async () => {
      const res = await apiClient.get('/payments');
      return res.data.data;
    },
    enabled: activeTab === 'ledger',
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.post(`/payments/requests/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      toast.success('Payment request approved and transaction recorded!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to approve request.');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      return apiClient.post(`/payments/requests/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-requests'] });
      toast.success('Payment request rejected.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reject request.');
    }
  });

  const handleApprove = (id: string) => {
    if (window.confirm("Are you sure you want to approve this request? It will record the transaction and update balances.")) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason !== null) {
      rejectMutation.mutate({ id, reason });
    }
  };

  const requests = requestsData || [];
  const payments = paymentsData || [];

  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <CreditCard size={20} className="text-primary" />
          Payments & Approvals
        </h3>
        
        <div className="flex bg-secondary/20 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'requests' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Pending Approvals {requests.length > 0 && <span className="ml-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-[9px]">{requests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'ledger' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Global Ledger
          </button>
        </div>
      </div>

      {activeTab === 'requests' && (
        <div>
          {isLoadingRequests ? (
            <div className="text-center py-8 text-muted-foreground">Loading pending requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
              <p className="font-semibold text-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground">No pending payment requests to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase font-semibold">
                    <th className="py-3 px-4">Submitted By</th>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Date Submitted</th>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {requests.map((req: any) => (
                    <tr key={req.id} className="hover:bg-secondary/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-xs">
                        {req.createdBy?.firstName} {req.createdBy?.lastName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-primary">{req.booking?.bookingReference || req.bookingId.substring(0, 8)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(req.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">{req.paymentMethod}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.receiptUrl ? (
                          <a href={req.receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                            <FileText size={14} /> View
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-md transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-md transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div>
          {isLoadingPayments ? (
            <div className="text-center py-8 text-muted-foreground">Loading payments ledger...</div>
          ) : payments.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">No transactions found.</div>
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
      )}
    </div>
  );
}
