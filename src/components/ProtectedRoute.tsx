import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireArtist?: boolean;
}

export function ProtectedRoute({ children, requireArtist = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  if (!user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireArtist && user.userType !== 'artist') {
    // Redirect to dashboard if user is not an artist
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
} 