import { create } from 'zustand';
import { apiClient } from '../api/client';

export interface LocalNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: LocalNotification[];
  fetchNotifications: () => Promise<void>;
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  fetchNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data?.success) {
        set({ notifications: res.data.data });
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  },
  addNotification: (title, message) => set((state) => ({
    notifications: [
      {
        id: Math.random().toString(36).substring(2, 9),
        title,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...state.notifications,
    ],
  })),
  markAsRead: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
      }));
      await apiClient.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error(err);
    }
  },
  clearAll: async () => {
    try {
      set({ notifications: [] });
      await apiClient.delete('/notifications');
    } catch (err) {
      console.error(err);
    }
  },
}));
