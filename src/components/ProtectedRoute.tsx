import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireArtist?: boolean;
}

export function ProtectedRoute({ children, requireArtist }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireArtist && user.userType !== 'artist') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 