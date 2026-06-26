import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import { Loader2, CalendarRange, User, DollarSign, Lock, Hash } from "lucide-react";
import Modal from "./Modal";

interface CreateBookingInitModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: any[];
  user?: any; // Logged-in user from auth store
  onSuccess: (bookingId: string) => void;
}

export default function CreateBookingInitModal({
  isOpen,
  onClose,
  agents,
  user,
  onSuccess,
}: CreateBookingInitModalProps) {
  const [agentId, setAgentId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  const queryClient = useQueryClient();

  // Determine if the logged-in user is an agent (not admin/manager)
  const isAgent =
    !!user?.roles?.length &&
    !["Admin", "SUPER_ADMIN", "Manager", "BRANCH_MANAGER"].some((r) =>
      user?.roles?.includes(r)
    );

  // The agent profile linked to this user (by agentId or name match)
  const linkedAgent = React.useMemo(() => {
    if (!agents?.length) return null;
    if (user?.agentId) {
      return agents.find((a) => a.id === user.agentId) ?? null;
    }
    // Fallback: match by full name
    const userFullName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim()
      .toLowerCase();
    return (
      agents.find(
        (a) => a.name?.trim().toLowerCase() === userFullName
      ) ?? null
    );
  }, [agents, user]);

  // When modal opens, pre-select agent profile and fetch next booking reference
  useEffect(() => {
    if (isOpen) {
      if (linkedAgent) {
        setAgentId(linkedAgent.id);
      }
      apiClient.get("/bookings/next-reference")
        .then((res) => {
          if (res.data?.success && res.data?.data?.nextReference) {
            setBookingReference(res.data.data.nextReference);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch next booking reference:", err);
        });
    } else {
      // Reset on close
      setAgentId("");
      setDepartureDate("");
      setTotalPrice("");
      setBookingReference("");
    }
  }, [isOpen, linkedAgent]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/bookings", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Booking initialized successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess(data.id);

      // Reset form
      setAgentId("");
      setDepartureDate("");
      setTotalPrice("");
    },
    onError: (err: any) => {
      console.error("Booking creation error:", err.response?.data);
      toast.error(
        err.response?.data?.stack ||
          err.response?.data?.message ||
          "Failed to initialize booking."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      agentId: agentId || null,
      departureDate: departureDate || new Date().toISOString(),
      totalPrice: Number(totalPrice) || 0,
      bookingReference: (bookingReference || "").trim().toUpperCase() || null,
      status: "PENDING",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initialize New Booking" maxWidth="md">
      <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-secondary/10">

        {/* Decorative Top Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3 mb-1">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <CalendarRange size={20} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-xs">Start a New Booking</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Initialize the record. You can add flight, hotel, and visa details afterwards.
            </p>
          </div>
        </div>

        {/* Booking Reference */}
        <div>
          <label className="block text-[11px] font-bold text-foreground mb-1">
            Booking Reference
          </label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
              <Hash size={14} />
            </div>
            <input
              type="text"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value)}
              placeholder="Auto-generated (e.g. TT00964)"
              className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground shadow-sm hover:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all uppercase"
            />
          </div>
        </div>

        {/* Linked Agent Field */}
        <div>
          <label className="block text-[11px] font-bold text-foreground mb-1">
            Linked Agent
          </label>

          {isAgent && linkedAgent ? (
            /* ── Agent view: name shown as read-only with lock icon ── */
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-muted-foreground pointer-events-none">
                <User size={14} />
              </div>
              <div className="w-full pl-9 pr-10 py-1.5 bg-secondary/40 border border-border rounded-xl text-xs font-semibold text-foreground select-none cursor-not-allowed opacity-80">
                {linkedAgent.name}
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60">
                <Lock size={12} />
              </div>
            </div>
          ) : (
            /* ── Admin / Manager view: full interactive dropdown ── */
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
                <User size={14} />
              </div>
              <select
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground shadow-sm hover:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none transition-all cursor-pointer"
                required
              >
                <option value="" disabled>-- Select an Agent --</option>
                {agents?.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          )}

          {/* Helper caption for agents */}
          {isAgent && linkedAgent && (
            <p className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
              <Lock size={9} />
              Bookings are automatically assigned to your agent profile.
            </p>
          )}
          {isAgent && !linkedAgent && (
            <p className="mt-1 text-[10px] text-rose-500">
              ⚠ Your account is not linked to an agent profile. Contact your administrator.
            </p>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-[11px] font-bold text-foreground mb-1">
            Booking / Departure Date
          </label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
              <CalendarRange size={14} />
            </div>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground shadow-sm hover:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Total Price */}
        <div>
          <label className="block text-[11px] font-bold text-foreground mb-1">
            Total Expected Payment
          </label>
          <div className="relative group">
            <div className="absolute left-0 top-0 bottom-0 w-9 flex items-center justify-center text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
              <DollarSign size={14} />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              placeholder="e.g. 1500.00"
              className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground shadow-sm hover:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              required
            />
          </div>
        </div>

        <div className="sticky -bottom-5 bg-card flex justify-end gap-2.5 py-3 px-5 border-t border-border -mx-5 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-secondary text-foreground font-bold rounded-xl text-xs shadow-sm hover:bg-secondary/80 hover:shadow transition-all"
            disabled={createMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || (isAgent && !linkedAgent)}
            className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {createMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CalendarRange size={14} />
            )}
            Create Booking
          </button>
        </div>
      </form>
    </Modal>
  );
}
