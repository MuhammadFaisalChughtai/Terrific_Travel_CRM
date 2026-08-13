import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import Modal from "./Modal";
import { ShieldCheck } from "lucide-react";

interface WaiveFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  fine: any;
}

export default function WaiveFineModal({ isOpen, onClose, fine }: WaiveFineModalProps) {
  const queryClient = useQueryClient();
  const [waivedReason, setWaivedReason] = useState("");

  const formatCurrency = (amount: number, curr?: string) => {
    const code = (curr || "GBP").toUpperCase();
    const symbols: Record<string, string> = {
      GBP: "£",
      USD: "$",
      EUR: "€",
      PKR: "Rs ",
      SAR: "SAR ",
      AED: "AED ",
    };
    const symbol = symbols[code] || `${code} `;
    return `${symbol}${(amount || 0).toFixed(2)}`;
  };

  const waiveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.patch(`/fines/admin/${fine?.id}/waive`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fines"] });
      toast.success("Fine waived successfully and confirmation email sent!");
      onClose();
      setWaivedReason("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to waive fine");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fine?.id) return;
    waiveMutation.mutate({ waivedReason: waivedReason.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Waive Staff Fine" maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl flex items-start gap-2.5">
          <ShieldCheck className="text-emerald-600 dark:text-emerald-400 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
            Waiving this fine of <strong className="font-bold">{formatCurrency(fine?.amount, fine?.currency)}</strong> for <strong className="font-bold">{fine?.agent?.name || "Agent"}</strong> will mark its status as WAIVED and send a waiver confirmation email.
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Waiver Explanation / Management Note
          </label>
          <textarea
            rows={3}
            value={waivedReason}
            onChange={(e) => setWaivedReason(e.target.value)}
            placeholder="Explain why this fine is being waived (e.g., Authorized emergency leave)..."
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
            disabled={waiveMutation.isPending}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {waiveMutation.isPending ? "Waiving..." : "Confirm & Waive Fine"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
