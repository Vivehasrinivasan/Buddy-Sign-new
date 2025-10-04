import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import TimeManagementSection from './components/TimeManagementSection';
import LessonControlPanel from './components/LessonControlPanel';
import PandaActionControls from './components/PandaActionControls';
import ProgressMonitoring from './components/ProgressMonitoring';
import SafetyFeatures from './components/SafetyFeatures';
import RemoveChildOption from './components/RemoveChildOption';

const ChildControlSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthPath, setPendingAuthPath] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Child data state
  const [childData, setChildData] = useState({
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
    settings: {
      timeManagement: {
        dailyLimit: 60,
        weeklyLimit: 420,
        timeRemaining: 45,
        autoEndSession: true,
        breakReminders: true,
        parentalOverride: false
      },
      lessonControl: {
        enabledModules: ['basic-signs', 'family-words', 'numbers', 'colors'],
        disabledModules: ['advanced-grammar', 'complex-phrases'],
        difficultyLevel: 'intermediate',
        ageAppropriate: true,
        customRestrictions: []
      },
      pandaActions: {
        unlockedBehaviors: ['celebrate', 'encourage', 'high-five'],
        lockedBehaviors: ['dance-party', 'magic-tricks'],
        achievementThresholds: {
          'dance-party': 500,
          'magic-tricks': 750
        }
      },
      safety: {
        contentFilter: 'strict',
        communicationRestrictions: true,
        dataSharing: 'minimal',
        parentalNotifications: true,
        screenshotPrevention: true
      }
    }
  });

  const [availableChildren] = useState([
    {
      id: 'child_001',
      name: 'Alex Johnson',
      fakeName: 'Panda Explorer',
      avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
      age: 8
    },
    {
      id: 'child_002',
      name: 'Emma Johnson',
      fakeName: 'Sign Star',
      avatar: 'https://randomuser.me/api/portraits/lego/8.jpg',
      age: 6
    }
  ]);

  // Mock user data
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
    setSelectedChild(availableChildren?.[0]);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = () => {
    setUser(null);
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

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    // In a real app, load child-specific settings
    if (child?.id === 'child_002') {
      setChildData(prev => ({
        ...prev,
        ...child,
        settings: {
          ...prev?.settings,
          timeManagement: {
            ...prev?.settings?.timeManagement,
            dailyLimit: 45,
            weeklyLimit: 315
          },
          lessonControl: {
            ...prev?.settings?.lessonControl,
            difficultyLevel: 'beginner',
            enabledModules: ['basic-signs', 'family-words']
          }
        }
      }));
    }
  };

  const handleSettingsUpdate = (section, updates) => {
    setChildData(prev => ({
      ...prev,
      settings: {
        ...prev?.settings,
        [section]: {
          ...prev?.settings?.[section],
          ...updates
        }
      }
    }));
  };

  const handleSectionToggle = (section) => {
    if (isMobile) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  const sections = [
    {
      id: 'time-management',
      title: 'Time Management',
      icon: '⏰',
      component: TimeManagementSection
    },
    {
      id: 'lesson-control',
      title: 'Lesson Control',
      icon: '📚',
      component: LessonControlPanel
    },
    {
      id: 'panda-actions',
      title: 'Panda Actions',
      icon: '🐼',
      component: PandaActionControls
    },
    {
      id: 'progress-monitoring',
      title: 'Progress Monitoring',
      icon: '📊',
      component: ProgressMonitoring
    },
    {
      id: 'safety-features',
      title: 'Safety Features',
      icon: '🛡️',
      component: SafetyFeatures
    },
    {
      id: 'remove-child',
      title: 'Remove Child',
      icon: '⚠️',
      component: RemoveChildOption
    }
  ];

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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Child Control Settings ⚙️
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Granular parental oversight tools for managing individual child learning experiences
                </p>
              </div>
              
              {/* Child Selector */}
              <div className="mt-4 lg:mt-0">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Child
                </label>
                <select
                  value={selectedChild?.id || ''}
                  onChange={(e) => {
                    const child = availableChildren?.find(c => c?.id === e?.target?.value);
                    handleChildSelect(child);
                  }}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {availableChildren?.map(child => (
                    <option key={child?.id} value={child?.id}>
                      {child?.name} ({child?.fakeName}) - Age {child?.age}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Child Info */}
            {selectedChild && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border rounded-xl p-4 mb-6"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedChild?.avatar}
                    alt={selectedChild?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {selectedChild?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      App Name: {selectedChild?.fakeName} • Age: {selectedChild?.age}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>Points: {childData?.totalPoints}</span>
                      <span>Lessons: {childData?.lessonsCompleted}</span>
                      <span>Streak: {childData?.currentStreak} days</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {sections?.map((section, index) => {
              const Component = section?.component;
              const isExpanded = !isMobile || expandedSection === section?.id;
              
              return (
                <motion.div
                  key={section?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  {/* Section Header (Mobile Accordion Style) */}
                  {isMobile && (
                    <button
                      onClick={() => handleSectionToggle(section?.id)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{section?.icon}</span>
                        <h2 className="text-lg font-semibold text-foreground">
                          {section?.title}
                        </h2>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.div>
                    </button>
                  )}
                  {/* Section Content */}
                  <motion.div
                    initial={isMobile ? { height: 0 } : { opacity: 1 }}
                    animate={
                      isExpanded
                        ? isMobile
                          ? { height: 'auto' }
                          : { opacity: 1 }
                        : isMobile
                        ? { height: 0 }
                        : { opacity: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className={isMobile && !isExpanded ? 'overflow-hidden' : ''}
                  >
                    <div className="p-6">
                      {!isMobile && (
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="text-3xl">{section?.icon}</span>
                          <h2 className="text-2xl font-heading font-bold text-foreground">
                            {section?.title}
                          </h2>
                        </div>
                      )}
                      
                      <Component
                        childData={childData}
                        onUpdate={(updates) => handleSettingsUpdate(section?.id?.replace('-', ''), updates)}
                        isMobile={isMobile}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-end"
          >
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Save All Settings
            </button>
          </motion.div>
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

export default ChildControlSettings;