import type { Appointment } from '../models';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    code: 'CITA-2024-001847',
    userId: 'usr-001',
    applicationId: 'app-001',
    officeId: 'off-001',
    officeName: 'Sede Central',
    date: '2024-04-20',
    time: '09:00',
    status: 'completed',
    createdAt: '2024-03-13T08:00:00Z',
  },
  {
    id: 'apt-002',
    code: 'CITA-2024-003201',
    userId: 'usr-001',
    applicationId: 'app-002',
    officeId: 'off-001',
    officeName: 'Sede Central',
    date: '2024-08-15',
    time: '10:00',
    status: 'scheduled',
    createdAt: '2024-06-01T10:00:00Z',
  },
];
