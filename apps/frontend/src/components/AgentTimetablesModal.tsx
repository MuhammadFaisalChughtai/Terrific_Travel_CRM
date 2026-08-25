import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";
import { Clock, Save, Loader2, RefreshCw, Sun, Palmtree } from "lucide-react";

interface AgentTimetablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentScheduleState {
  id: string;
  name: string;
  email: string;
  // Weekday
  shiftStartTime: string;
  shiftEndTime: string;
  gracePeriodMinutes: number;
  workDays: string;
  // Weekend
  weekendShiftStartTime: string;
  weekendShiftEndTime: string;
  weekendGracePeriodMinutes: number;
  isWeekendOff: boolean;
  // Holiday
  holidayShiftStartTime: string;
  holidayShiftEndTime: string;
  holidayGracePeriodMinutes: number;
  isHolidayOff: boolean;
  saving?: boolean;
}

export default function AgentTimetablesModal({
  isOpen,
  onClose,
}: AgentTimetablesModalProps) {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<"weekdays" | "weekends" | "holidays">("weekdays");
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
          workDays: a.workDays || "Mon,Tue,Wed,Thu,Fri",
          weekendShiftStartTime: a.weekendShiftStartTime || "10:00",
          weekendShiftEndTime: a.weekendShiftEndTime || "16:00",
          weekendGracePeriodMinutes: a.weekendGracePeriodMinutes ?? 15,
          isWeekendOff: Boolean(a.isWeekendOff),
          holidayShiftStartTime: a.holidayShiftStartTime || "10:00",
          holidayShiftEndTime: a.holidayShiftEndTime || "15:00",
          holidayGracePeriodMinutes: a.holidayGracePeriodMinutes ?? 15,
          isHolidayOff: a.isHolidayOff !== undefined ? Boolean(a.isHolidayOff) : true,
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
        workDays: agent.workDays,
        weekendShiftStartTime: agent.weekendShiftStartTime,
        weekendShiftEndTime: agent.weekendShiftEndTime,
        weekendGracePeriodMinutes: agent.weekendGracePeriodMinutes,
        isWeekendOff: agent.isWeekendOff,
        holidayShiftStartTime: agent.holidayShiftStartTime,
        holidayShiftEndTime: agent.holidayShiftEndTime,
        holidayGracePeriodMinutes: agent.holidayGracePeriodMinutes,
        isHolidayOff: agent.isHolidayOff,
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
            workDays: agent.workDays,
            weekendShiftStartTime: agent.weekendShiftStartTime,
            weekendShiftEndTime: agent.weekendShiftEndTime,
            weekendGracePeriodMinutes: agent.weekendGracePeriodMinutes,
            isWeekendOff: agent.isWeekendOff,
            holidayShiftStartTime: agent.holidayShiftStartTime,
            holidayShiftEndTime: agent.holidayShiftEndTime,
            holidayGracePeriodMinutes: agent.holidayGracePeriodMinutes,
            isHolidayOff: agent.isHolidayOff,
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
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Category Navigation Tabs */}
        <div className="flex border-b border-border gap-2 pb-0.5">
          <button
            type="button"
            onClick={() => setActiveCategory("weekdays")}
            className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeCategory === "weekdays"
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock size={14} />
            Weekdays Schedule (Mon-Fri)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("weekends")}
            className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeCategory === "weekends"
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun size={14} className="text-amber-500" />
            Weekend Schedule (Sat-Sun)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("holidays")}
            className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              activeCategory === "holidays"
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Palmtree size={14} className="text-emerald-500" />
            Holidays Timetable
          </button>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5 mb-0.5">
            <Clock size={14} className="text-amber-600 dark:text-amber-400" />
            {activeCategory === "weekdays" && "Weekdays Shift Rules (Monday - Friday)"}
            {activeCategory === "weekends" && "Weekend Shift Rules (Saturday - Sunday)"}
            {activeCategory === "holidays" && "Holiday Shift Rules & Offday Exemptions"}
          </p>
          {activeCategory === "weekdays" && (
            <span>
              Standard weekday working hours. Check-in timestamps are evaluated against the assigned <strong>Shift Start Time</strong> plus <strong>Grace Period</strong>.
            </span>
          )}
          {activeCategory === "weekends" && (
            <span>
              Configure weekend shift hours or toggle <strong>Weekend Day Off</strong> to exempt staff from attendance penalties on Saturdays &amp; Sundays.
            </span>
          )}
          {activeCategory === "holidays" && (
            <span>
              Configure official holiday shift hours or toggle <strong>Holiday Off</strong> to exempt staff from attendance penalties on company holidays.
            </span>
          )}
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
                    {activeCategory === "weekdays" && (
                      <>
                        <th className="p-3">Shift Start</th>
                        <th className="p-3">Shift End</th>
                        <th className="p-3">Grace (Mins)</th>
                      </>
                    )}
                    {activeCategory === "weekends" && (
                      <>
                        <th className="p-3">Day Off Status</th>
                        <th className="p-3">Sat/Sun Shift Start</th>
                        <th className="p-3">Sat/Sun Shift End</th>
                        <th className="p-3">Grace (Mins)</th>
                      </>
                    )}
                    {activeCategory === "holidays" && (
                      <>
                        <th className="p-3">Holiday Off Status</th>
                        <th className="p-3">Holiday Shift Start</th>
                        <th className="p-3">Holiday Shift End</th>
                        <th className="p-3">Grace (Mins)</th>
                      </>
                    )}
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

                      {/* WEEKDAYS TAB */}
                      {activeCategory === "weekdays" && (
                        <>
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
                        </>
                      )}

                      {/* WEEKENDS TAB */}
                      {activeCategory === "weekends" && (
                        <>
                          <td className="p-3">
                            <label className="flex items-center gap-1.5 font-bold cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={ag.isWeekendOff}
                                onChange={(e) =>
                                  handleFieldChange(
                                    ag.id,
                                    "isWeekendOff",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 rounded text-primary focus:ring-primary"
                              />
                              <span className={ag.isWeekendOff ? "text-emerald-600 font-extrabold" : "text-foreground"}>
                                {ag.isWeekendOff ? "DAY OFF (EXEMPT)" : "WORKING SHIFT"}
                              </span>
                            </label>
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              disabled={ag.isWeekendOff}
                              value={ag.weekendShiftStartTime}
                              onChange={(e) =>
                                handleFieldChange(
                                  ag.id,
                                  "weekendShiftStartTime",
                                  e.target.value
                                )
                              }
                              className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              disabled={ag.isWeekendOff}
                              value={ag.weekendShiftEndTime}
                              onChange={(e) =>
                                handleFieldChange(
                                  ag.id,
                                  "weekendShiftEndTime",
                                  e.target.value
                                )
                              }
                              className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={120}
                                disabled={ag.isWeekendOff}
                                value={ag.weekendGracePeriodMinutes}
                                onChange={(e) =>
                                  handleFieldChange(
                                    ag.id,
                                    "weekendGracePeriodMinutes",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                              />
                              <span className="text-[10px] text-muted-foreground font-bold">
                                m
                              </span>
                            </div>
                          </td>
                        </>
                      )}

                      {/* HOLIDAYS TAB */}
                      {activeCategory === "holidays" && (
                        <>
                          <td className="p-3">
                            <label className="flex items-center gap-1.5 font-bold cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={ag.isHolidayOff}
                                onChange={(e) =>
                                  handleFieldChange(
                                    ag.id,
                                    "isHolidayOff",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 rounded text-primary focus:ring-primary"
                              />
                              <span className={ag.isHolidayOff ? "text-blue-600 font-extrabold" : "text-foreground"}>
                                {ag.isHolidayOff ? "HOLIDAY OFF (EXEMPT)" : "SPECIAL HOLIDAY SHIFT"}
                              </span>
                            </label>
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              disabled={ag.isHolidayOff}
                              value={ag.holidayShiftStartTime}
                              onChange={(e) =>
                                handleFieldChange(
                                  ag.id,
                                  "holidayShiftStartTime",
                                  e.target.value
                                )
                              }
                              className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              disabled={ag.isHolidayOff}
                              value={ag.holidayShiftEndTime}
                              onChange={(e) =>
                                handleFieldChange(
                                  ag.id,
                                  "holidayShiftEndTime",
                                  e.target.value
                                )
                              }
                              className="bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={120}
                                disabled={ag.isHolidayOff}
                                value={ag.holidayGracePeriodMinutes}
                                onChange={(e) =>
                                  handleFieldChange(
                                    ag.id,
                                    "holidayGracePeriodMinutes",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 bg-background border border-border rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
                              />
                              <span className="text-[10px] text-muted-foreground font-bold">
                                m
                              </span>
                            </div>
                          </td>
                        </>
                      )}

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
