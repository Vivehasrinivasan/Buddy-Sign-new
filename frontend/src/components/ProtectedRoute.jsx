import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/FlaskAuthContext';

const ProtectedRoute = ({ children, requireParent = false }) => {
  const location = useLocation();
  const { isAuthenticated, currentUser, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Check parent access if required
  if (requireParent && currentUser && !currentUser.isParent) {
    return <Navigate to="/home-dashboard" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;