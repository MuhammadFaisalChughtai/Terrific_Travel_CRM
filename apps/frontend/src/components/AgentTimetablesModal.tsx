import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import { Clock, Save, Loader2, RefreshCw } from "lucide-react";

interface AgentTimetablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentScheduleState {
  id: string;
  name: string;
  email: string;
  shiftStartTime: string;
  shiftEndTime: string;
  gracePeriodMinutes: number;
  saving?: boolean;
}

export default function AgentTimetablesModal({
  isOpen,
  onClose,
}: AgentTimetablesModalProps) {
  const queryClient = useQueryClient();
  const [agentsList, setAgentsList] = useState<AgentScheduleState[]>([]);

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ["agents", "timetables"],
    queryFn: async () => {
      const res = await apiClient.get("/agents");
      return res.data.data.items || [];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (agentsData && Array.isArray(agentsData)) {
      setAgentsList(
        agentsData.map((a: any) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          shiftStartTime: a.shiftStartTime || "09:00",
          shiftEndTime: a.shiftEndTime || "17:00",
          gracePeriodMinutes: a.gracePeriodMinutes ?? 15,
        }))
      );
    }
  }, [agentsData]);

  const updateAgentMutation = useMutation({
    mutationFn: async (agent: AgentScheduleState) => {
      return apiClient.put(`/agents/${agent.id}`, {
        name: agent.name,
        email: agent.email,
        shiftStartTime: agent.shiftStartTime,
        shiftEndTime: agent.shiftEndTime,
        gracePeriodMinutes: agent.gracePeriodMinutes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Agent timetable saved successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to update agent timetable"
      );
    },
  });

  const handleFieldChange = (
    id: string,
    field: keyof AgentScheduleState,
    val: any
  ) => {
    setAgentsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSaveSingle = async (agent: AgentScheduleState) => {
    handleFieldChange(agent.id, "saving", true);
    try {
      await updateAgentMutation.mutateAsync(agent);
    } finally {
      handleFieldChange(agent.id, "saving", false);
    }
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        agentsList.map((agent) =>
          apiClient.put(`/agents/${agent.id}`, {
            name: agent.name,
            email: agent.email,
            shiftStartTime: agent.shiftStartTime,
            shiftEndTime: agent.shiftEndTime,
            gracePeriodMinutes: agent.gracePeriodMinutes,
          })
        )
      );
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("All agent timetables updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to save all timetables"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Timetable & Shift Schedule"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 mb-0.5">
            <Clock size={14} className="text-amber-600 dark:text-amber-400" />
            Shift Start &amp; Grace Period Rules
          </p>
          Each agent's check-in timestamp is evaluated strictly against their
          assigned <strong>Shift Start Time</strong> plus{" "}
          <strong>Grace Period</strong>. If an agent checks in after this cutoff
          time, the system tags them as <code>LATE</code>. Update any staff
          member's timetable below to adjust their schedule.
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            Loading staff timetables...
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 uppercase text-[10px] font-bold text-muted-foreground tracking-wider border-b border-border sticky top-0 bg-background z-10">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Shift Start</th>
                    <th className="p-3">Shift End</th>
                    <th className="p-3">Grace (Mins)</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {agentsList.map((ag) => (
                    <tr
                      key={ag.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 font-bold text-foreground">
                        <div>{ag.name}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {ag.email}
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={ag.shiftStartTime}
                          onChange={(e) =>
                            handleFieldChange(
                              ag.id,
                              "shiftStartTime",
                              e.target.value
                            )
                          }
                          className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="time"
                          value={ag.shiftEndTime}
                          onChange={(e) =>
                            handleFieldChange(
                              ag.id,
                              "shiftEndTime",
                              e.target.value
                            )
                          }
                          className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            max={120}
                            value={ag.gracePeriodMinutes}
                            onChange={(e) =>
                              handleFieldChange(
                                ag.id,
                                "gracePeriodMinutes",
                                Number(e.target.value)
                              )
                            }
                            className="w-16 bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <span className="text-[10px] text-muted-foreground font-bold">
                            m
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          disabled={ag.saving}
                          onClick={() => handleSaveSingle(ag)}
                          className="px-2.5 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-[11px] font-bold flex items-center gap-1 ml-auto transition-colors disabled:opacity-50"
                        >
                          {ag.saving ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Save size={12} />
                          )}
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={14} />
            Save All Timetables
          </button>
        </div>
      </div>
    </Modal>
  );
}
