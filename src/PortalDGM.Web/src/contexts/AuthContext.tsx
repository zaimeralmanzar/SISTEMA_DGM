import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../models';
import { authService } from '../services';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'phone' | 'address' | 'secondaryEmail'>>) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'citizen' | 'analyst';
  documentType: 'PASAPORTE' | 'CEDULA';
  documentNumber: string;
  nationality: string;
  birthDate: string;
  phone: string;
  address: string;
  secondaryEmail?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const u = await authService.register({ ...data, role: data.role ?? 'citizen' });
    setUser(u);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'phone' | 'address' | 'secondaryEmail'>>) => {
    if (!user) return;
    const updated = authService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const changePassword = async (current: string, next: string) => {
    if (!user) return;
    authService.changePassword(user.id, current, next);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
