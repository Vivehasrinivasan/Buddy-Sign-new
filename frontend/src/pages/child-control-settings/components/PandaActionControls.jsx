import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Unlock, Play, Gift, Target } from 'lucide-react';

const PandaActionControls = ({ childData, onUpdate, isMobile }) => {
  const { pandaActions } = childData?.settings || {};
  const [previewAction, setPreviewAction] = useState(null);

  const allPandaActions = [
    {
      id: 'celebrate',
      name: 'Celebration Dance',
      description: 'Panda does a happy dance when child completes a lesson',
      icon: '🎉',
      unlockThreshold: 0,
      isUnlocked: true,
      category: 'basic'
    },
    {
      id: 'encourage',
      name: 'Encouraging Words',
      description: 'Panda gives motivational messages and cheers',
      icon: '💪',
      unlockThreshold: 0,
      isUnlocked: true,
      category: 'basic'
    },
    {
      id: 'high-five',
      name: 'High Five',
      description: 'Interactive high-five gesture for achievements',
      icon: '🖐️',
      unlockThreshold: 0,
      isUnlocked: true,
      category: 'basic'
    },
    {
      id: 'magic-tricks',
      name: 'Magic Tricks',
      description: 'Fun magic demonstrations as rewards',
      icon: '🎩',
      unlockThreshold: 500,
      isUnlocked: false,
      category: 'premium'
    },
    {
      id: 'dance-party',
      name: 'Dance Party',
      description: 'Extended dance sequence with music',
      icon: '💃',
      unlockThreshold: 750,
      isUnlocked: false,
      category: 'premium'
    },
    {
      id: 'storytelling',
      name: 'Story Time',
      description: 'Panda tells short signed stories',
      icon: '📚',
      unlockThreshold: 1000,
      isUnlocked: false,
      category: 'premium'
    },
    {
      id: 'games',
      name: 'Mini Games',
      description: 'Interactive games and puzzles',
      icon: '🎮',
      unlockThreshold: 1200,
      isUnlocked: false,
      category: 'premium'
    }
  ];

  const handleActionToggle = (actionId) => {
    const currentUnlocked = pandaActions?.unlockedBehaviors || [];
    const currentLocked = pandaActions?.lockedBehaviors || [];
    
    if (currentUnlocked?.includes(actionId)) {
      // Move from unlocked to locked
      onUpdate({
        unlockedBehaviors: currentUnlocked?.filter(id => id !== actionId),
        lockedBehaviors: [...currentLocked, actionId]
      });
    } else {
      // Move from locked to unlocked
      onUpdate({
        unlockedBehaviors: [...currentUnlocked, actionId],
        lockedBehaviors: currentLocked?.filter(id => id !== actionId)
      });
    }
  };

  const isActionUnlocked = (actionId) => {
    return pandaActions?.unlockedBehaviors?.includes(actionId);
  };

  const canUnlockAction = (action) => {
    const childPoints = childData?.totalPoints || 0;
    return childPoints >= action?.unlockThreshold;
  };

  const getProgressToUnlock = (action) => {
    const childPoints = childData?.totalPoints || 0;
    const threshold = action?.unlockThreshold;
    return Math.min(100, (childPoints / threshold) * 100);
  };

  const handleThresholdUpdate = (actionId, newThreshold) => {
    onUpdate({
      achievementThresholds: {
        ...pandaActions?.achievementThresholds,
        [actionId]: newThreshold
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Child Progress */}
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground flex items-center">
            <Gift className="w-5 h-5 mr-2 text-primary" />
            Child's Progress
          </h4>
          <span className="text-2xl font-bold text-primary">
            {childData?.totalPoints || 0} points
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Unlock special panda behaviors by reaching point milestones!
        </div>
      </div>
      {/* Basic Actions (Always Available) */}
      <div>
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-success" />
          Basic Actions (Always Available)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allPandaActions?.filter(action => action?.category === 'basic')?.map(action => {
            const isUnlocked = isActionUnlocked(action?.id);
            
            return (
              <motion.div
                key={action?.id}
                layout
                className={`p-4 border-2 rounded-lg transition-all ${
                  isUnlocked
                    ? 'border-success bg-success/10' :'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{action?.icon}</span>
                      <h5 className="font-semibold text-foreground">{action?.name}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {action?.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setPreviewAction(action)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Preview action"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleActionToggle(action?.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isUnlocked
                          ? 'bg-success text-white hover:bg-success/90' :'bg-muted text-muted-foreground hover:bg-primary hover:text-white'
                      }`}
                      title={isUnlocked ? 'Disable action' : 'Enable action'}
                    >
                      {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Premium Actions (Achievement-Based) */}
      <div>
        <h4 className="font-semibold text-foreground mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-warning" />
          Premium Actions (Achievement-Based)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allPandaActions?.filter(action => action?.category === 'premium')?.map(action => {
            const isUnlocked = isActionUnlocked(action?.id);
            const canUnlock = canUnlockAction(action);
            const progress = getProgressToUnlock(action);
            const threshold = pandaActions?.achievementThresholds?.[action?.id] || action?.unlockThreshold;
            
            return (
              <motion.div
                key={action?.id}
                layout
                className={`p-4 border-2 rounded-lg transition-all ${
                  isUnlocked
                    ? 'border-success bg-success/10'
                    : canUnlock
                    ? 'border-warning bg-warning/10' :'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{action?.icon}</span>
                      <h5 className="font-semibold text-foreground">{action?.name}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {action?.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress to unlock</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-2 rounded-full ${
                            progress >= 100 ? 'bg-success' : 'bg-warning'
                          }`}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {threshold - (childData?.totalPoints || 0)} points needed
                      </div>
                    </div>
                    
                    {/* Threshold Adjustment */}
                    <div className="mb-2">
                      <label className="text-xs text-muted-foreground">
                        Unlock threshold:
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="range"
                          min={action?.unlockThreshold}
                          max={action?.unlockThreshold + 500}
                          step="50"
                          value={threshold}
                          onChange={(e) => handleThresholdUpdate(action?.id, parseInt(e?.target?.value))}
                          className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-medium text-foreground min-w-[60px]">
                          {threshold} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setPreviewAction(action)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Preview action"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => canUnlock && handleActionToggle(action?.id)}
                      disabled={!canUnlock && !isUnlocked}
                      className={`p-2 rounded-lg transition-colors ${
                        isUnlocked
                          ? 'bg-success text-white hover:bg-success/90'
                          : canUnlock
                          ? 'bg-warning text-white hover:bg-warning/90' :'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50'
                      }`}
                      title={
                        isUnlocked 
                          ? 'Disable action' 
                          : canUnlock 
                          ? 'Enable action' :'Not enough points to unlock'
                      }
                    >
                      {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {!canUnlock && !isUnlocked && (
                  <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                    🔒 Requires {threshold} points to unlock
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Preview Modal */}
      {previewAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewAction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{previewAction?.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">
                {previewAction?.name}
              </h3>
            </div>
            <p className="text-muted-foreground mb-4 text-center">
              {previewAction?.description}
            </p>
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <div className="text-sm text-center text-muted-foreground">
                🎬 Preview animation would play here
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewAction(null)}
                className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Test Action
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PandaActionControls;