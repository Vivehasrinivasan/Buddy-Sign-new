import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LessonPreviewCards = ({ 
  recentLessons = [],
  suggestedLessons = [],
  completedCount = 0,
  onStartLesson = () => {},
  className = '' 
}) => {
  const navigate = useNavigate();

  const mockRecentLessons = [
    {
      id: 1,
      title: "Basic Greetings",
      category: "Beginner",
      progress: 85,
      thumbnail: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=300",
      difficulty: "Easy",
      duration: "5 min",
      completed: false,
      points: 25
    },
    {
      id: 2,
      title: "Family Members",
      category: "Beginner",
      progress: 100,
      thumbnail: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=300",
      difficulty: "Easy",
      duration: "8 min",
      completed: true,
      points: 30
    }
  ];

  const mockSuggestedLessons = [
    {
      id: 3,
      title: "Colors & Shapes",
      category: "Beginner",
      progress: 0,
      thumbnail: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=300",
      difficulty: "Easy",
      duration: "6 min",
      completed: false,
      points: 35,
      isNew: true
    },
    {
      id: 4,
      title: "Numbers 1-10",
      category: "Beginner",
      progress: 0,
      thumbnail: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300",
      difficulty: "Easy",
      duration: "7 min",
      completed: false,
      points: 40,
      isRecommended: true
    },
    {
      id: 5,
      title: "Daily Activities",
      category: "Intermediate",
      progress: 0,
      thumbnail: "https://images.pexels.com/photos/8613268/pexels-photo-8613268.jpeg?auto=compress&cs=tinysrgb&w=300",
      difficulty: "Medium",
      duration: "10 min",
      completed: false,
      points: 50
    }
  ];

  const displayRecentLessons = recentLessons?.length > 0 ? recentLessons : mockRecentLessons;
  const displaySuggestedLessons = suggestedLessons?.length > 0 ? suggestedLessons : mockSuggestedLessons;

  const handleLessonClick = (lesson) => {
    onStartLesson(lesson);
    navigate('/interactive-lessons', { state: { selectedLesson: lesson } });
  };

  const LessonCard = ({ lesson, index, isRecent = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-lg shadow-soft border border-border overflow-hidden hover:shadow-medium transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={lesson?.thumbnail}
          alt={lesson?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex items-center space-x-2">
          {lesson?.isNew && (
            <span className="bg-accent text-accent-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
              New
            </span>
          )}
          {lesson?.isRecommended && (
            <span className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-1 rounded-full">
              Recommended
            </span>
          )}
          {lesson?.completed && (
            <div className="bg-success text-success-foreground rounded-full p-1">
              <Icon name="Check" size={12} />
            </div>
          )}
        </div>

        {/* Progress Overlay */}
        {lesson?.progress > 0 && !lesson?.completed && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-accent h-1 rounded-full transition-all duration-300"
                style={{ width: `${lesson?.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-sm font-body font-semibold text-card-foreground line-clamp-1">
              {lesson?.title}
            </h4>
            <p className="text-xs font-caption text-muted-foreground">
              {lesson?.category}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-accent">
            <Icon name="Star" size={12} />
            <span className="text-xs font-mono font-medium">
              {lesson?.points}
            </span>
          </div>
        </div>

        {/* Lesson Details */}
        <div className="flex items-center space-x-4 mb-3 text-xs font-caption text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{lesson?.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="BarChart3" size={12} />
            <span>{lesson?.difficulty}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={lesson?.completed ? "outline" : "default"}
          size="sm"
          onClick={() => handleLessonClick(lesson)}
          className="w-full"
          iconName={lesson?.completed ? "RotateCcw" : lesson?.progress > 0 ? "Play" : "BookOpen"}
          iconPosition="left"
        >
          {lesson?.completed ? 'Review' : lesson?.progress > 0 ? 'Continue' : 'Start'}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recent Lessons Section */}
      {displayRecentLessons?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={20} className="text-primary" />
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Continue Learning
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/interactive-lessons')}
              iconName="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRecentLessons?.map((lesson, index) => (
              <LessonCard 
                key={lesson?.id} 
                lesson={lesson} 
                index={index} 
                isRecent={true} 
              />
            ))}
          </div>
        </div>
      )}
      {/* Suggested Lessons Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} className="text-accent" />
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Suggested for You
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/interactive-lessons')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Explore More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displaySuggestedLessons?.map((lesson, index) => (
            <LessonCard 
              key={lesson?.id} 
              lesson={lesson} 
              index={index} 
            />
          ))}
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-success/10 to-primary/10 rounded-lg p-4 border border-success/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-success rounded-lg">
              <Icon name="BookOpen" size={20} color="white" />
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-foreground">
                {completedCount || displayRecentLessons?.filter(l => l?.completed)?.length}
              </div>
              <div className="text-sm font-caption text-muted-foreground">
                Lessons Completed
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/interactive-lessons')}
            iconName="TrendingUp"
            iconPosition="left"
          >
            View Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPreviewCards;