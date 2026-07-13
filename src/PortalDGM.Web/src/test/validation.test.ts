import { describe, it, expect } from 'vitest';
import { validateJpgFile, validatePassportExpiry, validatePassword, validateAge } from '../utils/validation';

describe('validateJpgFile', () => {
  it('accepts .jpg files', () => {
    const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateJpgFile(file)).toBeNull();
  });

  it('accepts .jpeg files', () => {
    const file = new File(['data'], 'test.jpeg', { type: 'image/jpeg' });
    expect(validateJpgFile(file)).toBeNull();
  });

  it('rejects .png files', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    expect(validateJpgFile(file)).not.toBeNull();
  });

  it('rejects .pdf files', () => {
    const file = new File(['data'], 'test.pdf', { type: 'application/pdf' });
    expect(validateJpgFile(file)).not.toBeNull();
  });

  it('rejects files over 5MB', () => {
    const large = new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    expect(validateJpgFile(large)).not.toBeNull();
  });
});

describe('validatePassportExpiry', () => {
  it('rejects passports expiring within 6 months', () => {
    const near = new Date();
    near.setMonth(near.getMonth() + 3);
    expect(validatePassportExpiry(near.toISOString().split('T')[0])).not.toBeNull();
  });

  it('accepts passports with more than 6 months', () => {
    const far = new Date();
    far.setMonth(far.getMonth() + 12);
    expect(validatePassportExpiry(far.toISOString().split('T')[0])).toBeNull();
  });
});

describe('validatePassword', () => {
  it('rejects short passwords', () => {
    expect(validatePassword('Ab1!')).not.toBeNull();
  });

  it('rejects passwords without uppercase', () => {
    expect(validatePassword('abc12345!')).not.toBeNull();
  });

  it('rejects passwords without numbers', () => {
    expect(validatePassword('Abcdefgh!')).not.toBeNull();
  });

  it('rejects passwords without special chars', () => {
    expect(validatePassword('Abcdefg1')).not.toBeNull();
  });

  it('accepts valid passwords', () => {
    expect(validatePassword('Demo1234*')).toBeNull();
  });
});

describe('validateAge', () => {
  it('returns false for underage users', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 16);
    expect(validateAge(birthDate.toISOString().split('T')[0], 18)).toBe(false);
  });

  it('returns true for adult users', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 25);
    expect(validateAge(birthDate.toISOString().split('T')[0], 18)).toBe(true);
  });
});
