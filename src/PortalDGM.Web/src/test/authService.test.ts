import { describe, it, expect, beforeEach } from 'vitest';
import { authServiceMock } from '../services/mocks/authService.mock';
import { storageAdapter } from '../services/mocks/storageAdapter';

beforeEach(() => {
  storageAdapter.remove('users');
  storageAdapter.remove('session');
  storageAdapter.remove('passwords');
});

describe('authService login', () => {
  it('logs in with demo citizen credentials', () => {
    const user = authServiceMock.login('ciudadano@dgm.demo', 'Demo1234*');
    expect(user.role).toBe('citizen');
    expect(user.email).toBe('ciudadano@dgm.demo');
  });

  it('logs in with demo analyst credentials', () => {
    const user = authServiceMock.login('analista@dgm.demo', 'Demo1234*');
    expect(user.role).toBe('analyst');
  });

  it('throws on wrong password', () => {
    expect(() => authServiceMock.login('ciudadano@dgm.demo', 'wrong')).toThrow();
  });

  it('throws on unknown email', () => {
    expect(() => authServiceMock.login('noexiste@test.com', 'Demo1234*')).toThrow();
  });
});

describe('authService register', () => {
  it('registers a new user', () => {
    const user = authServiceMock.register({
      email: 'nuevo@test.com', password: 'Test1234*', firstName: 'Juan', lastName: 'Pérez',
      role: 'citizen', documentType: 'passport', documentNumber: 'ZZ999999',
      nationality: 'Venezolana', birthDate: '1990-01-01', phone: '809-000-0000', address: 'Test 123',
    });
    expect(user.email).toBe('nuevo@test.com');
    expect(user.role).toBe('citizen');
  });

  it('throws on duplicate email', () => {
    authServiceMock.register({
      email: 'dup@test.com', password: 'Test1234*', firstName: 'A', lastName: 'B',
      role: 'citizen', documentType: 'passport', documentNumber: 'ZZ111111',
      nationality: 'Test', birthDate: '1990-01-01', phone: '809-000-0001', address: 'Addr 1',
    });
    expect(() => authServiceMock.register({
      email: 'dup@test.com', password: 'Test1234*', firstName: 'C', lastName: 'D',
      role: 'citizen', documentType: 'passport', documentNumber: 'ZZ222222',
      nationality: 'Test', birthDate: '1990-01-01', phone: '809-000-0002', address: 'Addr 2',
    })).toThrow();
  });
});
