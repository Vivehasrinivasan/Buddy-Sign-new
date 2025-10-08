import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DailyStreakPanel = ({ 
  currentStreak = 7,
  longestStreak = 15,
  weeklyActivity = [],
  motivationalMessage = "",
  className = '' 
}) => {
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  const mockWeeklyActivity = weeklyActivity?.length > 0 ? weeklyActivity : [
    { day: 'Mon', completed: true, lessons: 3 },
    { day: 'Tue', completed: true, lessons: 2 },
    { day: 'Wed', completed: true, lessons: 4 },
    { day: 'Thu', completed: true, lessons: 1 },
    { day: 'Fri', completed: true, lessons: 3 },
    { day: 'Sat', completed: true, lessons: 2 },
    { day: 'Sun', completed: true, lessons: 5 }
  ];

  const defaultMotivationalMessages = [
    "You\'re on fire! Keep up the amazing streak! 🔥",
    "Consistency is key to mastering sign language! 💪",
    "Your panda friend is so proud of your dedication! 🐼",
    "Every day you learn brings you closer to fluency! ⭐",
    "Amazing commitment! You\'re becoming a sign language star! 🌟"
  ];

  const displayMessage = motivationalMessage || 
    defaultMotivationalMessages?.[Math.floor(Math.random() * defaultMotivationalMessages?.length)];

  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 3000);
    }
  }, [currentStreak]);

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-accent';
    if (streak >= 7) return 'text-primary';
    return 'text-success';
  };

  const getStreakIcon = (streak) => {
    if (streak >= 30) return 'Crown';
    if (streak >= 14) return 'Flame';
    if (streak >= 7) return 'Zap';
    return 'Star';
  };

  return (
    <div className={`bg-card rounded-xl shadow-soft border border-border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-success/10 to-primary/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: showStreakAnimation ? [1, 1.2, 1] : 1,
                rotate: showStreakAnimation ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5, repeat: showStreakAnimation ? 3 : 0 }}
              className={`flex items-center justify-center w-10 h-10 bg-success rounded-lg`}
            >
              <Icon 
                name={getStreakIcon(currentStreak)} 
                size={20} 
                color="white" 
              />
            </motion.div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Daily Streak
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Keep learning every day!
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-mono font-bold ${getStreakColor(currentStreak)}`}>
              {currentStreak}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              days
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center bg-muted/30 rounded-lg p-3">
            <div className="text-xl font-mono font-bold text-primary">
              {currentStreak}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Current Streak
            </div>
          </div>
          <div className="text-center bg-muted/30 rounded-lg p-3">
            <div className="text-xl font-mono font-bold text-accent">
              {longestStreak}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Longest Streak
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="space-y-3">
          <h4 className="text-sm font-body font-medium text-foreground flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span>This Week</span>
          </h4>
          
          <div className="grid grid-cols-7 gap-2">
            {mockWeeklyActivity?.map((day, index) => (
              <motion.div
                key={day?.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-xs font-caption text-muted-foreground mb-1">
                  {day?.day}
                </div>
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold
                    ${day?.completed 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {day?.completed ? (
                    <Icon name="Check" size={12} />
                  ) : (
                    <Icon name="X" size={12} />
                  )}
                </div>
                {day?.completed && (
                  <div className="text-xs font-caption text-muted-foreground mt-1">
                    {day?.lessons}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-3">
          <h4 className="text-sm font-body font-medium text-foreground flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span>Streak Milestones</span>
          </h4>
          
          <div className="space-y-2">
            {[
              { days: 7, reward: 'Panda Dance Unlock', achieved: currentStreak >= 7 },
              { days: 14, reward: 'Special Badge', achieved: currentStreak >= 14 },
              { days: 30, reward: 'Panda Crown', achieved: currentStreak >= 30 }
            ]?.map((milestone) => (
              <div
                key={milestone?.days}
                className={`
                  flex items-center justify-between p-3 rounded-lg border
                  ${milestone?.achieved 
                    ? 'bg-success/10 border-success/20' :'bg-muted/30 border-border'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${milestone?.achieved 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {milestone?.achieved ? (
                      <Icon name="Check" size={12} />
                    ) : (
                      <Icon name="Lock" size={12} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-body font-medium text-foreground">
                      {milestone?.days} Day Streak
                    </div>
                    <div className="text-xs font-caption text-muted-foreground">
                      {milestone?.reward}
                    </div>
                  </div>
                </div>
                {!milestone?.achieved && (
                  <div className="text-xs font-mono text-muted-foreground">
                    {milestone?.days - currentStreak} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Icon name="MessageCircle" size={16} className="text-accent" />
            </div>
            <div>
              <div className="text-sm font-body font-medium text-foreground mb-1">
                Daily Motivation
              </div>
              <div className="text-sm font-body text-muted-foreground">
                {displayMessage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStreakPanel;