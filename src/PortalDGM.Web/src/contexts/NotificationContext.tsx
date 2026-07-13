import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Notification } from '../models';
import { notificationService } from '../services';
import { useAuth } from './AuthContext';

interface NotifContextValue {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    user ? notificationService.getByUser(user.id) : []
  );

  const refresh = useCallback(() => {
    if (user) setNotifications(notificationService.getByUser(user.id));
  }, [user]);

  const markRead = (id: string) => {
    notificationService.markRead(id);
    refresh();
  };

  const markAllRead = () => {
    if (user) { notificationService.markAllRead(user.id); refresh(); }
  };

  return (
    <NotifContext.Provider value={{ notifications, unreadCount: notifications.filter(n => !n.read).length, refresh, markRead, markAllRead }}>
      {children}
    </NotifContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
