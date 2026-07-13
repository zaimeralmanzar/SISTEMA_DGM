import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../models';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from '../components/common/LoadingState';

interface Props { children: ReactNode; role?: UserRole; }

export function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'analyst' ? '/analista' : '/portal'} replace />;

  return <>{children}</>;
}
