import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
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
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DictionaryBrowser />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/sign-in-sign-up" element={<SignInSignUp />} />
        <Route path="/dictionary-browser" element={<DictionaryBrowser />} />
        <Route path="/interactive-lessons" element={<InteractiveLessons />} />
        <Route path="/settings-hub" element={<SettingsHub />} />
        <Route path="/performance-dashboard" element={<PerformanceDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/child-control-settings" element={<ChildControlSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
