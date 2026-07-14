import type { User } from '../models';
import { storageAdapter } from './mocks/storageAdapter';
import type { RegisterData } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5092/api/v1';
const SESSION_KEY = 'session';

const NATIONALITY_TO_ISO3: Record<string, string> = {
  'dominicana': 'DOM', 'dominicano': 'DOM',
  'venezolana': 'VEN', 'venezolano': 'VEN', 'venezuela': 'VEN',
  'colombiana': 'COL', 'colombiano': 'COL', 'colombia': 'COL',
  'haitiana': 'HTI', 'haitiano': 'HTI', 'haiti': 'HTI',
  'estadounidense': 'USA', 'americana': 'USA', 'americano': 'USA', 'usa': 'USA',
  'cubana': 'CUB', 'cubano': 'CUB', 'cuba': 'CUB',
  'mexicana': 'MEX', 'mexicano': 'MEX', 'mexico': 'MEX',
  'brasilena': 'BRA', 'brasileno': 'BRA', 'brasil': 'BRA',
  'argentina': 'ARG', 'argentino': 'ARG',
  'peruana': 'PER', 'peruano': 'PER', 'peru': 'PER',
  'ecuatoriana': 'ECU', 'ecuatoriano': 'ECU', 'ecuador': 'ECU',
  'hondurena': 'HND', 'hondureno': 'HND', 'honduras': 'HND',
  'panamera': 'PAN', 'panamero': 'PAN', 'panama': 'PAN',
  'costarricense': 'CRI', 'costa rica': 'CRI',
  'nicaraguense': 'NIC', 'nicaragua': 'NIC',
};

function toISO3(value: string): string {
  const trimmed = value.trim();
  if (/^[A-Za-z]{3}$/.test(trimmed)) return trimmed.toUpperCase();
  const normalized = trimmed.toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/[ñ]/g, 'n');
  return NATIONALITY_TO_ISO3[normalized] ?? trimmed;
}

export const apiAuthService = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error en el servidor' }));
      throw new Error(error.message || 'Contrasena o correo incorrecto.');
    }
    const user = await res.json();
    storageAdapter.set(SESSION_KEY, user);
    return user;
  },

  logout(): void {
    storageAdapter.remove(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    return storageAdapter.get<User>(SESSION_KEY);
  },

  async register(data: RegisterData & { role?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombres: data.firstName,
        apellidos: data.lastName,
        tipo_documento: data.documentType,
        numero_documento: data.documentNumber,
        nacionalidad: toISO3(data.nationality),
        fecha_nacimiento: data.birthDate,
      }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Error al registrar usuario: ' + errorText);
    }
    const body = await res.json();
    const raw = body?.data ?? body;
    const user: User = {
      id: String(raw?.id ?? `usr-${Date.now()}`),
      email: data.email,
      firstName: String(raw?.nombres ?? data.firstName),
      lastName: String(raw?.apellidos ?? data.lastName),
      role: 'citizen',
      documentType: (data.documentType === 'CEDULA' ? 'CEDULA' : 'PASAPORTE') as User['documentType'],
      documentNumber: String(raw?.numero_documento ?? data.documentNumber),
      nationality: String(raw?.nacionalidad ?? data.nationality),
      birthDate: String(raw?.fecha_nacimiento ?? data.birthDate),
      phone: data.phone ?? '',
      address: data.address ?? '',
      createdAt: String(raw?.creado_en ?? new Date().toISOString()),
    };
    // Guardar en lista local para que el login funcione despues
    const users: User[] = storageAdapter.get<User[]>('users') ?? [];
    if (!users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      storageAdapter.set('users', [...users, user]);
    }
    const passwords: Record<string, string> = storageAdapter.get<Record<string, string>>('passwords') ?? {};
    passwords[user.email] = data.password;
    storageAdapter.set('passwords', passwords);
    storageAdapter.set(SESSION_KEY, user);
    return user;
  },

  async updateProfile(_userId: string, _updates: Partial<Pick<User, 'phone' | 'address' | 'secondaryEmail'>>): Promise<User> {
    throw new Error('Not implemented');
  },

  async changePassword(_userId: string, _currentPassword: string, _newPassword: string): Promise<void> {
    throw new Error('Not implemented');
  },
};
