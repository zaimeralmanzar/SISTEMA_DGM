import type { Appointment } from '../../models';
import { MOCK_APPOINTMENTS } from '../../data';
import { OFFICE_SCHEDULES } from '../../data/offices';
import { storageAdapter } from './storageAdapter';

const KEY = 'appointments';

function getAll(): Appointment[] {
  return storageAdapter.get<Appointment[]>(KEY) ?? MOCK_APPOINTMENTS;
}
function saveAll(apts: Appointment[]): void {
  storageAdapter.set(KEY, apts);
}

export const appointmentServiceMock = {
  getByUser(userId: string): Appointment[] {
    return getAll().filter(a => a.userId === userId);
  },

  getAvailableSlots(officeId: string, date: string): string[] {
    const all = getAll();
    const taken = all.filter(a => a.officeId === officeId && a.date === date && a.status !== 'cancelled').map(a => a.time);
    const all_slots = OFFICE_SCHEDULES[officeId] ?? [];
    return all_slots.filter(s => !taken.includes(s));
  },

  book(data: Omit<Appointment, 'id' | 'code' | 'createdAt'>): Appointment {
    const apts = getAll();
    const slots = this.getAvailableSlots(data.officeId, data.date);
    if (!slots.includes(data.time)) throw new Error('El horario seleccionado ya no está disponible.');
    const num = String(apts.length + 1).padStart(6, '0');
    const apt: Appointment = { ...data, id: `apt-${Date.now()}`, code: `CITA-${new Date().getFullYear()}-${num}`, createdAt: new Date().toISOString() };
    saveAll([...apts, apt]);
    return apt;
  },

  reschedule(id: string, date: string, time: string, officeId: string): Appointment {
    const apts = getAll();
    const idx = apts.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Cita no encontrada.');
    apts[idx] = { ...apts[idx], date, time, officeId, status: 'rescheduled' };
    saveAll(apts);
    return apts[idx];
  },

  cancel(id: string): void {
    const apts = getAll();
    const idx = apts.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Cita no encontrada.');
    apts[idx] = { ...apts[idx], status: 'cancelled' };
    saveAll(apts);
  },
};
