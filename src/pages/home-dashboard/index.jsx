import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import PandaCompanion from './components/PandaCompanion';
import PointsProgressCard from './components/PointsProgressCard';
import DailyStreakPanel from './components/DailyStreakPanel';
import QuickAccessButtons from './components/QuickAccessButtons';

const HomeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthPath, setPendingAuthPath] = useState('');
  const [userStats, setUserStats] = useState({
    points: 275,
    totalEarned: 450,
    completedLessons: 8,
    currentStreak: 7,
    longestStreak: 15
  });

  // Mock user data - in a real app, this would come from authentication
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
      isParent: false,
      points: userStats?.points,
      level: Math.floor(userStats?.points / 100) + 1,
      joinDate: "2024-09-01"
    };
    setUser(mockUser);
  }, [userStats?.points]);

  // Mock recent achievements
  const recentAchievements = [
    {
      id: 1,
      title: "First Week Complete!",
      points: 50,
      date: "Today"
    },
    {
      id: 2,
      title: "Family Signs Mastered",
      points: 30,
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Perfect Practice Score",
      points: 25,
      date: "2 days ago"
    }
  ];

  // Mock unlocked panda actions based on points
  const getUnlockedActions = (points) => {
    const actions = [];
    if (points >= 0) actions?.push('hi');
    if (points >= 100) actions?.push('dance');
    if (points >= 250) actions?.push('sit');
    if (points >= 500) actions?.push('sleep');
    if (points >= 750) actions?.push('eat');
    return actions;
  };

  const handleSignOut = () => {
    setUser(null);
    navigate('/sign-in-sign-up');
  };

  const handleAuthRequired = (targetPath) => {
    setPendingAuthPath(targetPath);
    setAuthModalOpen(true);
  };

  const handleAuthenticate = (targetPath) => {
    // In a real app, this would validate parent credentials
    setUser(prev => ({ ...prev, isParent: true }));
    navigate(targetPath);
  };

  const handlePandaAction = (action) => {
    // Add points for interaction
    setUserStats(prev => ({
      ...prev,
      points: prev?.points + 5
    }));
  };



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
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Welcome back, {user?.name?.split(' ')?.[0] || 'Friend'}! 👋
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Ready to learn some sign language with your panda buddy?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm font-caption text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
                <div>
                  {new Date()?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Panda & Quick Actions */}
            <div className="xl:col-span-2 space-y-6">
              {/* Panda Companion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <PandaCompanion
                  userPoints={userStats?.points}
                  unlockedActions={getUnlockedActions(userStats?.points)}
                  onActionTrigger={handlePandaAction}
                />
              </motion.div>

              {/* Daily Streak Panel - Under Panda */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <DailyStreakPanel
                  currentStreak={userStats?.currentStreak}
                  longestStreak={userStats?.longestStreak}
                />
              </motion.div>

              {/* Quick Access Buttons - Under Daily Streak */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <QuickAccessButtons
                  user={user}
                  onAuthRequired={handleAuthRequired}
                />
              </motion.div>
            </div>

            {/* Right Column - Progress (Next Unlock: Sleepy Time) */}
            <div className="space-y-6">
              {/* Points Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PointsProgressCard
                  currentPoints={userStats?.points}
                  totalEarned={userStats?.totalEarned}
                  weeklyGoal={200}
                  recentAchievements={recentAchievements}
                />
              </motion.div>
            </div>
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

export default HomeDashboard;