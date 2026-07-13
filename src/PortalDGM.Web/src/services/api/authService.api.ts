import type { User } from '../../models';
import { storageAdapter } from '../mocks/storageAdapter';
import type { RegisterData } from '../../contexts/AuthContext';

const BASE = import.meta.env.VITE_API_BASE_URL as string;
const SESSION_KEY = 'session';

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
        email: data.email,
        password: data.password,
        nombres: data.firstName,
        apellidos: data.lastName,
        tipo_documento: data.documentType === 'cedula' ? 'CEDULA' : 'PASAPORTE',
        numero_documento: data.documentNumber,
        nacionalidad: data.nationality,
        fecha_nacimiento: data.birthDate,
        telefono: data.phone,
        direccion: data.address,
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
    throw new Error('No implementado en API real aún.');
  },

  changePassword(_userId: string, _current: string, _next: string): void {
    throw new Error('No implementado en API real aún.');
  },
};

function mapApiUser(raw: Record<string, unknown>, email: string, fallback?: Partial<RegisterData>): User {
  return {
    id: String(raw?.id ?? raw?.usuario_id ?? `usr-${Date.now()}`),
    email: String(raw?.email ?? email),
    firstName: String(raw?.nombres ?? raw?.firstName ?? fallback?.firstName ?? ''),
    lastName: String(raw?.apellidos ?? raw?.lastName ?? fallback?.lastName ?? ''),
    role: (raw?.rol as User['role']) ?? 'citizen',
    documentType: (raw?.tipo_documento === 'CEDULA' ? 'cedula' : 'passport') as User['documentType'],
    documentNumber: String(raw?.numero_documento ?? raw?.documentNumber ?? fallback?.documentNumber ?? ''),
    nationality: String(raw?.nacionalidad ?? raw?.nationality ?? fallback?.nationality ?? ''),
    birthDate: String(raw?.fecha_nacimiento ?? raw?.birthDate ?? fallback?.birthDate ?? ''),
    phone: String(raw?.telefono ?? raw?.phone ?? fallback?.phone ?? ''),
    address: String(raw?.direccion ?? raw?.address ?? fallback?.address ?? ''),
    secondaryEmail: raw?.secondaryEmail ? String(raw.secondaryEmail) : undefined,
    createdAt: String(raw?.created_at ?? raw?.createdAt ?? new Date().toISOString()),
  };
}
