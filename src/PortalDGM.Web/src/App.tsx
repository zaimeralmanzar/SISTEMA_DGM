import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { PortalLayout } from './layouts/PortalLayout';
import { AnalystLayout } from './layouts/AnalystLayout';

import { HomePage } from './pages/public/HomePage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyDocumentPage } from './pages/public/VerifyDocumentPage';
import { OverstayCalculatorPage } from './pages/public/OverstayCalculatorPage';
import { PublicETicketPage } from './pages/public/PublicETicketPage';

import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { MyApplicationsPage } from './pages/citizen/MyApplicationsPage';
import { ApplicationDetailPage } from './pages/citizen/ApplicationDetailPage';
import { NewApplicationPage } from './pages/citizen/NewApplicationPage';
import { AppointmentsPage } from './pages/citizen/AppointmentsPage';
import { PaymentsPage } from './pages/citizen/PaymentsPage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';
import { ProfilePage } from './pages/citizen/ProfilePage';
import { CitizenETicketPage } from './pages/citizen/CitizenETicketPage';

import { AnalystDashboard } from './pages/analyst/AnalystDashboard';
import { AnalystApplicationsPage } from './pages/analyst/AnalystApplicationsPage';
import { AnalystApplicationDetailPage } from './pages/analyst/AnalystApplicationDetailPage';

import { NotFoundPage } from './pages/public/NotFoundPage';

import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/servicios/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/verificar-documento" element={<VerifyDocumentPage />} />
            <Route path="/calculadora-estadia" element={<OverstayCalculatorPage />} />
            <Route path="/eticket" element={<PublicETicketPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route path="/portal" element={<ProtectedRoute role="citizen"><PortalLayout /></ProtectedRoute>}>
            <Route index element={<CitizenDashboard />} />
            <Route path="tramites" element={<MyApplicationsPage />} />
            <Route path="tramites/nuevo/:serviceId" element={<NewApplicationPage />} />
            <Route path="tramites/:applicationId" element={<ApplicationDetailPage />} />
            <Route path="citas" element={<AppointmentsPage />} />
            <Route path="pagos" element={<PaymentsPage />} />
            <Route path="notificaciones" element={<NotificationsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="eticket" element={<CitizenETicketPage />} />
          </Route>

          <Route path="/analista" element={<ProtectedRoute role="analyst"><AnalystLayout /></ProtectedRoute>}>
            <Route index element={<AnalystDashboard />} />
            <Route path="solicitudes" element={<AnalystApplicationsPage />} />
            <Route path="solicitudes/:applicationId" element={<AnalystApplicationDetailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
