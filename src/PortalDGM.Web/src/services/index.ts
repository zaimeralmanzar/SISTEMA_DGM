import { authServiceMock } from './mocks/authService.mock';
import { authServiceApi } from './api/authService.api';
import { applicationServiceMock } from './mocks/applicationService.mock';
import { serviceCatalogServiceMock } from './mocks/serviceCatalogService.mock';
import { appointmentServiceMock } from './mocks/appointmentService.mock';
import { paymentServiceMock } from './mocks/paymentService.mock';
import { notificationServiceMock } from './mocks/notificationService.mock';
import { eticketServiceMock } from './mocks/eticketService.mock';
import { overstayServiceMock } from './mocks/overstayService.mock';
import { documentVerificationServiceMock } from './mocks/documentVerificationService.mock';

import { apiAuthService } from './apiAuthService';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export const authService = useMocks ? authServiceMock : apiAuthService;
export const applicationService = useMocks ? applicationServiceMock : applicationServiceMock;
export const serviceCatalogService = useMocks ? serviceCatalogServiceMock : serviceCatalogServiceMock;
export const appointmentService = useMocks ? appointmentServiceMock : appointmentServiceMock;
export const paymentService = useMocks ? paymentServiceMock : paymentServiceMock;
export const notificationService = useMocks ? notificationServiceMock : notificationServiceMock;
export const eticketService = useMocks ? eticketServiceMock : eticketServiceMock;
export const overstayService = useMocks ? overstayServiceMock : overstayServiceMock;
export const documentVerificationService = useMocks ? documentVerificationServiceMock : documentVerificationServiceMock;
