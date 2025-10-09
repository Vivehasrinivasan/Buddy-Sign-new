import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import Icon from '../../components/AppIcon';
import AuthenticationForm from './components/AuthenticationForm';
import SessionIndicator from './components/SessionIndicator';
import QuickActions from './components/QuickActions';

const SettingsHub = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPath, setPendingPath] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const [user] = useState({
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    isParent: true,
    points: 750,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  });

  useEffect(() => {
    // Check if user was already authenticated in this session
    const authStatus = sessionStorage.getItem('parentAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = (success) => {
    setIsAuthLoading(true);
    
    setTimeout(() => {
      if (success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('parentAuthenticated', 'true');
      }
      setIsAuthLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('parentAuthenticated');
    navigate('/home-dashboard');
  };

  const handleAuthRequired = (targetPath) => {
    setPendingPath(targetPath);
    setShowAuthModal(true);
  };

  const handleModalAuthenticate = (targetPath) => {
    setIsAuthenticated(true);
    sessionStorage.setItem('parentAuthenticated', 'true');
    setShowAuthModal(false);
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: 'Home' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={user} 
        onSignOut={() => navigate('/sign-in-sign-up')}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
      }`}>
        <div className="p-6 max-w-6xl mx-auto">
          {!isAuthenticated ? (
            /* Authentication Required View */
            (<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="w-full max-w-4xl">
                {/* Page Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4">
                    <Icon name="Settings" size={40} className="text-primary" />
                  </div>
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                    Settings Hub
                  </h1>
                  <p className="text-lg font-body text-muted-foreground max-w-2xl mx-auto">
                    Manage your BuddySign account, child profiles, and learning preferences with comprehensive parental controls
                  </p>
                </div>

                {/* Authentication Form */}
                <AuthenticationForm
                  onAuthenticate={handleAuthentication}
                  isLoading={isAuthLoading}
                  className="mb-8"
                />

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {[
                    {
                      icon: 'Users',
                      title: 'Child Management',
                      description: 'Add, edit, and monitor multiple child profiles with individual progress tracking'
                    },
                    {
                      icon: 'Shield',
                      title: 'Safety Controls',
                      description: 'Set time limits, content restrictions, and secure access controls for peace of mind'
                    },
                    {
                      icon: 'BarChart3',
                      title: 'Progress Analytics',
                      description: 'Detailed reports and insights into learning progress and skill development'
                    }
                  ]?.map((feature, index) => (
                    <div key={index} className="bg-card rounded-lg border border-border p-6 text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                        <Icon name={feature?.icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-sm font-heading font-semibold text-card-foreground mb-2">
                        {feature?.title}
                      </h3>
                      <p className="text-xs font-body text-muted-foreground">
                        {feature?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>)
          ) : (
            /* Authenticated Settings View */
            (<div className="space-y-6">
              {/* Page Header with Session Indicator */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Settings Hub
                  </h1>
                  <p className="text-sm font-body text-muted-foreground">
                    Welcome back, {user?.name}. Manage your account and child settings securely.
                  </p>
                </div>
                <SessionIndicator 
                  onLogout={handleLogout}
                  className="lg:w-80"
                />
              </div>
              {/* Content */}
              <div className="min-h-[400px]">
                <QuickActions user={user} />
              </div>
              {/* Footer Info */}
              <div className="bg-muted/30 rounded-lg p-4 mt-8">
                <div className="flex items-center space-x-3">
                  <Icon name="Info" size={16} className="text-primary" />
                  <div className="text-xs font-caption text-muted-foreground">
                    <p className="mb-1">
                      <strong>Last Updated:</strong> December 25, {new Date()?.getFullYear()} at 6:52 PM
                    </p>
                    <p>
                      All settings are automatically saved and synchronized across your devices. 
                      Changes to child controls take effect immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>)
          )}
        </div>
      </main>
      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleModalAuthenticate}
        targetPath={pendingPath}
      />
    </div>
  );
};

export default SettingsHub;