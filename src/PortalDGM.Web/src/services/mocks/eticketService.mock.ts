import type { ETicket } from '../../models';
import { MOCK_ETICKETS } from '../../data';
import { storageAdapter } from './storageAdapter';

const KEY = 'etickets';

function getAll(): ETicket[] {
  return storageAdapter.get<ETicket[]>(KEY) ?? MOCK_ETICKETS;
}
function saveAll(e: ETicket[]): void {
  storageAdapter.set(KEY, e);
}

export const eticketServiceMock = {
  getByUser(userId: string): ETicket[] {
    return getAll().filter(e => e.userId === userId);
  },

  create(data: Omit<ETicket, 'id' | 'ticketNumber' | 'verificationCode' | 'createdAt'>): ETicket {
    const all = getAll();
    const num = String(all.length + 1).padStart(6, '0');
    const ticket: ETicket = {
      ...data,
      id: `et-${Date.now()}`,
      ticketNumber: `ET-${new Date().getFullYear()}-${num}`,
      verificationCode: `QR-ET-${num}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    saveAll([...all, ticket]);
    return ticket;
  },
};
