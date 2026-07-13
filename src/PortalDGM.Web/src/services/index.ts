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

// Login y sesión usan mock para que las credenciales demo siempre funcionen.
// Register llama al API real para que el cliente quede registrado en el CORE.
export const authService = {
  login: authServiceMock.login.bind(authServiceMock),
  logout: authServiceMock.logout.bind(authServiceMock),
  getCurrentUser: authServiceMock.getCurrentUser.bind(authServiceMock),
  register: authServiceApi.register.bind(authServiceApi),
  updateProfile: authServiceMock.updateProfile.bind(authServiceMock),
  changePassword: authServiceMock.changePassword.bind(authServiceMock),
};

export const applicationService = applicationServiceMock;
export const serviceCatalogService = serviceCatalogServiceMock;
export const appointmentService = appointmentServiceMock;
export const paymentService = paymentServiceMock;
export const notificationService = notificationServiceMock;
export const eticketService = eticketServiceMock;
export const overstayService = overstayServiceMock;
export const documentVerificationService = documentVerificationServiceMock;
