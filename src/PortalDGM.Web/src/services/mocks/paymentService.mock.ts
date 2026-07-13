import type { PaymentOrder } from '../../models';
import { MOCK_PAYMENTS } from '../../data';
import { storageAdapter } from './storageAdapter';

const KEY = 'payments';

function getAll(): PaymentOrder[] {
  return storageAdapter.get<PaymentOrder[]>(KEY) ?? MOCK_PAYMENTS;
}
function saveAll(p: PaymentOrder[]): void {
  storageAdapter.set(KEY, p);
}

export const paymentServiceMock = {
  getByUser(userId: string): PaymentOrder[] {
    return getAll().filter(p => p.userId === userId);
  },

  getById(id: string): PaymentOrder | null {
    return getAll().find(p => p.id === id) ?? null;
  },

  getByApplication(applicationId: string): PaymentOrder | null {
    return getAll().find(p => p.applicationId === applicationId) ?? null;
  },

  processPayment(orderId: string): PaymentOrder {
    const payments = getAll();
    const idx = payments.findIndex(p => p.id === orderId);
    if (idx === -1) throw new Error('Orden no encontrada.');
    const txnId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9999)}`;
    payments[idx] = { ...payments[idx], status: 'paid', paidAt: new Date().toISOString(), transactionId: txnId };
    saveAll(payments);
    return payments[idx];
  },

  createOrder(data: Omit<PaymentOrder, 'id' | 'orderNumber' | 'createdAt'>): PaymentOrder {
    const payments = getAll();
    const num = String(payments.length + 1).padStart(6, '0');
    const order: PaymentOrder = { ...data, id: `pay-${Date.now()}`, orderNumber: `ORD-${new Date().getFullYear()}-${num}`, createdAt: new Date().toISOString() };
    saveAll([...payments, order]);
    return order;
  },
};
