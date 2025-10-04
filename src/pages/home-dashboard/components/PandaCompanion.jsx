import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PandaCompanion = ({ 
  userPoints = 0, 
  unlockedActions = [], 
  onActionTrigger = () => {},
  className = '' 
}) => {
  const [currentAction, setCurrentAction] = useState('idle');
  const [showSparkles, setShowSparkles] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const pandaActions = [
    {
      id: 'hi',
      name: 'Wave Hi',
      icon: 'Hand',
      requiredPoints: 0,
      description: 'Panda waves hello to you!'
    },
    {
      id: 'dance',
      name: 'Dance',
      icon: 'Music',
      requiredPoints: 100,
      description: 'Watch panda bust some moves!'
    },
    {
      id: 'sit',
      name: 'Sit Pretty',
      icon: 'Circle',
      requiredPoints: 250,
      description: 'Panda sits like a good friend'
    },
    {
      id: 'sleep',
      name: 'Sleepy Time',
      icon: 'Moon',
      requiredPoints: 500,
      description: 'Panda takes a peaceful nap'
    },
    {
      id: 'eat',
      name: 'Snack Time',
      icon: 'Apple',
      requiredPoints: 750,
      description: 'Panda enjoys a tasty bamboo treat'
    }
  ];

  const handleActionClick = (action) => {
    if (userPoints >= action?.requiredPoints && !isAnimating) {
      setIsAnimating(true);
      setCurrentAction(action?.id);
      setShowSparkles(true);
      onActionTrigger(action);

      // Reset animation state after duration
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentAction('idle');
        setShowSparkles(false);
      }, 3000);
    }
  };

  const getActionStatus = (action) => {
    if (userPoints >= action?.requiredPoints) return 'unlocked';
    return 'locked';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Panda Display */}
      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-6 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 bg-accent rounded-full animate-pulse" />
          <div className="absolute top-12 right-8 w-4 h-4 bg-primary rounded-full animate-bounce" />
          <div className="absolute bottom-8 left-12 w-6 h-6 bg-secondary rounded-full animate-pulse" />
        </div>

        {/* Sparkle Effects */}
        <AnimatePresence>
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)]?.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i % 3) * 20}%`
                  }}
                >
                  <Icon name="Sparkles" size={16} className="text-accent" />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Panda Character */}
        <div className="text-center relative z-10">
          <motion.div
            animate={{
              scale: currentAction === 'dance' ? [1, 1.1, 1] : 1,
              rotate: currentAction === 'dance' ? [0, 5, -5, 0] : 0,
              y: currentAction === 'hi' ? [0, -10, 0] : 0
            }}
            transition={{ 
              duration: currentAction === 'dance' ? 0.5 : 1,
              repeat: currentAction === 'dance' ? 6 : 0,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            {/* Panda Emoji/Character - In a real app, this would be a Lottie animation */}
            <div className="text-8xl mb-4 select-none">
              {currentAction === 'sleep' ? '😴' : 
               currentAction === 'eat' ? '🐼' : 
               currentAction === 'dance' ? '🕺' : '🐼'}
            </div>
          </motion.div>

          <motion.h2 
            className="text-2xl font-heading font-bold text-foreground mb-2"
            animate={{ scale: isAnimating ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentAction === 'idle' ? 'Your Panda Friend' : 
             currentAction === 'hi' ? 'Hello There!' :
             currentAction === 'dance' ? 'Dancing Time!' :
             currentAction === 'sit' ? 'Sitting Pretty' :
             currentAction === 'sleep' ? 'Sweet Dreams' :
             currentAction === 'eat' ? 'Snack Time!' : 'Panda Buddy'}
          </motion.h2>

          <p className="text-sm font-body text-muted-foreground mb-6">
            {currentAction === 'idle' ? 'Click an action below to interact!' :
             pandaActions?.find(a => a?.id === currentAction)?.description || 'Having fun together!'}
          </p>

          {/* Current Status */}
          <div className="inline-flex items-center space-x-2 bg-card rounded-full px-4 py-2 shadow-soft">
            <Icon name="Heart" size={16} className="text-error animate-pulse" />
            <span className="text-sm font-body text-foreground">
              {isAnimating ? 'Playing' : 'Ready to play'}
            </span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {pandaActions?.map((action) => {
          const status = getActionStatus(action);
          const isUnlocked = status === 'unlocked';
          
          return (
            <motion.div
              key={action?.id}
              whileHover={isUnlocked ? { scale: 1.02 } : {}}
              whileTap={isUnlocked ? { scale: 0.98 } : {}}
            >
              <Button
                variant={isUnlocked ? "default" : "outline"}
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={!isUnlocked || isAnimating}
                className={`
                  w-full h-auto p-3 flex flex-col items-center space-y-2
                  ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}
                  ${currentAction === action?.id ? 'ring-2 ring-primary' : ''}
                `}
              >
                <div className="relative">
                  <Icon 
                    name={action?.icon} 
                    size={20} 
                    className={isUnlocked ? 'text-current' : 'text-muted-foreground'}
                  />
                  {!isUnlocked && (
                    <div className="absolute -top-1 -right-1">
                      <Icon name="Lock" size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-xs font-body font-medium">
                    {action?.name}
                  </div>
                  {!isUnlocked && (
                    <div className="text-xs font-caption text-muted-foreground mt-1">
                      {action?.requiredPoints} pts
                    </div>
                  )}
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
      {/* Next Unlock Preview */}
      {(() => {
        const nextLocked = pandaActions?.find(action => userPoints < action?.requiredPoints);
        if (nextLocked) {
          return (
            <div className="mt-6 bg-accent/10 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Icon name="Target" size={20} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-body font-medium text-foreground">
                    Next Unlock: {nextLocked?.name}
                  </h4>
                  <p className="text-xs font-caption text-muted-foreground">
                    {nextLocked?.requiredPoints - userPoints} more points needed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-accent">
                    {nextLocked?.requiredPoints}
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    points
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default PandaCompanion;