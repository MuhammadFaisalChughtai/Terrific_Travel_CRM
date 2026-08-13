import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import Modal from "./Modal";
import { AlertTriangle, DollarSign, Calendar, FileText, User } from "lucide-react";

interface IssueFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: any[];
}

export default function IssueFineModal({ isOpen, onClose, agents }: IssueFineModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    agentId: "",
    fineType: "MANUAL",
    amount: "10.00",
    currency: "GBP",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  const issueFineMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/fines/admin/issue", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fines"] });
      toast.success("Fine issued successfully and notification email sent!");
      onClose();
      setFormData({
        agentId: "",
        fineType: "MANUAL",
        amount: "10.00",
        currency: "GBP",
        reason: "",
        date: new Date().toISOString().split("T")[0],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to issue fine");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentId) {
      toast.error("Please select an agent");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid fine amount");
      return;
    }
    if (!formData.reason.trim()) {
      toast.error("Please enter a reason for the fine");
      return;
    }

    issueFineMutation.mutate({
      agentId: formData.agentId,
      fineType: formData.fineType,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      reason: formData.reason.trim(),
      date: formData.date,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Staff Fine" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3 rounded-xl flex items-start gap-2.5">
          <AlertTriangle className="text-amber-600 dark:text-amber-400 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
            Issuing a fine will instantly add it to the agent's portal ledger and dispatch an automated notification email via SMTP.
          </p>
        </div>

        {/* Select Agent */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <User size={14} /> Select Staff Member
          </label>
          <select
            value={formData.agentId}
            onChange={(e) => setFormData({ ...formData, agentId: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            required
          >
            <option value="">-- Choose Agent --</option>
            {agents?.map((ag: any) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Fine Type */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <FileText size={14} /> Violation Type
            </label>
            <select
              value={formData.fineType}
              onChange={(e) => setFormData({ ...formData, fineType: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="LATE_ARRIVAL">Late Arrival</option>
              <option value="ABSENCE">Unexcused Absence</option>
              <option value="MANUAL">Manual Fine</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="PKR">PKR (Rs)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (Dh)</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <DollarSign size={14} /> Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="10.00"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} /> Date of Violation
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        {/* Reason */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Reason / Violation Explanation
          </label>
          <textarea
            rows={3}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Specify reason for issuing fine..."
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={issueFineMutation.isPending}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {issueFineMutation.isPending ? "Issuing..." : "Issue Fine & Send Email"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
