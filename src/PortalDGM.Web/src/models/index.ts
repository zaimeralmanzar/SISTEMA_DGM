export type UserRole = 'citizen' | 'analyst';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  documentType: 'PASAPORTE' | 'CEDULA';
  documentNumber: string;
  nationality: string;
  birthDate: string;
  phone: string;
  address: string;
  secondaryEmail?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'observed'
  | 'correction_sent'
  | 'approved'
  | 'pending_payment'
  | 'paid'
  | 'document_issued'
  | 'delivered'
  | 'rejected'
  | 'expired';

export interface Service {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  targetAudience: string;
  requirements: string[];
  documents: string[];
  estimatedCost: number;
  responseTime: string;
  modality: string;
  steps: string[];
  warnings: string[];
}

export interface ApplicationDocument {
  id: string;
  name: string;
  fileName: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  observation?: string;
  uploadedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  status: ApplicationStatus;
  comment?: string;
  actor: string;
}

export interface Application {
  id: string;
  trackingNumber: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  officeId: string;
  officeName: string;
  amount: number;
  personalData: PersonalData;
  migratoryData: MigratoryData;
  documents: ApplicationDocument[];
  timeline: TimelineEvent[];
  analystComment?: string;
  nextStep?: string;
  paymentOrderId?: string;
  appointmentId?: string;
  issuedDocumentId?: string;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  nationality: string;
  passport: string;
  birthDate: string;
  maritalStatus: string;
  address: string;
  phone: string;
  email: string;
}

export interface MigratoryData {
  tramiteType: string;
  currentCategory: string;
  entryDate: string;
  passportExpiry: string;
  residencyExpiry?: string;
  carnetNumber?: string;
  reason: string;
  preferredOffice: string;
}

export interface Appointment {
  id: string;
  code: string;
  userId: string;
  applicationId: string;
  officeId: string;
  officeName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface PaymentOrder {
  id: string;
  orderNumber: string;
  applicationId: string;
  userId: string;
  concept: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  applicationId?: string;
}

export interface ETicket {
  id: string;
  ticketNumber: string;
  verificationCode: string;
  userId: string;
  type: 'entry' | 'exit';
  passengerName: string;
  passport: string;
  nationality: string;
  date: string;
  airline: string;
  flightNumber: string;
  port: string;
  originCountry: string;
  destinationCountry: string;
  accommodationAddress?: string;
  createdAt: string;
}

export interface IssuedDocument {
  id: string;
  documentNumber: string;
  carnetNumber?: string;
  verificationCode: string;
  type: string;
  holderName: string;
  issuedAt: string;
  expiresAt: string;
  status: 'valid' | 'expired' | 'revoked';
  applicationId: string;
}

export interface OverstayResult {
  entryDate: string;
  plannedExit: string;
  authorizedDays: number;
  elapsedDays: number;
  exceededDays: number;
  estimatedFee: number;
  breakdown: { concept: string; amount: number }[];
  isOverstay: boolean;
}

export interface AccessLog {
  id: string;
  date: string;
  ip: string;
  device: string;
  action: string;
}
