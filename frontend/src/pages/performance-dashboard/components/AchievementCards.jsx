import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AchievementCards = ({ 
  totalLessons = 0, 
  testsAttended = 0, 
  overallProgress = 0 
}) => {
  const cards = [
    {
      id: 1,
      title: "Lessons Completed",
      value: totalLessons,
      icon: "BookOpen",
      color: "primary",
      bgGradient: "from-primary/20 to-primary/10",
      borderColor: "border-primary/30",
      subtitle: "Interactive lessons"
    },
    {
      id: 2,
      title: "Tests Attended",
      value: testsAttended,
      icon: "CheckCircle",
      color: "success",
      bgGradient: "from-success/20 to-success/10",
      borderColor: "border-success/30",
      subtitle: "Assessment completed"
    },
    {
      id: 3,
      title: "Overall Progress",
      value: `${overallProgress}%`,
      icon: "TrendingUp",
      color: "accent",
      bgGradient: "from-accent/20 to-accent/10",
      borderColor: "border-accent/30",
      subtitle: "Course completion"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards?.map((card, index) => (
        <motion.div
          key={card?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5 
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className={`
            relative overflow-hidden rounded-xl p-6
            bg-gradient-to-br ${card?.bgGradient}
            border ${card?.borderColor}
            shadow-soft hover:shadow-lg
            transition-all duration-300
          `}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
            <Icon 
              name={card?.icon} 
              size={80} 
              className={`text-${card?.color}`}
            />
          </div>

          {/* Icon */}
          <div className={`
            inline-flex items-center justify-center
            w-12 h-12 rounded-lg mb-4
            bg-${card?.color} text-white
            shadow-sm
          `}>
            <Icon 
              name={card?.icon} 
              size={24} 
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: (index * 0.1) + 0.2 }}
              className={`
                text-3xl font-mono font-bold 
                text-${card?.color} mb-2
              `}
            >
              {card?.value}
            </motion.div>
            
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              {card?.title}
            </h3>
            
            <p className="text-sm font-caption text-muted-foreground">
              {card?.subtitle}
            </p>
          </div>

          {/* Celebratory Animation */}
          {card?.id === 1 && totalLessons > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-2 right-2"
            >
              <Icon 
                name="Sparkles" 
                size={16} 
                className="text-accent animate-pulse" 
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AchievementCards;