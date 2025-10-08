import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ScorecardsSection = ({ 
  perfectScores = 0, 
  streakAchievements = 0, 
  currentStreak = 0,
  bestStreak = 0
}) => {
  const scorecards = [
    {
      id: 1,
      title: "Perfect Scores",
      value: perfectScores,
      icon: "Award",
      color: "accent",
      bgColor: "bg-accent/10",
      description: "100% accuracy sessions"
    },
    {
      id: 2,
      title: "Streak Achievements",
      value: streakAchievements,
      icon: "Flame",
      color: "primary",
      bgColor: "bg-primary/10",
      description: "Consecutive learning days"
    },
    {
      id: 3,
      title: "Current Streak",
      value: `${currentStreak} days`,
      icon: "Calendar",
      color: "success",
      bgColor: "bg-success/10",
      description: "Keep it going!"
    },
    {
      id: 4,
      title: "Best Streak",
      value: `${bestStreak} days`,
      icon: "Trophy",
      color: "secondary",
      bgColor: "bg-secondary/10",
      description: "Personal record"
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
            <Icon name="Target" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Achievement Scorecards
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Your milestone badges and accomplishments
            </p>
          </div>
        </div>
      </div>
      {/* Scorecards Grid */}
      <div className="p-6 space-y-4">
        {scorecards?.map((scorecard, index) => (
          <motion.div
            key={scorecard?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`
              ${scorecard?.bgColor} rounded-lg p-4
              border border-border/50
              hover:shadow-md transition-all duration-300
            `}
          >
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={`
                flex items-center justify-center
                w-12 h-12 rounded-full
                bg-${scorecard?.color} text-white
                shadow-sm
              `}>
                <Icon 
                  name={scorecard?.icon} 
                  size={20} 
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-body font-semibold text-foreground">
                    {scorecard?.title}
                  </h4>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (index * 0.1) + 0.2 }}
                    className={`
                      text-xl font-mono font-bold
                      text-${scorecard?.color}
                    `}
                  >
                    {scorecard?.value}
                  </motion.span>
                </div>
                <p className="text-xs font-caption text-muted-foreground">
                  {scorecard?.description}
                </p>
              </div>
            </div>

            {/* Progress indicator for streaks */}
            {scorecard?.id === 3 && currentStreak > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-caption text-muted-foreground mb-1">
                  <span>Progress to next milestone</span>
                  <span>{currentStreak}/7</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStreak / 7) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Motivational Footer */}
      <div className="bg-gradient-to-r from-accent/5 to-primary/5 p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Icon 
            name="Sparkles" 
            size={16} 
            className="text-accent animate-pulse" 
          />
          <p className="text-sm font-body text-foreground">
            {perfectScores >= 10 ? "You're a perfectionist! Amazing work!" :
             currentStreak >= 5 ? "Great consistency! Keep the streak alive!": "Every achievement counts! You're doing fantastic!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScorecardsSection;