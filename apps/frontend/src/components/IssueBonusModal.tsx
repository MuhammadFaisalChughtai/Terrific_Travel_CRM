import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import Modal from "./Modal";
import { Gift, DollarSign, Calendar, FileText, User } from "lucide-react";

interface IssueBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: any[];
}

export default function IssueBonusModal({ isOpen, onClose, agents }: IssueBonusModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    agentId: "",
    bonusType: "PERFORMANCE",
    amount: "20.00",
    currency: "GBP",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  const issueBonusMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/bonuses/admin/issue", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bonuses"] });
      toast.success("Bonus awarded successfully and notification email sent!");
      onClose();
      setFormData({
        agentId: "",
        bonusType: "PERFORMANCE",
        amount: "20.00",
        currency: "GBP",
        reason: "",
        date: new Date().toISOString().split("T")[0],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to award bonus");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentId) {
      toast.error("Please select an agent");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid bonus amount");
      return;
    }
    if (!formData.reason.trim()) {
      toast.error("Please enter a reason for the bonus");
      return;
    }

    issueBonusMutation.mutate({
      agentId: formData.agentId,
      bonusType: formData.bonusType,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      reason: formData.reason.trim(),
      date: formData.date,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Award Staff Bonus &amp; Reward" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl flex items-start gap-2.5">
          <Gift className="text-emerald-600 dark:text-emerald-400 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
            Awarding a bonus will add it to the staff member's portal ledger and dispatch a congratulatory email notification via SMTP.
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
          {/* Bonus Type */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <FileText size={14} /> Bonus Type
            </label>
            <select
              value={formData.bonusType}
              onChange={(e) => setFormData({ ...formData, bonusType: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="EARLY_CHECKIN">Early Check-in</option>
              <option value="ON_TIME">Punctuality Award</option>
              <option value="PERFORMANCE">Performance Award</option>
              <option value="MANUAL">Special Bonus</option>
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
              placeholder="20.00"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} /> Award Date
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
            Reason / Appreciation Note
          </label>
          <textarea
            rows={3}
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Specify reason for awarding bonus (e.g. Perfect month punctuality, Sales target achieved)..."
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
            disabled={issueBonusMutation.isPending}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {issueBonusMutation.isPending ? "Awarding..." : "Award Bonus & Send Email"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
