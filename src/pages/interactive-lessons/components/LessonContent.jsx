import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LessonContent = ({ 
  lesson = null, 
  onComplete = () => {},
  onClose = () => {},
  userProgress = {},
  className = '' 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const steps = lesson?.content || [];
  const currentStepData = steps?.[currentStep];
  const isLastStep = currentStep === steps?.length - 1;

  useEffect(() => {
    if (lesson) {
      setCurrentStep(0);
      setShowPractice(false);
      setPracticeAnswers({});
      setShowResults(false);
    }
  }, [lesson]);

  const handleNext = () => {
    if (isLastStep) {
      setShowPractice(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePracticeAnswer = (questionId, answer) => {
    setPracticeAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitPractice = () => {
    const correctAnswers = lesson?.practice?.filter(q => 
      practiceAnswers?.[q?.id] === q?.correctAnswer
    )?.length;
    const score = Math.round((correctAnswers / lesson?.practice?.length) * 100);
    
    setShowResults(true);
    
    // Complete lesson after showing results
    setTimeout(() => {
      onComplete(lesson?.id, score);
    }, 2000);
  };

  const toggleVideo = () => {
    if (videoRef?.current) {
      if (isVideoPlaying) {
        videoRef?.current?.pause();
      } else {
        videoRef?.current?.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  if (!lesson) return null;

  return (
    <div className={`bg-card border border-border rounded-lg shadow-medium ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-heading font-semibold text-card-foreground">
              {lesson?.title}
            </h2>
            <p className="text-sm font-caption text-muted-foreground">
              {showPractice ? 'Practice Test' : `Step ${currentStep + 1} of ${steps?.length}`}
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ 
                width: showPractice ? '100%' : `${((currentStep + 1) / steps?.length) * 100}%` 
              }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {showPractice ? '100%' : `${Math.round(((currentStep + 1) / steps?.length) * 100)}%`}
          </span>
        </div>
      </div>
      {/* Content Area */}
      <div className="p-6">
        {!showPractice && currentStepData && (
          <div className="space-y-6">
            {/* Step Title */}
            <div className="text-center">
              <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                {currentStepData?.title}
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                {currentStepData?.description}
              </p>
            </div>

            {/* Media Content */}
            <div className="flex justify-center">
              {currentStepData?.type === 'image' && (
                <div className="relative max-w-md w-full">
                  <img 
                    src={currentStepData?.media} 
                    alt={currentStepData?.title}
                    className="w-full h-64 object-cover rounded-lg shadow-soft"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm font-body">{currentStepData?.caption}</p>
                  </div>
                </div>
              )}

              {currentStepData?.type === 'gif' && (
                <div className="relative max-w-md w-full">
                  <img 
                    src={currentStepData?.media} 
                    alt={currentStepData?.title}
                    className="w-full h-64 object-cover rounded-lg shadow-soft"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-caption">
                    GIF
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm font-body">{currentStepData?.caption}</p>
                  </div>
                </div>
              )}

              {currentStepData?.type === 'video' && (
                <div className="relative max-w-md w-full">
                  <video 
                    ref={videoRef}
                    src={currentStepData?.media}
                    className="w-full h-64 object-cover rounded-lg shadow-soft"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    controls
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVideo}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  >
                    <Icon name={isVideoPlaying ? 'Pause' : 'Play'} size={24} />
                  </Button>
                </div>
              )}
            </div>

            {/* Audio Pronunciation */}
            {currentStepData?.audio && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  iconName="Volume2"
                  iconPosition="left"
                  onClick={() => {
                    const audio = new Audio(currentStepData.audio);
                    audio?.play();
                  }}
                  className="font-body"
                >
                  Listen to Pronunciation
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button
                variant="outline"
                iconName="ChevronLeft"
                iconPosition="left"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {steps?.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentStep ? 'bg-primary' : 
                      index < currentStep ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="default"
                iconName={isLastStep ? 'BookOpen' : 'ChevronRight'}
                iconPosition="right"
                onClick={handleNext}
              >
                {isLastStep ? 'Practice' : 'Next'}
              </Button>
            </div>
          </div>
        )}

        {/* Practice Test */}
        {showPractice && !showResults && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                Practice Test
              </h3>
              <p className="text-sm font-body text-muted-foreground">
                Test your understanding of this lesson
              </p>
            </div>

            <div className="space-y-6">
              {lesson?.practice?.map((question, index) => (
                <div key={question?.id} className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-body font-medium text-card-foreground mb-3">
                    {index + 1}. {question?.question}
                  </h4>
                  
                  {question?.image && (
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={question?.image} 
                        alt="Question"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {question?.options?.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`
                          flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200
                          ${practiceAnswers?.[question?.id] === option 
                            ? 'bg-primary/10 border border-primary/20' :'bg-card border border-border hover:bg-muted/50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`question-${question?.id}`}
                          value={option}
                          checked={practiceAnswers?.[question?.id] === option}
                          onChange={(e) => handlePracticeAnswer(question?.id, e?.target?.value)}
                          className="sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${practiceAnswers?.[question?.id] === option 
                            ? 'border-primary bg-primary' :'border-muted-foreground'
                          }
                        `}>
                          {practiceAnswers?.[question?.id] === option && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-body text-sm text-card-foreground">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-6 border-t border-border">
              <Button
                variant="default"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={handleSubmitPractice}
                disabled={Object.keys(practiceAnswers)?.length < lesson?.practice?.length}
                className="px-8"
              >
                Submit Test
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Trophy" size={32} className="text-success" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-card-foreground">
                Great Job!
              </h3>
              <p className="text-lg font-body text-muted-foreground">
                You scored{' '}
                <span className="font-semibold text-success">
                  {Math.round((Object.values(practiceAnswers)?.filter((answer, index) => 
                    answer === lesson?.practice?.[index]?.correctAnswer
                  )?.length / lesson?.practice?.length) * 100)}%
                </span>
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-accent-foreground">
                <Icon name="Star" size={20} className="text-accent" />
                <span className="font-body font-medium">
                  +{lesson?.pointsReward} points earned!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;