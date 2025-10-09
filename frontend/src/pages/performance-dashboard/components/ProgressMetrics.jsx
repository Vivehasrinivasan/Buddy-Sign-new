import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ProgressMetrics = ({ 
  accuracyRate = 0,
  timeImprovement = 0,
  consistencyScore = 0,
  weeklyProgress = 0,
  weeklyGoal = 100
}) => {
  const metrics = [
    {
      id: 1,
      title: "Accuracy Rate",
      value: `${accuracyRate}%`,
      icon: "Target",
      color: "primary",
      bgGradient: "from-primary/20 to-primary/10",
      description: "Average score across all lessons",
      trend: accuracyRate >= 85 ? 'excellent' : accuracyRate >= 70 ? 'good' : 'improving'
    },
    {
      id: 2,
      title: "Time Improvement",
      value: `+${timeImprovement}%`,
      icon: "Clock",
      color: "success",
      bgGradient: "from-success/20 to-success/10", 
      description: "Response time getting faster",
      trend: timeImprovement >= 20 ? 'excellent' : timeImprovement >= 10 ? 'good' : 'improving'
    },
    {
      id: 3,
      title: "Consistency",
      value: `${consistencyScore}%`,
      icon: "Activity",
      color: "accent",
      bgGradient: "from-accent/20 to-accent/10",
      description: "Regular learning pattern",
      trend: consistencyScore >= 90 ? 'excellent' : consistencyScore >= 75 ? 'good' : 'improving'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'excellent': return 'TrendingUp';
      case 'good': return 'ArrowUp';
      default: return 'ArrowRight';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      default: return 'text-accent';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Activity" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Progress Metrics
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Gamified tracking with visual indicators
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4">
          {metrics?.map((metric, index) => (
            <motion.div
              key={metric?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-lg p-4
                bg-gradient-to-r ${metric?.bgGradient}
                border border-border/50
                hover:shadow-md transition-all duration-300
              `}
            >
              <div className="flex items-center justify-between">
                {/* Left side - Icon and Info */}
                <div className="flex items-center space-x-3">
                  <div className={`
                    flex items-center justify-center
                    w-10 h-10 rounded-lg
                    bg-${metric?.color} text-white
                  `}>
                    <Icon name={metric?.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-body font-semibold text-foreground">
                      {metric?.title}
                    </h4>
                    <p className="text-xs font-caption text-muted-foreground">
                      {metric?.description}
                    </p>
                  </div>
                </div>

                {/* Right side - Value and Trend */}
                <div className="text-right">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`text-2xl font-mono font-bold text-${metric?.color} mb-1`}
                  >
                    {metric?.value}
                  </motion.div>
                  <div className={`flex items-center justify-end space-x-1 ${getTrendColor(metric?.trend)}`}>
                    <Icon 
                      name={getTrendIcon(metric?.trend)} 
                      size={12} 
                    />
                    <span className="text-xs font-caption">
                      {metric?.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar for visual representation */}
              <div className="mt-3">
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <motion.div 
                    className={`bg-${metric?.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: metric?.id === 1 ? `${accuracyRate}%` :
                             metric?.id === 2 ? `${Math.min(timeImprovement * 2, 100)}%` :
                             `${consistencyScore}%`
                    }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-secondary" />
              <span className="text-sm font-body font-medium text-foreground">
                Weekly Goal Progress
              </span>
            </div>
            <span className="text-sm font-mono text-muted-foreground">
              {weeklyProgress}/{weeklyGoal}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-secondary to-accent h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(weeklyProgress / weeklyGoal) * 100}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs font-caption text-muted-foreground">
              {(weeklyProgress / weeklyGoal) * 100 >= 100 ? 'Goal achieved! 🎉' : 
               `${Math.round((weeklyProgress / weeklyGoal) * 100)}% complete`}
            </div>
            {(weeklyProgress / weeklyGoal) * 100 >= 80 && (
              <div className="flex items-center space-x-1 text-xs font-caption text-success">
                <Icon name="Star" size={12} />
                <span>Almost there!</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievement Notification */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-4 border border-success/20"
        >
          <div className="flex items-center space-x-3">
            <Icon 
              name="Award" 
              size={18} 
              className="text-success animate-pulse" 
            />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Performance Milestone
              </h5>
              <p className="text-xs font-caption text-muted-foreground">
                {accuracyRate >= 90 ? "Outstanding performance! You're a sign language star!" :
                 accuracyRate >= 80 ? "Great accuracy! Keep up the excellent work!": "Making good progress! Every improvement counts!"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressMetrics;