import type { User } from '../../models';
import { DEMO_USERS, DEMO_PASSWORDS } from '../../data';
import { storageAdapter } from './storageAdapter';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

function getUsers(): User[] {
  return storageAdapter.get<User[]>(USERS_KEY) ?? DEMO_USERS;
}

function saveUsers(users: User[]): void {
  storageAdapter.set(USERS_KEY, users);
}

export const authServiceMock = {
  login(email: string, password: string): User {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error('Correo electrónico no encontrado.');

    const storedPasswords = storageAdapter.get<Record<string, string>>('passwords') ?? DEMO_PASSWORDS;
    const correctPassword = storedPasswords[user.email] ?? DEMO_PASSWORDS[user.email];
    if (!correctPassword || password !== correctPassword) throw new Error('Contraseña incorrecta.');

    storageAdapter.set(SESSION_KEY, user);
    return user;
  },

  logout(): void {
    storageAdapter.remove(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    return storageAdapter.get<User>(SESSION_KEY);
  },

  register(data: Omit<User, 'id' | 'createdAt'> & { password: string }): User {
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'citizen',
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      nationality: data.nationality,
      birthDate: data.birthDate,
      phone: data.phone,
      address: data.address,
      secondaryEmail: data.secondaryEmail,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const passwords = storageAdapter.get<Record<string, string>>('passwords') ?? { ...DEMO_PASSWORDS };
    passwords[newUser.email] = data.password;
    storageAdapter.set('passwords', passwords);
    storageAdapter.set(SESSION_KEY, newUser);
    return newUser;
  },

  updateProfile(userId: string, updates: Partial<Pick<User, 'phone' | 'address' | 'secondaryEmail'>>): User {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Usuario no encontrado.');
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    const session = storageAdapter.get<User>(SESSION_KEY);
    if (session?.id === userId) storageAdapter.set(SESSION_KEY, users[idx]);
    return users[idx];
  },

  changePassword(userId: string, currentPassword: string, newPassword: string): void {
    const user = getUsers().find(u => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado.');
    const passwords = storageAdapter.get<Record<string, string>>('passwords') ?? { ...DEMO_PASSWORDS };
    const current = passwords[user.email] ?? DEMO_PASSWORDS[user.email];
    if (current !== currentPassword) throw new Error('La contraseña actual es incorrecta.');
    passwords[user.email] = newPassword;
    storageAdapter.set('passwords', passwords);
  },
};
