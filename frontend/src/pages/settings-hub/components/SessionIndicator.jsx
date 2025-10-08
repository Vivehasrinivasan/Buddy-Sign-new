import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionIndicator = ({ 
  onLogout = () => {},
  sessionDuration = 1800, // 30 minutes in seconds
  className = '' 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration);
  const [isWarning, setIsWarning] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Show warning when 5 minutes remaining
        if (newTime <= 300 && !isWarning) {
          setIsWarning(true);
          setShowExtendModal(true);
        }
        
        // Auto logout when time expires
        if (newTime <= 0) {
          onLogout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout, isWarning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setTimeRemaining(sessionDuration);
    setIsWarning(false);
    setShowExtendModal(false);
  };

  const handleLogoutNow = () => {
    setShowExtendModal(false);
    onLogout();
  };

  const progressPercentage = (timeRemaining / sessionDuration) * 100;

  return (
    <>
      <div className={`bg-card rounded-lg border border-border p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isWarning ? 'bg-warning/10' : 'bg-success/10'
            }`}>
              <Icon 
                name={isWarning ? 'AlertTriangle' : 'Shield'} 
                size={16} 
                className={isWarning ? 'text-warning' : 'text-success'} 
              />
            </div>
            <div>
              <p className="text-sm font-body font-medium text-card-foreground">
                Secure Session Active
              </p>
              <p className="text-xs font-caption text-muted-foreground">
                Auto-logout in {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            iconName="LogOut"
            iconPosition="left"
            className="text-muted-foreground hover:text-destructive"
          >
            Logout
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                isWarning ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Session Extension Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card rounded-lg shadow-floating border border-border animate-fade-in">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mx-auto mb-4">
                  <Icon name="Clock" size={32} className="text-warning" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                  Session Expiring Soon
                </h3>
                <p className="text-sm font-body text-muted-foreground">
                  Your secure session will expire in {formatTime(timeRemaining)}. Would you like to extend it?
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleLogoutNow}
                  className="flex-1"
                >
                  Logout Now
                </Button>
                <Button
                  variant="default"
                  onClick={handleExtendSession}
                  iconName="RefreshCw"
                  iconPosition="left"
                  className="flex-1"
                >
                  Extend Session
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs font-caption text-muted-foreground">
                  Session will be extended for another 30 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionIndicator;