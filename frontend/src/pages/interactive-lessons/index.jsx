import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AuthGateModal from '../../components/ui/AuthGateModal';
import LessonTimeline from './components/LessonTimeline';
import LessonContent from './components/LessonContent';
import LessonFilters from './components/LessonFilters';
import LessonStats from './components/LessonStats';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InteractiveLessons = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Alex Chen",
    email: "alex@example.com",
    points: 450,
    isParent: false
  });
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [],
    category: [],
    duration: [],
    status: []
  });

  // Mock lessons data
  const lessons = [
    {
      id: 1,
      title: "Sign Language Alphabet - A to E",
      description: "Learn the first five letters of the ASL alphabet with interactive practice",
      difficulty: "beginner",
      category: "alphabet",
      duration: 8,
      pointsRequired: 0,
      pointsReward: 50,
      completed: true,
      progress: 100,
      previewImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
      content: [
        {
          title: "Letter A",
          description: "Learn how to sign the letter A",
          type: "gif",
          media: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
          caption: "Make a fist with your thumb on the side",
          audio: "/audio/letter-a.mp3"
        },
        {
          title: "Letter B", 
          description: "Learn how to sign the letter B",
          type: "gif",
          media: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
          caption: "Hold up four fingers with thumb tucked in",
          audio: "/audio/letter-b.mp3"
        }
      ],
      practice: [
        {
          id: 1,
          question: "Which hand position represents the letter \'A\'?",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=200&h=200&fit=crop",
          options: ["Closed fist with thumb on side", "Open palm", "Pointing finger", "Peace sign"],
          correctAnswer: "Closed fist with thumb on side"
        },
        {
          id: 2,
          question: "How many fingers are extended for the letter \'B\'?",
          options: ["Two", "Three", "Four", "Five"],
          correctAnswer: "Four"
        }
      ]
    },
    {
      id: 2,
      title: "Basic Greetings",
      description: "Master essential greeting signs like hello, goodbye, and nice to meet you",
      difficulty: "beginner",
      category: "greetings",
      duration: 12,
      pointsRequired: 50,
      pointsReward: 75,
      completed: false,
      progress: 60,
      previewImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      content: [
        {
          title: "Hello Sign",
          description: "Learn the universal greeting in sign language",
          type: "gif",
          media: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
          caption: "Wave your hand in a friendly motion",
          audio: "/audio/hello.mp3"
        }
      ],
      practice: [
        {
          id: 1,
          question: "What motion is used for \'Hello\' in sign language?",
          options: ["Waving motion", "Pointing", "Clapping", "Thumbs up"],
          correctAnswer: "Waving motion"
        }
      ]
    },
    {
      id: 3,
      title: "Numbers 1-10",
      description: "Count from one to ten using proper ASL number formation",
      difficulty: "beginner",
      category: "numbers",
      duration: 15,
      pointsRequired: 125,
      pointsReward: 100,
      completed: false,
      progress: 0,
      previewImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
      content: [
        {
          title: "Number One",
          description: "Learn to sign the number 1",
          type: "image",
          media: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
          caption: "Point your index finger upward"
        }
      ],
      practice: [
        {
          id: 1,
          question: "How do you sign the number '1'?",
          options: ["Index finger up", "Thumb up", "Closed fist", "Open palm"],
          correctAnswer: "Index finger up"
        }
      ]
    },
    {
      id: 4,
      title: "Family Members",
      description: "Learn signs for mom, dad, sister, brother, and other family terms",
      difficulty: "intermediate",
      category: "family",
      duration: 20,
      pointsRequired: 225,
      pointsReward: 125,
      completed: false,
      progress: 0,
      previewImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop",
      content: [
        {
          title: "Mother Sign",
          description: "Learn how to sign \'mother\' or \'mom'",
          type: "gif",
          media: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop",
          caption: "Touch your thumb to your chin"
        }
      ],
      practice: [
        {
          id: 1,
          question: "Where do you touch when signing 'mother'?",
          options: ["Forehead", "Chin", "Chest", "Nose"],
          correctAnswer: "Chin"
        }
      ]
    },
    {
      id: 5,
      title: "Colors and Shapes",
      description: "Express colors like red, blue, green and basic shapes in sign language",
      difficulty: "intermediate",
      category: "colors",
      duration: 18,
      pointsRequired: 350,
      pointsReward: 150,
      completed: false,
      progress: 0,
      previewImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
      content: [
        {
          title: "Red Color Sign",
          description: "Learn to sign the color red",
          type: "gif",
          media: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
          caption: "Touch your lips with your index finger and pull down"
        }
      ],
      practice: [
        {
          id: 1,
          question: "How do you sign the color 'red'?",
          options: ["Touch lips and pull down", "Point to something red", "Make a circle", "Wave hands"],
          correctAnswer: "Touch lips and pull down"
        }
      ]
    }
  ];

  // Mock stats data
  const stats = {
    completedLessons: 1,
    inProgressLessons: 1,
    totalLessons: 5,
    totalMinutes: 45,
    averageScore: 85,
    perfectScores: 1,
    currentStreak: 2,
    completedCategories: 0,
    categoryProgress: {
      alphabet: { completed: 1, total: 2 },
      greetings: { completed: 0, total: 1 },
      numbers: { completed: 0, total: 1 },
      family: { completed: 0, total: 1 },
      colors: { completed: 0, total: 1 }
    },
    recentActivity: [
      {
        type: 'completed',
        description: 'Completed "Sign Language Alphabet - A to E"',
        timestamp: '2 hours ago'
      },
      {
        type: 'started',
        description: 'Started "Basic Greetings"',
        timestamp: '1 day ago'
      },
      {
        type: 'achievement',
        description: 'Earned "First Steps" achievement',
        timestamp: '2 days ago'
      }
    ]
  };

  const handleSignOut = () => {
    setUser(null);
    navigate('/sign-in-sign-up');
  };

  const handleAuthRequired = (targetPath) => {
    setPendingRoute(targetPath);
    setShowAuthModal(true);
  };

  const handleAuthenticate = (targetPath) => {
    setUser(prev => ({ ...prev, isParent: true }));
    navigate(targetPath);
  };

  const handleLessonSelect = (lesson) => {
    const status = getLessonStatus(lesson);
    if (status === 'unlocked' || status === 'current' || status === 'completed') {
      setSelectedLesson(lesson);
    }
  };

  const handleLessonComplete = (lessonId, score) => {
    // Update lesson completion status
    setSelectedLesson(null);
    // In a real app, this would update the backend
    console.log(`Lesson ${lessonId} completed with score: ${score}%`);
  };

  const getLessonStatus = (lesson) => {
    if (lesson?.completed) return 'completed';
    if (lesson?.progress > 0) return 'current';
    if (lesson?.pointsRequired <= user?.points) return 'unlocked';
    return 'locked';
  };

  const filteredLessons = lessons?.filter(lesson => {
    if (filters?.difficulty?.length > 0 && !filters?.difficulty?.includes(lesson?.difficulty)) {
      return false;
    }
    if (filters?.category?.length > 0 && !filters?.category?.includes(lesson?.category)) {
      return false;
    }
    if (filters?.duration?.length > 0) {
      const maxDuration = Math.max(...filters?.duration?.map(d => parseInt(d)));
      if (lesson?.duration > maxDuration) {
        return false;
      }
    }
    if (filters?.status?.length > 0) {
      const status = getLessonStatus(lesson);
      const statusMap = {
        'completed': 'completed',
        'current': 'in-progress',
        'unlocked': 'not-started',
        'locked': 'not-started'
      };
      if (!filters?.status?.includes(statusMap?.[status])) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onSignOut={handleSignOut} />
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
          onAuthRequired={handleAuthRequired}
        />
        
        <main className="flex-1 pt-16 lg:ml-60">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Interactive Lessons
                </h1>
                <p className="text-lg font-body text-muted-foreground">
                  Learn sign language through structured, engaging lessons
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant={showStats ? 'default' : 'outline'}
                  size="sm"
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => setShowStats(!showStats)}
                >
                  Stats
                </Button>
                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  size="sm"
                  iconName="Filter"
                  iconPosition="left"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
              </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Sidebar Panels */}
              <div className="xl:col-span-1 space-y-6">
                {/* Filters Panel */}
                {showFilters && (
                  <LessonFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={() => setFilters({ difficulty: [], category: [], duration: [], status: [] })}
                  />
                )}
                
                {/* Stats Panel */}
                {showStats && (
                  <LessonStats stats={stats} />
                )}
                
                {/* Points Progress */}
                <div className="bg-card border border-border rounded-lg p-4 shadow-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon name="Star" size={20} className="text-accent" />
                    <div>
                      <h3 className="font-body font-medium text-card-foreground">
                        Your Points
                      </h3>
                      <p className="text-2xl font-heading font-bold text-primary">
                        {user?.points}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
                      <span>Progress to next reward</span>
                      <span>{user?.points}/500</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                        style={{ width: `${(user?.points / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-3">
                {selectedLesson ? (
                  <LessonContent
                    lesson={selectedLesson}
                    onComplete={handleLessonComplete}
                    onClose={() => setSelectedLesson(null)}
                    userProgress={{}}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Results Summary */}
                    <div className="bg-card border border-border rounded-lg p-6 shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-semibold text-card-foreground">
                          Lesson Results
                        </h2>
                        <span className="text-sm font-caption text-muted-foreground">
                          {filteredLessons?.length} of {lessons?.length} lessons
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-heading font-bold text-success">
                            {filteredLessons?.filter(l => l?.completed)?.length}
                          </p>
                          <p className="text-xs font-caption text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-heading font-bold text-primary">
                            {filteredLessons?.filter(l => l?.progress > 0 && !l?.completed)?.length}
                          </p>
                          <p className="text-xs font-caption text-muted-foreground">In Progress</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-heading font-bold text-accent">
                            {filteredLessons?.filter(l => l?.pointsRequired <= user?.points && !l?.completed && l?.progress === 0)?.length}
                          </p>
                          <p className="text-xs font-caption text-muted-foreground">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-heading font-bold text-muted-foreground">
                            {filteredLessons?.filter(l => l?.pointsRequired > user?.points)?.length}
                          </p>
                          <p className="text-xs font-caption text-muted-foreground">Locked</p>
                        </div>
                      </div>
                    </div>

                    {/* Lesson Timeline */}
                    <LessonTimeline
                      lessons={filteredLessons}
                      currentLessonId={filteredLessons?.find(l => l?.progress > 0 && !l?.completed)?.id}
                      onLessonSelect={handleLessonSelect}
                      userPoints={user?.points}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Auth Gate Modal */}
      <AuthGateModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticate={handleAuthenticate}
        targetPath={pendingRoute}
      />
    </div>
  );
};

export default InteractiveLessons;