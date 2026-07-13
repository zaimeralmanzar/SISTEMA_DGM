import type { PaymentOrder } from '../models';

export const MOCK_PAYMENTS: PaymentOrder[] = [
  {
    id: 'pay-001',
    orderNumber: 'ORD-2024-001847',
    applicationId: 'app-001',
    userId: 'usr-001',
    concept: 'Solicitud de Residencia Temporal Ordinaria RT-9',
    amount: 3500,
    status: 'paid',
    createdAt: '2024-03-10T11:05:00Z',
    paidAt: '2024-03-12T14:00:00Z',
    transactionId: 'TXN-20240312-8472',
  },
  {
    id: 'pay-002',
    orderNumber: 'ORD-2024-002341',
    applicationId: 'app-002',
    userId: 'usr-001',
    concept: 'Renovación de Residencia Temporal',
    amount: 2000,
    status: 'pending',
    createdAt: '2024-05-10T09:00:00Z',
  },
];
