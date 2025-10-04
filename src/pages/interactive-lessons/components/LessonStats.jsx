import React from 'react';
import Icon from '../../../components/AppIcon';

const LessonStats = ({ 
  stats = {},
  className = '' 
}) => {
  const statCards = [
    {
      id: 'completed',
      label: 'Lessons Completed',
      value: stats?.completedLessons || 0,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      id: 'in-progress', 
      label: 'In Progress',
      value: stats?.inProgressLessons || 0,
      icon: 'PlayCircle',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    }
  ];

  const achievements = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'Star',
      earned: stats?.completedLessons > 0,
      color: 'text-accent'
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Score 100% on a practice test',
      icon: 'Award',
      earned: stats?.perfectScores > 0,
      color: 'text-success'
    },
    {
      id: 'streak',
      title: 'Learning Streak',
      description: 'Complete lessons 3 days in a row',
      icon: 'Flame',
      earned: stats?.currentStreak >= 3,
      color: 'text-warning'
    },
    {
      id: 'category-master',
      title: 'Category Master',
      description: 'Complete all lessons in a category',
      icon: 'Crown',
      earned: stats?.completedCategories > 0,
      color: 'text-primary'
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Overview */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Learning Progress
        </h3>
        
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-card-foreground">Overall Progress</span>
              <span className="text-muted-foreground">
                {stats?.completedLessons || 0} / {stats?.totalLessons || 0} lessons
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ 
                  width: `${stats?.totalLessons > 0 ? ((stats?.completedLessons || 0) / stats?.totalLessons) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          {/* Category Progress */}
          {stats?.categoryProgress && Object.entries(stats?.categoryProgress)?.map(([category, progress]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-card-foreground capitalize">{category}</span>
                <span className="text-muted-foreground">
                  {progress?.completed} / {progress?.total}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ 
                    width: `${progress?.total > 0 ? (progress?.completed / progress?.total) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements?.map((achievement) => (
            <div
              key={achievement?.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200
                ${achievement?.earned 
                  ? 'bg-accent/10 border-accent/20' :'bg-muted/30 border-border opacity-60'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${achievement?.earned ? 'bg-accent/20' : 'bg-muted'}
              `}>
                <Icon 
                  name={achievement?.icon} 
                  size={20} 
                  className={achievement?.earned ? achievement?.color : 'text-muted-foreground'} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-body font-medium text-card-foreground">
                  {achievement?.title}
                </h4>
                <p className="text-xs font-caption text-muted-foreground">
                  {achievement?.description}
                </p>
              </div>
              {achievement?.earned && (
                <Icon name="Check" size={16} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && stats?.recentActivity?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {stats?.recentActivity?.slice(0, 5)?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors duration-200">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${activity?.type === 'completed' ? 'bg-success/10' : 
                    activity?.type === 'started' ? 'bg-primary/10' : 'bg-accent/10'}
                `}>
                  <Icon 
                    name={activity?.type === 'completed' ? 'CheckCircle' : 
                          activity?.type === 'started' ? 'PlayCircle' : 'Star'} 
                    size={16} 
                    className={activity?.type === 'completed' ? 'text-success' : 
                              activity?.type === 'started' ? 'text-primary' : 'text-accent'} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-card-foreground">
                    {activity?.description}
                  </p>
                  <p className="text-xs font-caption text-muted-foreground">
                    {activity?.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonStats;