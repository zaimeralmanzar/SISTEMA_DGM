import type { User } from '../models';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-001',
    email: 'ciudadano@dgm.demo',
    firstName: 'María',
    lastName: 'González',
    role: 'citizen',
    documentType: 'PASAPORTE',
    documentNumber: 'AB123456',
    nationality: 'Venezolana',
    birthDate: '1990-05-15',
    phone: '809-555-0101',
    address: 'Calle El Conde #45, Zona Colonial, Santo Domingo',
    secondaryEmail: 'maria.gonzalez@email.com',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'analista@dgm.demo',
    firstName: 'Carlos',
    lastName: 'Ramírez',
    role: 'analyst',
    documentNumber: '001-1234567-8',
    nationality: 'Dominicana',
    birthDate: '1985-11-20',
    phone: '809-555-0202',
    address: 'Av. México #12, Santo Domingo',
    createdAt: '2023-06-01T08:00:00Z',
  },
];

export const DEMO_PASSWORDS: Record<string, string> = {
  'ciudadano@dgm.demo': 'Demo1234*',
  'analista@dgm.demo': 'Demo1234*',
};
