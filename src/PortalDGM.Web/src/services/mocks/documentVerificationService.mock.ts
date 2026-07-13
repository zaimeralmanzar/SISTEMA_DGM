import type { IssuedDocument } from '../../models';
import { MOCK_ISSUED_DOCUMENTS } from '../../data';

export const documentVerificationServiceMock = {
  verify(query: string): IssuedDocument | null {
    const q = query.trim().toUpperCase();
    return MOCK_ISSUED_DOCUMENTS.find(d =>
      d.documentNumber.toUpperCase() === q ||
      (d.carnetNumber && d.carnetNumber.toUpperCase() === q) ||
      d.verificationCode.toUpperCase() === q
    ) ?? null;
  },
};
