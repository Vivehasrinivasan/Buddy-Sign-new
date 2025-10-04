import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickAccessButtons = ({ 
  user = null,
  onAuthRequired = () => {},
  className = '' 
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'lessons',
      title: 'Start Learning',
      description: 'Interactive sign language lessons',
      icon: 'BookOpen',
      color: 'primary',
      path: '/interactive-lessons',
      authRequired: false
    },
    {
      id: 'dictionary',
      title: 'Browse Dictionary',
      description: 'Search sign language words',
      icon: 'Search',
      color: 'accent',
      path: '/dictionary-browser',
      authRequired: false
    },
    {
      id: 'practice',
      title: 'Practice Mode',
      description: 'Test your knowledge',
      icon: 'Target',
      color: 'success',
      path: '/interactive-lessons',
      authRequired: false,
      state: { mode: 'practice' }
    },
    {
      id: 'settings',
      title: 'Parent Settings',
      description: 'Manage controls & preferences',
      icon: 'Settings',
      color: 'secondary',
      path: '/settings-hub',
      authRequired: true
    }
  ];

  const handleActionClick = (action) => {
    if (action?.authRequired && !user?.isParent) {
      onAuthRequired(action?.path);
      return;
    }
    
    navigate(action?.path, action?.state ? { state: action?.state } : undefined);
  };

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'from-primary/10 to-primary/5 border-primary/20 hover:border-primary/30',
      accent: 'from-accent/10 to-accent/5 border-accent/20 hover:border-accent/30',
      success: 'from-success/10 to-success/5 border-success/20 hover:border-success/30',
      secondary: 'from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/30'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getIconColor = (color) => {
    const colorMap = {
      primary: 'text-primary',
      accent: 'text-accent',
      success: 'text-success',
      secondary: 'text-secondary'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Quick Actions
          </h3>
        </div>
        <div className="text-sm font-caption text-muted-foreground">
          Jump right into learning
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action, index) => (
          <motion.div
            key={action?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => handleActionClick(action)}
              className={`
                w-full p-4 rounded-xl border transition-all duration-200
                bg-gradient-to-br ${getColorClasses(action?.color)}
                hover:shadow-medium focus:outline-none focus:ring-2 focus:ring-primary/20
                ${action?.authRequired && !user?.isParent ? 'opacity-75' : ''}
              `}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon */}
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-lg
                  ${action?.color === 'primary' ? 'bg-primary/10' :
                    action?.color === 'accent' ? 'bg-accent/10' :
                    action?.color === 'success'? 'bg-success/10' : 'bg-secondary/10'
                  }
                `}>
                  <Icon 
                    name={action?.icon} 
                    size={24} 
                    className={getIconColor(action?.color)}
                  />
                  {action?.authRequired && !user?.isParent && (
                    <div className="absolute -top-1 -right-1">
                      <Icon name="Lock" size={12} className="text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-body font-semibold text-foreground mb-1">
                    {action?.title}
                  </h4>
                  <p className="text-xs font-caption text-muted-foreground line-clamp-2">
                    {action?.description}
                  </p>
                </div>

                {/* Action Indicator */}
                <div className="flex items-center space-x-1 text-xs font-caption text-muted-foreground">
                  <Icon name="ArrowRight" size={12} />
                  <span>
                    {action?.authRequired && !user?.isParent ? 'Requires Parent' : 'Get Started'}
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      {/* Additional Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <div className="text-lg font-mono font-bold text-primary">
            12
          </div>
          <div className="text-xs font-caption text-muted-foreground">
            Lessons Available
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <div className="text-lg font-mono font-bold text-accent">
            150+
          </div>
          <div className="text-xs font-caption text-muted-foreground">
            Words in Dictionary
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <div className="text-lg font-mono font-bold text-success">
            5
          </div>
          <div className="text-xs font-caption text-muted-foreground">
            Practice Tests
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <div className="text-lg font-mono font-bold text-secondary">
            24/7
          </div>
          <div className="text-xs font-caption text-muted-foreground">
            Learning Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessButtons;