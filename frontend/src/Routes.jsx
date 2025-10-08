import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import { AuthProvider } from './context/FlaskAuthContext';
import HomeDashboard from './pages/home-dashboard';
import SignInSignUp from './pages/sign-in-sign-up';
import DictionaryBrowser from './pages/dictionary-browser';
import InteractiveLessons from './pages/interactive-lessons';
import SettingsHub from './pages/settings-hub';
import PerformanceDashboard from './pages/performance-dashboard';
import ParentDashboard from './pages/parent-dashboard';
import ChildControlSettings from './pages/child-control-settings';

const PROTECTED_ROUTES = [
  { path: '/home-dashboard', Component: HomeDashboard },
  { path: '/dictionary-browser', Component: DictionaryBrowser },
  { path: '/interactive-lessons', Component: InteractiveLessons },
  { path: '/performance-dashboard', Component: PerformanceDashboard },
  { path: '/settings-hub', Component: SettingsHub, requireParent: true },
  { path: '/parent-dashboard', Component: ParentDashboard, requireParent: true },
  { path: '/child-control-settings', Component: ChildControlSettings, requireParent: true },
];

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public routes */}
            <Route path="/sign-in-sign-up" element={<SignInSignUp initialTab="signin" />} />
            <Route path="/login" element={<SignInSignUp initialTab="signin" />} />
            <Route path="/signup" element={<SignInSignUp initialTab="signup" />} />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/home-dashboard" replace />} />

            {/* Protected routes */}
            {PROTECTED_ROUTES.map(({ path, Component, requireParent }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute requireParent={requireParent}>
                    <Component />
                  </ProtectedRoute>
                }
              />
            ))}
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
