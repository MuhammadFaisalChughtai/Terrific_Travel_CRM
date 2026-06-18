import { create } from 'zustand';

export interface LocalNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: LocalNotification[];
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 'welcome-notification',
      title: 'Welcome to Terrific Travel!',
      message: 'Explore and manage your enterprise flights, hotels, and tours seamlessly.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }
  ],
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
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),
  clearAll: () => set({ notifications: [] }),
}));
