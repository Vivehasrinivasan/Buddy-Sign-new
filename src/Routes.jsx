import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import SignInSignUp from './pages/sign-in-sign-up';
import DictionaryBrowser from './pages/dictionary-browser';
import InteractiveLessons from './pages/interactive-lessons';
import SettingsHub from './pages/settings-hub';
import PerformanceDashboard from './pages/performance-dashboard';
import ParentDashboard from './pages/parent-dashboard';
import ChildControlSettings from './pages/child-control-settings';

const Routes = () => {
  return (
    <>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public/Guest Routes */}
        <Route path="/sign-in-sign-up" element={
          <GuestRoute>
            <SignInSignUp />
          </GuestRoute>
        } />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/home-dashboard" element={
          <ProtectedRoute>
            <HomeDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/dictionary-browser" element={
          <ProtectedRoute>
            <DictionaryBrowser />
          </ProtectedRoute>
        } />
        
        <Route path="/interactive-lessons" element={
          <ProtectedRoute>
            <InteractiveLessons />
          </ProtectedRoute>
        } />
        
        <Route path="/performance-dashboard" element={
          <ProtectedRoute>
            <PerformanceDashboard />
          </ProtectedRoute>
        } />
        
        {/* Parent-only Routes - Require Email Verification */}
        <Route path="/settings-hub" element={
          <ProtectedRoute requireEmailVerification={true}>
            <SettingsHub />
          </ProtectedRoute>
        } />
        
        <Route path="/parent-dashboard" element={
          <ProtectedRoute requireEmailVerification={true}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/child-control-settings" element={
          <ProtectedRoute requireEmailVerification={true}>
            <ChildControlSettings />
          </ProtectedRoute>
        } />
        
        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/home-dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </>
  );
};

export default Routes;
