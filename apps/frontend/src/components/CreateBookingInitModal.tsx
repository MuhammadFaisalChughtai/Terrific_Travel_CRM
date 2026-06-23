import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import { Loader2, CalendarRange, User, DollarSign } from "lucide-react";
import Modal from "./Modal";

interface CreateBookingInitModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: any[];
  onSuccess: (bookingId: string) => void;
}

export default function CreateBookingInitModal({
  isOpen,
  onClose,
  agents,
  onSuccess,
}: CreateBookingInitModalProps) {
  const [agentId, setAgentId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/bookings", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Booking initialized successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onSuccess(data.id); // Pass the newly created booking ID back
      
      // Reset form
      setAgentId("");
      setDepartureDate("");
      setTotalPrice("");
    },
    onError: (err: any) => {
      console.error("Booking creation error:", err.response?.data);
      toast.error(err.response?.data?.stack || err.response?.data?.message || "Failed to initialize booking.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      agentId: agentId || null,
      departureDate: departureDate || new Date().toISOString(),
      totalPrice: Number(totalPrice) || 0,
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
            <p className="text-[10px] text-muted-foreground mt-0.5">Initialize the record. You can add flight, hotel, and visa details afterwards.</p>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-foreground mb-1">
            Linked Agent
          </label>
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
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

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
            disabled={createMutation.isPending}
            className="px-5 py-1.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
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
