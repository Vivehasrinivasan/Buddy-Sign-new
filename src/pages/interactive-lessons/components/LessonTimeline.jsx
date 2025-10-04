import React from 'react';
import Icon from '../../../components/AppIcon';

const LessonTimeline = ({ 
  lessons = [], 
  currentLessonId = null, 
  onLessonSelect = () => {},
  userPoints = 0,
  className = '' 
}) => {
  const getLessonStatus = (lesson) => {
    if (lesson?.id === currentLessonId) return 'current';
    if (lesson?.pointsRequired <= userPoints) return 'unlocked';
    if (lesson?.completed) return 'completed';
    return 'locked';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-white' };
      case 'current':
        return { name: 'PlayCircle', color: 'text-primary' };
      case 'unlocked':
        return { name: 'Circle', color: 'text-muted-foreground' };
      default:
        return { name: 'Lock', color: 'text-muted-foreground' };
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white';
      case 'current':
        return 'bg-primary/10 border-primary/20 text-primary ring-2 ring-primary/20';
      case 'unlocked':
        return 'bg-card border-border text-foreground hover:bg-muted/50 cursor-pointer';
      default:
        return 'bg-muted/30 border-border/50 text-muted-foreground cursor-not-allowed opacity-60';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timeline Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Learning Journey
        </h2>
        <p className="text-sm font-body text-muted-foreground">
          Complete lessons to unlock new content and earn points
        </p>
      </div>
      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-8">
            {lessons?.map((lesson, index) => {
              const status = getLessonStatus(lesson);
              const statusIcon = getStatusIcon(status);
              const canAccess = status === 'unlocked' || status === 'current' || status === 'completed';
              
              return (
                <div key={lesson?.id} className="relative flex items-start space-x-6">
                  {/* Timeline Node */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-200
                    ${getStatusStyles(status)}
                  `}>
                    <Icon 
                      name={statusIcon?.name} 
                      size={24} 
                      className={statusIcon?.color}
                    />
                    {status === 'current' && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                    )}
                  </div>
                  {/* Lesson Card */}
                  <div 
                    className={`
                      flex-1 bg-card border border-border rounded-lg p-6 transition-all duration-200 shadow-md
                      ${canAccess ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}
                    `}
                    onClick={() => canAccess && onLessonSelect(lesson)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                          {lesson?.title}
                        </h3>
                        <p className="text-sm font-body text-muted-foreground mb-3">
                          {lesson?.description}
                        </p>
                        
                        {/* Lesson Meta */}
                        <div className="flex items-center space-x-4 text-xs font-caption text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} />
                            <span>{lesson?.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="BarChart3" size={14} />
                            <span>{lesson?.difficulty}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={14} />
                            <span>{lesson?.pointsReward} points</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lesson Preview */}
                      <div className="ml-4">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={lesson?.previewImage} 
                            alt={lesson?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {lesson?.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
                          <span>Progress</span>
                          <span>{lesson?.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${lesson?.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Lock Requirements */}
                    {status === 'locked' && (
                      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm font-body text-muted-foreground">
                          <Icon name="Lock" size={16} />
                          <span>Requires {lesson?.pointsRequired} points to unlock</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-4">
        {lessons?.map((lesson, index) => {
          const status = getLessonStatus(lesson);
          const statusIcon = getStatusIcon(status);
          const canAccess = status === 'unlocked' || status === 'current' || status === 'completed';
          
          return (
            <div 
              key={lesson?.id}
              className={`
                bg-card border border-border rounded-lg p-4 transition-all duration-200
                ${getStatusStyles(status)}
                ${canAccess ? 'hover:shadow-medium' : ''}
              `}
              onClick={() => canAccess && onLessonSelect(lesson)}
            >
              <div className="flex items-start space-x-4">
                {/* Status Icon */}
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 flex-shrink-0
                  ${status === 'completed' ? 'bg-success/10 border-success/20' : 
                    status === 'current' ? 'bg-primary/10 border-primary/20' :
                    status === 'unlocked' ? 'bg-card border-border' : 'bg-muted/30 border-border/50'}
                `}>
                  <Icon 
                    name={statusIcon?.name} 
                    size={20} 
                    className={statusIcon?.color}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-heading font-semibold text-card-foreground mb-1">
                    {lesson?.title}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground mb-3 line-clamp-2">
                    {lesson?.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center space-x-3 text-xs font-caption text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{lesson?.duration}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="BarChart3" size={12} />
                      <span>{lesson?.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={12} />
                      <span>{lesson?.pointsReward}pts</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {lesson?.progress > 0 && (
                    <div className="space-y-1">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${lesson?.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-caption text-muted-foreground">
                        {lesson?.progress}% complete
                      </span>
                    </div>
                  )}

                  {/* Lock Requirements */}
                  {status === 'locked' && (
                    <div className="mt-2 text-xs font-body text-muted-foreground">
                      Unlock with {lesson?.pointsRequired} points
                    </div>
                  )}
                </div>

                {/* Preview Image */}
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={lesson?.previewImage} 
                    alt={lesson?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonTimeline;