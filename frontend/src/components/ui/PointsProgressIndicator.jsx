import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const PointsProgressIndicator = ({ 
  currentPoints = 0,
  maxPoints = 1000,
  showSparkles = false,
  size = 'default',
  className = '' 
}) => {
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercentage = Math.min((currentPoints / maxPoints) * 100, 100);
  const level = Math.floor(currentPoints / 100) + 1;
  const pointsToNextLevel = Math.max(0, (level * 100) - currentPoints);

  // Animate points counter
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60; // 60fps
    const increment = (currentPoints - animatedPoints) / steps;
    
    if (Math.abs(currentPoints - animatedPoints) > 0.1) {
      const timer = setInterval(() => {
        setAnimatedPoints(prev => {
          const next = prev + increment;
          if (Math.abs(next - currentPoints) < Math.abs(increment)) {
            clearInterval(timer);
            return currentPoints;
          }
          return next;
        });
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [currentPoints, animatedPoints]);

  // Trigger celebration animation
  useEffect(() => {
    if (showSparkles) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSparkles]);

  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 14,
    default: 16,
    lg: 20
  };

  const progressHeights = {
    sm: 'h-1.5',
    default: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Celebration Sparkles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)]?.map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-gentle"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '600ms'
              }}
            >
              <Icon 
                name="Sparkles" 
                size={iconSizes?.[size]} 
                className="text-accent opacity-80" 
              />
            </div>
          ))}
        </div>
      )}
      {/* Main Content */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name="Star" 
              size={iconSizes?.[size]} 
              className="text-accent" 
            />
            <span className={`font-caption ${sizeClasses?.[size]} text-muted-foreground`}>
              Level {level}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon 
              name="Trophy" 
              size={iconSizes?.[size]} 
              className="text-primary opacity-60" 
            />
            <span className={`font-mono ${sizeClasses?.[size]} text-foreground font-medium`}>
              {Math.round(animatedPoints)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className={`bg-muted rounded-full ${progressHeights?.[size]} overflow-hidden`}>
            <div 
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Shimmer effect for active progress */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Progress Text */}
          <div className="flex items-center justify-between">
            <span className={`font-caption ${sizeClasses?.[size]} text-muted-foreground`}>
              {pointsToNextLevel > 0 ? `${pointsToNextLevel} to next level` : 'Level Complete!'}
            </span>
            <span className={`font-caption ${sizeClasses?.[size]} text-muted-foreground`}>
              {currentPoints}/{maxPoints}
            </span>
          </div>
        </div>

        {/* Achievement Badges */}
        {level > 1 && (
          <div className="flex items-center space-x-1 pt-2 border-t border-border/50">
            <Icon 
              name="Award" 
              size={iconSizes?.[size]} 
              className="text-success" 
            />
            <span className={`font-caption ${sizeClasses?.[size]} text-success`}>
              {level - 1} level{level > 2 ? 's' : ''} completed
            </span>
          </div>
        )}

        {/* Motivational Message */}
        {pointsToNextLevel <= 50 && pointsToNextLevel > 0 && (
          <div className="flex items-center space-x-2 bg-accent/10 rounded-md p-2">
            <Icon 
              name="Zap" 
              size={iconSizes?.[size]} 
              className="text-accent animate-pulse" 
            />
            <span className={`font-body ${sizeClasses?.[size]} text-accent-foreground font-medium`}>
              Almost there! Keep going!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsProgressIndicator;