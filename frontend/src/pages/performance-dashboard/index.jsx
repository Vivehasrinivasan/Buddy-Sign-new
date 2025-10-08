import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import AchievementCards from './components/AchievementCards';
import ScorecardsSection from './components/ScorecardsSection';
import PerformanceChart from './components/PerformanceChart';
import StrengthsWeaknesses from './components/StrengthsWeaknesses';
import ProgressMetrics from './components/ProgressMetrics';
import AchievementGallery from './components/AchievementGallery';

const PerformanceDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthPath, setPendingAuthPath] = useState('');
  
  // Performance data state
  const [performanceData, setPerformanceData] = useState({
    totalLessonsCompleted: 32,
    testsAttended: 18,
    overallProgress: 75,
    accuracyRate: 87,
    perfectScores: 12,
    streakAchievements: 7,
    currentStreak: 5,
    bestStreak: 12,
    timeImprovement: 23,
    consistencyScore: 92,
    weeklyGoal: 100,
    weeklyProgress: 68
  });

  const [chartData, setChartData] = useState([
    { name: 'Week 1', accuracy: 65, speed: 70, consistency: 60 },
    { name: 'Week 2', accuracy: 72, speed: 75, consistency: 68 },
    { name: 'Week 3', accuracy: 78, speed: 82, consistency: 75 },
    { name: 'Week 4', accuracy: 85, speed: 88, consistency: 82 },
    { name: 'Week 5', accuracy: 87, speed: 90, consistency: 88 },
    { name: 'Week 6', accuracy: 89, speed: 95, consistency: 92 }
  ]);

  // Mock user data - in a real app, this would come from authentication
  useEffect(() => {
    const mockUser = {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
      isParent: false,
      points: 485,
      level: 5,
      joinDate: "2024-09-01"
    };
    setUser(mockUser);
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

  const achievements = [
    {
      id: 1,
      title: "Perfect Week",
      description: "Complete all lessons with 100% accuracy",
      earned: true,
      earnedDate: "2024-09-18",
      icon: "Star",
      color: "accent"
    },
    {
      id: 2,
      title: "Speed Learner",
      description: "Improve response time by 50%",
      earned: true,
      earnedDate: "2024-09-15",
      icon: "Zap",
      color: "primary"
    },
    {
      id: 3,
      title: "Consistency King",
      description: "Maintain 7-day learning streak",
      earned: false,
      progress: 5,
      total: 7,
      icon: "Calendar",
      color: "success"
    }
  ];

  const strengthsWeaknesses = {
    strengths: [
      { skill: "Family Signs", accuracy: 95, improvement: "+8%" },
      { skill: "Numbers", accuracy: 92, improvement: "+12%" },
      { skill: "Colors", accuracy: 89, improvement: "+5%" }
    ],
    weaknesses: [
      { skill: "Complex Phrases", accuracy: 68, recommendation: "Practice more compound signs" },
      { skill: "Speed Recognition", accuracy: 72, recommendation: "Use timed practice mode" },
      { skill: "Finger Spelling", accuracy: 75, recommendation: "Daily alphabet drills" }
    ]
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Performance Dashboard 📊
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Track your learning journey and celebrate your achievements!
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm font-caption text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Updated Now</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <AchievementCards 
              totalLessons={performanceData?.totalLessonsCompleted}
              testsAttended={performanceData?.testsAttended}
              overallProgress={performanceData?.overallProgress}
            />
          </motion.div>

          {/* Scorecards and Chart Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Scorecards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:col-span-1"
            >
              <ScorecardsSection
                perfectScores={performanceData?.perfectScores}
                streakAchievements={performanceData?.streakAchievements}
                currentStreak={performanceData?.currentStreak}
                bestStreak={performanceData?.bestStreak}
              />
            </motion.div>

            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-2"
            >
              <PerformanceChart 
                data={chartData}
                className="h-80"
              />
            </motion.div>
          </div>

          {/* Progress Metrics and Strengths/Weaknesses */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Progress Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ProgressMetrics
                accuracyRate={performanceData?.accuracyRate}
                timeImprovement={performanceData?.timeImprovement}
                consistencyScore={performanceData?.consistencyScore}
                weeklyProgress={performanceData?.weeklyProgress}
                weeklyGoal={performanceData?.weeklyGoal}
              />
            </motion.div>

            {/* Strengths and Weaknesses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <StrengthsWeaknesses 
                strengths={strengthsWeaknesses?.strengths}
                weaknesses={strengthsWeaknesses?.weaknesses}
              />
            </motion.div>
          </div>

          {/* Achievement Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AchievementGallery 
              achievements={achievements}
            />
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

export default PerformanceDashboard;