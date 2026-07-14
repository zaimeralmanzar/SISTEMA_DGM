import type { User } from '../../models';
import { storageAdapter } from '../mocks/storageAdapter';
import type { RegisterData } from '../../contexts/AuthContext';

const BASE = import.meta.env.VITE_API_BASE_URL as string;
const SESSION_KEY = 'session';

const NATIONALITY_TO_ISO3: Record<string, string> = {
  'dominicana': 'DOM', 'dominicano': 'DOM',
  'venezolana': 'VEN', 'venezolano': 'VEN', 'venezuela': 'VEN',
  'colombiana': 'COL', 'colombiano': 'COL', 'colombia': 'COL',
  'haitiana': 'HTI', 'haitiano': 'HTI', 'haiti': 'HTI',
  'estadounidense': 'USA', 'americana': 'USA', 'americano': 'USA', 'usa': 'USA',
  'española': 'ESP', 'espanol': 'ESP', 'espanola': 'ESP',
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

export const authServiceApi = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? 'Credenciales incorrectas.');
    }
    const data = await res.json();
    const user: User = mapApiUser(data?.data ?? data, email);
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
    const res = await fetch(`${BASE}/auth/register`, {
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
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? 'Error al registrar. Intente de nuevo.');
    }
    const body = await res.json();
    const user: User = mapApiUser(body?.data ?? body, data.email, data);
    storageAdapter.set(SESSION_KEY, user);
    return user;
  },

  updateProfile(_userId: string, _updates: Partial<Pick<User, 'phone' | 'address' | 'secondaryEmail'>>): User {
    throw new Error('No implementado en API real aun.');
  },

  changePassword(_userId: string, _current: string, _next: string): void {
    throw new Error('No implementado en API real aun.');
  },
};

function mapApiUser(raw: Record<string, unknown>, email: string, fallback?: Partial<RegisterData>): User {
  return {
    id: String(raw?.id ?? raw?.usuario_id ?? `usr-${Date.now()}`),
    email: String(raw?.email ?? email),
    firstName: String(raw?.nombres ?? raw?.firstName ?? fallback?.firstName ?? ''),
    lastName: String(raw?.apellidos ?? raw?.lastName ?? fallback?.lastName ?? ''),
    role: (raw?.rol as User['role']) ?? 'citizen',
    documentType: (raw?.tipo_documento === 'CEDULA' ? 'CEDULA' : 'PASAPORTE') as User['documentType'],
    documentNumber: String(raw?.numero_documento ?? raw?.documentNumber ?? fallback?.documentNumber ?? ''),
    nationality: String(raw?.nacionalidad ?? raw?.nationality ?? fallback?.nationality ?? ''),
    birthDate: String(raw?.fecha_nacimiento ?? raw?.birthDate ?? fallback?.birthDate ?? ''),
    phone: String(raw?.telefono ?? raw?.phone ?? fallback?.phone ?? ''),
    address: String(raw?.direccion ?? raw?.address ?? fallback?.address ?? ''),
    secondaryEmail: raw?.secondaryEmail ? String(raw.secondaryEmail) : undefined,
    createdAt: String(raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
  };
}
