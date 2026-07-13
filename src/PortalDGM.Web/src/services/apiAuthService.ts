import type { User } from '../models';
import { storageAdapter } from './mocks/storageAdapter';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5092/api/v1';
const SESSION_KEY = 'session';

export const apiAuthService = {
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Error en el servidor' }));
      throw new Error(error.message || 'Contraseña o correo incorrecto.');
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

  async register(data: any): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error('Error al registrar usuario: ' + errorText);
    }
    
    const user = await res.json();
    storageAdapter.set(SESSION_KEY, user);
    return user;
  },

  async updateProfile(userId: string, updates: any): Promise<User> {
    // Falta implementar en la API
    throw new Error('Not implemented');
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Falta implementar en la API
    throw new Error('Not implemented');
  }
};
