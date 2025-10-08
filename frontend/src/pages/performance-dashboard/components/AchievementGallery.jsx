import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AchievementGallery = ({ achievements = [] }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleShare = (achievement) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the "${achievement?.title}" achievement!`,
        text: `Check out my sign language learning progress! I just earned: ${achievement?.title} - ${achievement?.description}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      const shareText = `I earned the "${achievement?.title}" achievement in sign language learning! 🎉`;
      navigator.clipboard.writeText(shareText);
      // You could show a toast notification here
    }
  };

  const getProgressPercentage = (achievement) => {
    if (achievement?.earned) return 100;
    if (achievement?.progress && achievement?.total) {
      return (achievement?.progress / achievement?.total) * 100;
    }
    return 0;
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
              <Icon name="Award" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Achievement Gallery
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Celebrate your milestones and share your success
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-caption text-muted-foreground">Earned</div>
            <div className="text-lg font-mono font-bold text-accent">
              {achievements?.filter(a => a?.earned)?.length}/{achievements?.length}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements?.map((achievement, index) => (
            <motion.div
              key={achievement?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedAchievement(achievement)}
              className={`
                relative overflow-hidden rounded-lg p-4 cursor-pointer
                border transition-all duration-300
                ${achievement?.earned 
                  ? `bg-${achievement?.color}/10 border-${achievement?.color}/30 hover:shadow-lg` 
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
                }
              `}
            >
              {/* Achievement Badge */}
              <div className="text-center mb-4">
                <motion.div
                  animate={{ 
                    rotate: achievement?.earned ? [0, 10, -10, 0] : 0,
                    scale: achievement?.earned ? 1 : 0.8
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, repeatDelay: 3 },
                    scale: { duration: 0.3 }
                  }}
                  className={`
                    inline-flex items-center justify-center
                    w-16 h-16 rounded-full mx-auto mb-3
                    ${achievement?.earned 
                      ? `bg-${achievement?.color} text-white shadow-lg` 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  <Icon 
                    name={achievement?.icon} 
                    size={28}
                  />
                </motion.div>

                {/* Unlock Animation for Earned Achievements */}
                {achievement?.earned && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="absolute top-2 right-2"
                  >
                    <Icon 
                      name="Sparkles" 
                      size={16} 
                      className={`text-${achievement?.color} animate-pulse`}
                    />
                  </motion.div>
                )}
              </div>

              {/* Achievement Info */}
              <div className="text-center">
                <h4 className="text-sm font-body font-semibold text-foreground mb-1">
                  {achievement?.title}
                </h4>
                <p className="text-xs font-caption text-muted-foreground mb-3">
                  {achievement?.description}
                </p>

                {/* Progress or Earned Date */}
                {achievement?.earned ? (
                  <div className={`text-xs font-caption text-${achievement?.color} font-medium`}>
                    Earned {achievement?.earnedDate}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs font-caption text-muted-foreground">
                      Progress: {achievement?.progress || 0}/{achievement?.total || 1}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div 
                        className={`bg-${achievement?.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(achievement)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Share Button for Earned Achievements */}
                {achievement?.earned && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(achievement);
                    }}
                    className={`
                      mt-3 px-3 py-1 rounded-full text-xs font-caption
                      bg-${achievement?.color} text-white
                      hover:opacity-90 transition-opacity
                    `}
                  >
                    Share Achievement
                  </motion.button>
                )}
              </div>

              {/* Locked Overlay for Unearned Achievements */}
              {!achievement?.earned && (
                <div className="absolute inset-0 bg-muted/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon 
                    name="Lock" 
                    size={24} 
                    className="text-muted-foreground opacity-50"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: achievements?.length * 0.1 + 0.3 }}
          className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10"
        >
          <div className="flex items-center space-x-3">
            <Icon 
              name="Target" 
              size={18} 
              className="text-primary animate-pulse" 
            />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Keep Collecting Achievements!
              </h5>
              <p className="text-xs font-caption text-muted-foreground">
                {achievements?.filter(a => a?.earned)?.length === 0 
                  ? "Start your journey and earn your first achievement!"
                  : achievements?.filter(a => a?.earned)?.length === achievements?.length
                  ? "Congratulations! You've earned all achievements! 🎉" 
                  : `You're doing great! ${achievements?.length - achievements?.filter(a => a?.earned)?.length} more achievements to unlock.`}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl p-6 max-w-md w-full border border-border shadow-2xl"
          >
            <div className="text-center">
              <div className={`
                inline-flex items-center justify-center
                w-20 h-20 rounded-full mx-auto mb-4
                ${selectedAchievement?.earned 
                  ? `bg-${selectedAchievement?.color} text-white` 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                <Icon 
                  name={selectedAchievement?.icon} 
                  size={36}
                />
              </div>
              
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                {selectedAchievement?.title}
              </h3>
              
              <p className="text-sm font-body text-muted-foreground mb-4">
                {selectedAchievement?.description}
              </p>

              {selectedAchievement?.earned ? (
                <div className={`text-sm font-caption text-${selectedAchievement?.color} font-medium mb-4`}>
                  🎉 Earned on {selectedAchievement?.earnedDate}
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-sm font-caption text-muted-foreground mb-2">
                    Progress: {selectedAchievement?.progress || 0}/{selectedAchievement?.total || 1}
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`bg-${selectedAchievement?.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${getProgressPercentage(selectedAchievement)}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementGallery;  