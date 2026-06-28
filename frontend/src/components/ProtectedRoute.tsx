import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  redirectPath?: string;
  isPublic?: boolean;
}

export function ProtectedRoute({
  redirectPath = '/login',
  isPublic = false,
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isPublic) {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
}
