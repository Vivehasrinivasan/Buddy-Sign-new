import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FamilyProgress = ({ children = [], parentData }) => {
  // Calculate family stats
  const totalPoints = children?.reduce((sum, child) => sum + child?.totalPoints, 0);
  const totalLessons = children?.reduce((sum, child) => sum + child?.lessonsCompleted, 0);
  const averageStreak = children?.length > 0 
    ? Math.round(children?.reduce((sum, child) => sum + child?.currentStreak, 0) / children?.length)
    : 0;
  const activeChildren = children?.filter(child => child?.isActive)?.length;

  const getWeeklyActivity = () => {
    // Mock weekly activity data - in real app, this would come from API
    return [
      { day: 'Mon', active: 2, lessons: 3 },
      { day: 'Tue', active: 1, lessons: 2 },
      { day: 'Wed', active: 2, lessons: 4 },
      { day: 'Thu', active: 1, lessons: 1 },
      { day: 'Fri', active: 2, lessons: 5 },
      { day: 'Sat', active: 1, lessons: 2 },
      { day: 'Sun', active: 0, lessons: 0 }
    ];
  };

  const weeklyActivity = getWeeklyActivity();
  const maxLessons = Math.max(...weeklyActivity?.map(day => day?.lessons));

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-success/10 p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Activity" size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              Family Learning Progress
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Monitor overall family learning progress and engagement
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Family Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-primary/10 rounded-lg"
          >
            <div className="text-2xl font-mono font-bold text-primary mb-1">
              {totalPoints}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Total Points
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-success/10 rounded-lg"
          >
            <div className="text-2xl font-mono font-bold text-success mb-1">
              {totalLessons}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Lessons Completed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 bg-accent/10 rounded-lg"
          >
            <div className="text-2xl font-mono font-bold text-accent mb-1">
              {averageStreak}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Avg Streak
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-4 bg-secondary/10 rounded-lg"
          >
            <div className="text-2xl font-mono font-bold text-secondary mb-1">
              {activeChildren}/{children?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">
              Active Today
            </div>
          </motion.div>
        </div>

        {/* Weekly Activity Chart */}
        <div>
          <h4 className="text-sm font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span>Weekly Activity</span>
          </h4>
          
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-end justify-between space-x-2 h-32">
              {weeklyActivity?.map((day, index) => (
                <motion.div
                  key={day?.day}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex-1 flex flex-col items-center space-y-2"
                >
                  <div className="flex-1 flex items-end">
                    <div
                      className="w-full bg-primary rounded-t-sm"
                      style={{ 
                        height: maxLessons > 0 ? `${(day?.lessons / maxLessons) * 80}px` : '2px',
                        minHeight: '2px'
                      }}
                    />
                  </div>
                  <div className="text-xs font-caption text-center">
                    <div className="font-semibold text-foreground">{day?.day}</div>
                    <div className="text-muted-foreground">{day?.lessons}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-3 flex items-center justify-center space-x-4 text-xs font-caption text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Lessons Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Child Progress */}
        {children?.length > 0 && (
          <div>
            <h4 className="text-sm font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-success" />
              <span>Individual Progress</span>
            </h4>
            
            <div className="space-y-3">
              {children?.map((child, index) => (
                <motion.div
                  key={child?.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  className="bg-muted/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={child?.avatar}
                        alt={child?.fakeName}
                        className="w-8 h-8 rounded-full border border-border"
                      />
                      <div>
                        <div className="text-sm font-body font-semibold text-foreground">
                          {child?.fakeName}
                        </div>
                        <div className="text-xs font-caption text-muted-foreground">
                          Age {child?.age}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-primary">
                        {child?.totalPoints} pts
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">
                        {child?.lessonsCompleted} lessons
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs font-caption text-muted-foreground mb-1">
                        <span>Learning Progress</span>
                        <span>{Math.round((child?.lessonsCompleted / 50) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((child?.lessonsCompleted / 50) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 1 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-caption text-muted-foreground mb-1">
                        <span>Current Streak</span>
                        <span>{child?.currentStreak} days</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-success h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((child?.currentStreak / 10) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 1.2 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className={`
                      flex items-center space-x-1 text-xs font-caption
                      ${child?.isActive ? 'text-success' : 'text-muted-foreground'}
                    `}>
                      <div className={`
                        w-2 h-2 rounded-full
                        ${child?.isActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}
                      `} />
                      <span>{child?.isActive ? 'Active today' : `Last seen ${child?.lastActive}`}</span>
                    </div>
                    
                    <div className="text-xs font-caption text-muted-foreground">
                      Screen time: {child?.safetySettings?.screenTime}min/day
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Family Goals */}
        <div className="bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-4 border border-success/20">
          <div className="flex items-center space-x-3">
            <Icon 
              name="Target" 
              size={18} 
              className="text-success animate-pulse" 
            />
            <div>
              <h5 className="text-sm font-body font-semibold text-foreground">
                Family Achievement Goals
              </h5>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                {totalPoints >= 1000 ? "Amazing! Your family has mastered the basics of sign language!" :
                 totalPoints >= 500 ? "Great progress! You're halfway to becoming sign language champions!" :
                 totalPoints >= 100 ? "Good start! Keep practicing together to build your skills!": "Welcome to your sign language journey! Set goals and learn together!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyProgress;