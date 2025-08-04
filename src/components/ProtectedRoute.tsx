
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
      
      // If user exists but profile is incomplete (no portal_type), redirect to profile setup
      // Exception: don't redirect if we're already on the profile setup page
      if (user && (!profile?.portal_type) && window.location.pathname !== '/profile-setup') {
        console.log('Profile incomplete, redirecting to profile setup');
        navigate('/profile-setup');
        return;
      }
      
      // If a specific portal is required and user's portal doesn't match, redirect to their portal
      if (requiredPortal && profile?.portal_type && profile.portal_type !== requiredPortal) {
        console.log('Portal mismatch, redirecting to user portal:', profile.portal_type);
        navigate(`/${profile.portal_type}`);
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

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }
  
  // For profile setup page, only require user to be logged in
  if (window.location.pathname === '/profile-setup') {
    if (!user) return null;
    return <>{children}</>;
  }
  
  // For other pages, require complete profile
  if (!profile?.portal_type) {
    return null;
  }
  
  // For portal-specific pages, ensure user is on correct portal
  if (requiredPortal && profile?.portal_type !== requiredPortal) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
