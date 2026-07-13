import type { Office } from '../models';

export const OFFICES: Office[] = [
  { id: 'off-001', name: 'Sede Central', address: 'Av. 30 de Mayo, Santo Domingo', phone: '809-508-2555' },
  { id: 'off-002', name: 'Santiago', address: 'Calle del Sol #45, Santiago de los Caballeros', phone: '809-508-2556' },
  { id: 'off-003', name: 'Punta Cana', address: 'Aeropuerto Internacional del Caribe, La Altagracia', phone: '809-508-2557' },
  { id: 'off-004', name: 'Puerto Plata', address: 'Calle Beller #22, Puerto Plata', phone: '809-508-2558' },
  { id: 'off-005', name: 'Las Américas', address: 'Aeropuerto Internacional de las Américas, Santo Domingo Este', phone: '809-508-2559' },
];

export const OFFICE_SCHEDULES: Record<string, string[]> = {
  'off-001': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'],
  'off-002': ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  'off-003': ['09:00', '10:00', '11:00', '14:00', '15:00'],
  'off-004': ['08:30', '09:30', '10:30', '14:30', '15:30'],
  'off-005': ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
};
