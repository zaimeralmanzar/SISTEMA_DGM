import type { Notification } from '../models';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'usr-001',
    title: 'Documento emitido',
    message: 'Su carnet de Residencia Temporal ha sido emitido. Puede retirarlo en la Sede Central.',
    type: 'success',
    read: false,
    createdAt: '2024-04-15T14:30:00Z',
    applicationId: 'app-001',
  },
  {
    id: 'notif-002',
    userId: 'usr-001',
    title: 'Solicitud observada',
    message: 'Su solicitud de Renovación de Residencia Temporal requiere correcciones. Revise los documentos observados.',
    type: 'warning',
    read: false,
    createdAt: '2024-05-20T11:00:00Z',
    applicationId: 'app-002',
  },
  {
    id: 'notif-003',
    userId: 'usr-001',
    title: 'Solicitud recibida',
    message: 'Su solicitud DGM-2024-001847 ha sido recibida y será procesada en breve.',
    type: 'info',
    read: true,
    createdAt: '2024-02-01T10:00:00Z',
    applicationId: 'app-001',
  },
  {
    id: 'notif-004',
    userId: 'usr-001',
    title: 'Cita confirmada',
    message: 'Su cita en Sede Central ha sido confirmada para el 20 de abril de 2024 a las 09:00.',
    type: 'info',
    read: true,
    createdAt: '2024-03-13T08:00:00Z',
    applicationId: 'app-001',
  },
];
