import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import ParentAuthForm from './components/ParentAuthForm';
import ParentUserCard from './components/ParentUserCard';
import ChildrenManager from './components/ChildrenManager';
import AccountSettings from './components/AccountSettings';
import FamilyProgress from './components/FamilyProgress';
import SecurityControls from './components/SecurityControls';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthPath, setPendingAuthPath] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(1800); // 30 minutes in seconds
  
  // Parent and children data
  const [parentData, setParentData] = useState({
    id: 'parent_001',
    name: 'Sarah Johnson',
    email: 'parent@buddysign.com',
    subscriptionStatus: 'Premium Family',
    subscriptionExpiry: '2024-12-25',
    accountCreated: '2024-08-15',
    sessionStart: null
  });

  const [childrenData, setChildrenData] = useState([
    {
      id: 'child_001',
      name: 'Alex Johnson',
      fakeName: 'Panda Explorer',
      avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
      age: 8,
      isActive: true,
      totalPoints: 485,
      lessonsCompleted: 32,
      currentStreak: 5,
      lastActive: '2024-09-25',
      safetySettings: {
        screenTime: 60,
        contentFilter: 'strict',
        socialFeatures: false
      }
    },
    {
      id: 'child_002',
      name: 'Emma Johnson',
      fakeName: 'Sign Star',
      avatar: 'https://randomuser.me/api/portraits/lego/8.jpg',
      age: 6,
      isActive: false,
      totalPoints: 234,
      lessonsCompleted: 18,
      currentStreak: 3,
      lastActive: '2024-09-24',
      safetySettings: {
        screenTime: 45,
        contentFilter: 'strict',
        socialFeatures: false
      }
    }
  ]);

  // Mock user data for layout consistency
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Parent Account",
      email: "parent@buddysign.com",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isParent: true,
      points: 0,
      level: 1,
      joinDate: "2024-08-15"
    };
    setUser(mockUser);
  }, []);

  // Session timer effect
  useEffect(() => {
    let interval;
    if (isAuthenticated && sessionTimer > 0) {
      interval = setInterval(() => {
        setSessionTimer(prev => {
          if (prev <= 1) {
            setIsAuthenticated(false);
            setParentData(prev => ({ ...prev, sessionStart: null }));
            return 1800;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionTimer]);

  const handleSignOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/sign-in-sign-up');
  };

  const handleAuthRequired = (targetPath) => {
    setPendingAuthPath(targetPath);
    setAuthModalOpen(true);
  };

  const handleAuthenticate = (targetPath) => {
    setUser(prev => ({ ...prev, isParent: true }));
    navigate(targetPath);
  };

  const handleParentLogin = (credentials) => {
    // In a real app, validate credentials against backend
    if (credentials?.email === 'parent@buddysign.com' && credentials?.password === 'parent123') {
      setIsAuthenticated(true);
      setSessionTimer(1800); // Reset to 30 minutes
      setParentData(prev => ({ 
        ...prev, 
        sessionStart: new Date()?.toISOString() 
      }));
      return true;
    }
    return false;
  };

  const handleChildUpdate = (childId, updates) => {
    setChildrenData(prev => 
      prev?.map(child => 
        child?.id === childId ? { ...child, ...updates } : child
      )
    );
  };

  const handleAddChild = (childData) => {
    const newChild = {
      id: `child_${Date.now()}`,
      ...childData,
      totalPoints: 0,
      lessonsCompleted: 0,
      currentStreak: 0,
      lastActive: new Date()?.toISOString()?.split('T')?.[0],
      safetySettings: {
        screenTime: childData?.age < 7 ? 30 : 60,
        contentFilter: 'strict',
        socialFeatures: false
      }
    };
    setChildrenData(prev => [...prev, newChild]);
  };

  const handleRemoveChild = (childId) => {
    setChildrenData(prev => prev?.filter(child => child?.id !== childId));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onSignOut={handleSignOut} />
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
          onAuthRequired={handleAuthRequired}
        />
        <main className={`
          pt-16 transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}>
          <div className="p-6 max-w-2xl mx-auto">
            <ParentAuthForm onLogin={handleParentLogin} />
          </div>
        </main>
        <AuthGateModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthenticate={handleAuthenticate}
          targetPath={pendingAuthPath}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={user} 
        onSignOut={handleSignOut}
      />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onAuthRequired={handleAuthRequired}
      />
      {/* Main Content */}
      <main className="pt-16 lg:ml-60">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Parent Dashboard 🛡️
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Secure administrative center for family account management
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm font-caption text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Session: {formatTime(sessionTimer)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Parent User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <ParentUserCard 
              parentData={parentData}
              sessionTimer={sessionTimer}
              onLogout={() => setIsAuthenticated(false)}
            />
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Children Manager */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-2"
            >
              <ChildrenManager
                children={childrenData}
                onChildUpdate={handleChildUpdate}
                onAddChild={handleAddChild}
                onRemoveChild={handleRemoveChild}
              />
            </motion.div>

            {/* Security Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SecurityControls
                sessionTimer={sessionTimer}
                onExtendSession={() => setSessionTimer(1800)}
                onLogout={() => setIsAuthenticated(false)}
              />
            </motion.div>
          </div>

          {/* Family Progress and Account Settings */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Family Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FamilyProgress 
                children={childrenData}
                parentData={parentData}
              />
            </motion.div>

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AccountSettings
                parentData={parentData}
                onUpdateSettings={(updates) => setParentData(prev => ({ ...prev, ...updates }))}
              />
            </motion.div>
          </div>
        </div>
      </main>
      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        targetPath={pendingAuthPath}
      />
    </div>
  );
};

export default ParentDashboard;