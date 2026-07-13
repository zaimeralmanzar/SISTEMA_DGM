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

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export const authService = useMocks ? authServiceMock : authServiceApi;
export const applicationService = applicationServiceMock;
export const serviceCatalogService = serviceCatalogServiceMock;
export const appointmentService = appointmentServiceMock;
export const paymentService = paymentServiceMock;
export const notificationService = notificationServiceMock;
export const eticketService = eticketServiceMock;
export const overstayService = overstayServiceMock;
export const documentVerificationService = documentVerificationServiceMock;
