import type { Notification } from '../../models';
import { MOCK_NOTIFICATIONS } from '../../data';
import { storageAdapter } from './storageAdapter';

const KEY = 'notifications';

function getAll(): Notification[] {
  return storageAdapter.get<Notification[]>(KEY) ?? MOCK_NOTIFICATIONS;
}
function saveAll(n: Notification[]): void {
  storageAdapter.set(KEY, n);
}

export const notificationServiceMock = {
  getByUser(userId: string): Notification[] {
    return getAll().filter(n => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  markRead(id: string): void {
    const all = getAll();
    const idx = all.findIndex(n => n.id === id);
    if (idx !== -1) { all[idx] = { ...all[idx], read: true }; saveAll(all); }
  },

  markAllRead(userId: string): void {
    const all = getAll().map(n => n.userId === userId ? { ...n, read: true } : n);
    saveAll(all);
  },

  add(n: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const all = getAll();
    const notif: Notification = { ...n, id: `notif-${Date.now()}`, createdAt: new Date().toISOString() };
    saveAll([notif, ...all]);
    return notif;
  },
};
