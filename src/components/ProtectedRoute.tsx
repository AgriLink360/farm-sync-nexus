
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPortal?: 'farmer' | 'buyer' | 'logistics';
}

const ProtectedRoute = ({ children, requiredPortal }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ProtectedRoute check:', { user, profile, loading, requiredPortal });
    
    if (!loading) {
      if (!user) {
        console.log('No user found, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (requiredPortal && profile?.portal_type !== requiredPortal) {
        console.log('Portal mismatch:', profile?.portal_type, 'required:', requiredPortal);
        navigate('/auth');
        return;
      }
    }
  }, [user, profile, loading, navigate, requiredPortal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredPortal && profile?.portal_type !== requiredPortal)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
