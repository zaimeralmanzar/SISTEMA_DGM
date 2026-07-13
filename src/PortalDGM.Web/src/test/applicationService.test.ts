import { describe, it, expect, beforeEach } from 'vitest';
import { applicationServiceMock } from '../services/mocks/applicationService.mock';
import { storageAdapter } from '../services/mocks/storageAdapter';

beforeEach(() => {
  storageAdapter.remove('applications');
});

describe('applicationService', () => {
  it('creates a new application', () => {
    const app = applicationServiceMock.create({
      serviceId: 'SRV-001', serviceName: 'Test Service', userId: 'usr-001',
      status: 'submitted', officeId: 'off-001', officeName: 'Sede Central',
      amount: 3500,
      personalData: { firstName: 'María', lastName: 'González', nationality: 'Venezolana', passport: 'AB123456', birthDate: '1990-05-15', maritalStatus: 'Soltera', address: 'Calle Test', phone: '809-000-0000', email: 'test@test.com' },
      migratoryData: { tramiteType: 'Primera vez', currentCategory: 'Turista', entryDate: '2024-01-01', passportExpiry: '2028-01-01', reason: 'Test', preferredOffice: 'off-001' },
      documents: [],
      analystComment: undefined, nextStep: undefined, paymentOrderId: undefined, appointmentId: undefined, issuedDocumentId: undefined,
    });
    expect(app.trackingNumber).toMatch(/^DGM-\d{4}-\d{6}$/);
    expect(app.status).toBe('submitted');
  });

  it('updates application status', () => {
    const app = applicationServiceMock.create({
      serviceId: 'SRV-001', serviceName: 'Test', userId: 'usr-001', status: 'submitted',
      officeId: 'off-001', officeName: 'Sede', amount: 1000,
      personalData: { firstName: 'A', lastName: 'B', nationality: 'C', passport: 'D', birthDate: '1990-01-01', maritalStatus: 'S', address: 'E', phone: 'F', email: 'g@g.com' },
      migratoryData: { tramiteType: 'Primera vez', currentCategory: 'Turista', entryDate: '2024-01-01', passportExpiry: '2028-01-01', reason: 'R', preferredOffice: 'off-001' },
      documents: [],
      analystComment: undefined, nextStep: undefined, paymentOrderId: undefined, appointmentId: undefined, issuedDocumentId: undefined,
    });
    const updated = applicationServiceMock.updateStatus(app.id, 'under_review', 'En revisión', 'Analista');
    expect(updated.status).toBe('under_review');
    expect(updated.timeline.length).toBeGreaterThan(1);
  });

  it('retrieves applications by user', () => {
    applicationServiceMock.create({
      serviceId: 'SRV-001', serviceName: 'Test', userId: 'usr-test-999', status: 'draft',
      officeId: 'off-001', officeName: 'Sede', amount: 0,
      personalData: { firstName: 'X', lastName: 'Y', nationality: 'Z', passport: 'W', birthDate: '1990-01-01', maritalStatus: 'S', address: 'A', phone: 'B', email: 'c@c.com' },
      migratoryData: { tramiteType: 'Primera vez', currentCategory: 'Turista', entryDate: '2024-01-01', passportExpiry: '2028-01-01', reason: 'R', preferredOffice: 'off-001' },
      documents: [],
      analystComment: undefined, nextStep: undefined, paymentOrderId: undefined, appointmentId: undefined, issuedDocumentId: undefined,
    });
    const apps = applicationServiceMock.getByUser('usr-test-999');
    expect(apps.length).toBe(1);
  });
});
