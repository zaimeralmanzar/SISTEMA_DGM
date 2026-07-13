import { describe, it, expect } from 'vitest';
import { documentVerificationServiceMock } from '../services/mocks/documentVerificationService.mock';

describe('documentVerificationService', () => {
  it('finds a valid document by verification code', () => {
    const doc = documentVerificationServiceMock.verify('DGM-VER-8472-XKPL');
    expect(doc).not.toBeNull();
    expect(doc?.status).toBe('valid');
  });

  it('finds an expired document', () => {
    const doc = documentVerificationServiceMock.verify('DGM-VER-0234-ABCD');
    expect(doc?.status).toBe('expired');
  });

  it('finds a revoked document', () => {
    const doc = documentVerificationServiceMock.verify('DGM-VER-0099-REVO');
    expect(doc?.status).toBe('revoked');
  });

  it('returns null for unknown code', () => {
    const doc = documentVerificationServiceMock.verify('INVALID-CODE-9999');
    expect(doc).toBeNull();
  });

  it('is case insensitive', () => {
    const doc = documentVerificationServiceMock.verify('dgm-ver-8472-xkpl');
    expect(doc).not.toBeNull();
  });

  it('finds by document number', () => {
    const doc = documentVerificationServiceMock.verify('RT-2025-001847');
    expect(doc).not.toBeNull();
  });
});
