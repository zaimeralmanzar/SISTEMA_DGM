import type { AccessLog } from '../models';

export const MOCK_ACCESS_LOGS: AccessLog[] = [
  { id: 'log-001', date: '2024-06-10T08:32:00Z', ip: '192.168.1.45', device: 'Chrome / Windows', action: 'Inicio de sesión' },
  { id: 'log-002', date: '2024-06-09T17:15:00Z', ip: '192.168.1.45', device: 'Chrome / Windows', action: 'Inicio de sesión' },
  { id: 'log-003', date: '2024-06-09T17:45:00Z', ip: '192.168.1.45', device: 'Chrome / Windows', action: 'Cierre de sesión' },
  { id: 'log-004', date: '2024-06-08T10:00:00Z', ip: '10.0.0.12', device: 'Safari / iPhone', action: 'Inicio de sesión' },
];
