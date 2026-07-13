import type { ApplicationStatus } from '../models';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Borrador',
  submitted: 'Enviada',
  under_review: 'En revisión',
  observed: 'Observada',
  correction_sent: 'Corrección enviada',
  approved: 'Aprobada',
  pending_payment: 'Pendiente de pago',
  paid: 'Pagada',
  document_issued: 'Documento emitido',
  delivered: 'Entregada',
  rejected: 'Rechazada',
  expired: 'Caducada',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  draft: '#6b7280',
  submitted: '#3b82f6',
  under_review: '#8b5cf6',
  observed: '#f59e0b',
  correction_sent: '#06b6d4',
  approved: '#10b981',
  pending_payment: '#f97316',
  paid: '#10b981',
  document_issued: '#059669',
  delivered: '#065f46',
  rejected: '#ef4444',
  expired: '#dc2626',
};
