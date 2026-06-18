import { create } from "zustand";

interface DashboardState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedRange: "7d" | "30d" | "90d";
  setSelectedRange: (range: "7d" | "30d" | "90d") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedRange: "30d",
  setSelectedRange: (selectedRange) => set({ selectedRange }),
}));
