import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import PointsProgressIndicator from '../../../components/ui/PointsProgressIndicator';

const PointsProgressCard = ({ 
  currentPoints = 0,
  totalEarned = 0,
  weeklyGoal = 200,
  recentAchievements = [],
  onViewDetails = () => {},
  className = '' 
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousPoints, setPreviousPoints] = useState(currentPoints);

  // Trigger celebration when points increase
  useEffect(() => {
    if (currentPoints > previousPoints) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    setPreviousPoints(currentPoints);
  }, [currentPoints, previousPoints]);

  const weeklyProgress = Math.min((currentPoints / weeklyGoal) * 100, 100);
  const level = Math.floor(currentPoints / 100) + 1;
  const streak = 7; // Mock streak data

  return (
    <div className={`bg-card rounded-xl shadow-soft border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Trophy" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Your Progress
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Keep learning to unlock more panda actions!
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showCelebration ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon 
              name="Star" 
              size={24} 
              className={`${showCelebration ? 'text-accent' : 'text-muted-foreground'}`} 
            />
          </motion.div>
        </div>
      </div>
      {/* Main Progress Section */}
      <div className="p-6 space-y-6">
        {/* Points Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-primary">
              {currentPoints}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Current Points
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-accent">
              {level}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Level
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-success">
              {streak}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Day Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-secondary">
              {totalEarned}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Total Earned
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <PointsProgressIndicator
          currentPoints={currentPoints}
          maxPoints={1000}
          showSparkles={showCelebration}
          size="default"
        />

        {/* Weekly Goal Progress */}
        <div className="bg-white rounded-2xl p-4 border-2 border-[#FFE2E2] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={20} className="text-[#8785A2]" />
              <span className="text-sm font-bold text-[#8785A2]">
                🎯 Weekly Goal
              </span>
            </div>
            <span className="text-sm font-bold text-[#8785A2] bg-[#FFC7C7] px-2 py-1 rounded-full">
              {currentPoints}/{weeklyGoal} ⭐
            </span>
          </div>
          
          <div className="w-full bg-[#F6F6F6] rounded-full h-4 mb-2 border-2 border-[#FFE2E2]">
            <motion.div 
              className="bg-gradient-to-r from-[#8785A2] via-[#FFC7C7] to-[#FFE2E2] h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          
          <div className="text-sm font-bold text-[#8785A2] text-center">
            {weeklyProgress >= 100 ? '🎉 Goal achieved! You\'re amazing! �' : 
             `${Math.round(weeklyProgress)}% complete - Keep going! 💪`}
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements?.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-body font-medium text-foreground flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-success" />
              <span>Recent Achievements</span>
            </h4>
            
            <div className="space-y-2">
              {recentAchievements?.slice(0, 3)?.map((achievement, index) => (
                <motion.div
                  key={achievement?.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 bg-success/10 rounded-lg p-3"
                >
                  <div className="flex-shrink-0">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-body font-medium text-foreground">
                      {achievement?.title}
                    </div>
                    <div className="text-xs font-caption text-muted-foreground">
                      +{achievement?.points} points • {achievement?.date}
                    </div>
                  </div>
                  <div className="text-success font-mono text-sm font-bold">
                    +{achievement?.points}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icon name="Zap" size={20} className="text-accent animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-body font-medium text-foreground">
                {currentPoints < 50 ? "You're just getting started! Keep going!" :
                 currentPoints < 200 ? "Great progress! Your panda is proud!" :
                 currentPoints < 500 ? "Amazing work! You're becoming a sign language star!" : "Incredible! You're a sign language champion!"}
              </div>
              <div className="text-xs font-caption text-muted-foreground mt-1">
                Complete more lessons to earn points and unlock panda actions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsProgressCard;