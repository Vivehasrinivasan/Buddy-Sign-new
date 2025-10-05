// Protected Route Component for BuddySign
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Protected Route wrapper component
const ProtectedRoute = ({ children, requireEmailVerification = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!currentUser) {
    return <Navigate to="/sign-in-sign-up" state={{ from: location }} replace />;
  }

  // Check email verification if required
  if (requireEmailVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Render protected component
  return children;
};

// Guest Route wrapper (redirect authenticated users)
export const GuestRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (currentUser) {
    return <Navigate to="/home-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

/*
USAGE IN ROUTES:

import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      // Guest only routes
      <Route path="/sign-in-sign-up" element={
        <GuestRoute>
          <SignInSignUp />
        </GuestRoute>
      } />
      
      // Protected routes
      <Route path="/home-dashboard" element={
        <ProtectedRoute>
          <HomeDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/settings-hub" element={
        <ProtectedRoute requireEmailVerification={true}>
          <SettingsHub />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
*/