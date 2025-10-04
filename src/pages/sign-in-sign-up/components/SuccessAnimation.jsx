import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const SuccessAnimation = ({ isVisible = false, message = 'Success!', onComplete = () => {}, className = '' }) => {
  const [confetti, setConfetti] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const particles = [];
      for (let i = 0; i < 20; i++) {
        particles?.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 500,
          color: ['text-primary', 'text-secondary', 'text-accent', 'text-success']?.[Math.floor(Math.random() * 4)]
        });
      }
      setConfetti(particles);
      setShowMessage(true);

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
      setShowMessage(false);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}>
      {/* Confetti */}
      {confetti?.map((particle) => (
        <div
          key={particle?.id}
          className={`absolute animate-confetti ${particle?.color}`}
          style={{
            left: `${particle?.left}%`,
            animationDelay: `${particle?.delay}ms`
          }}
        >
          <Icon name="Sparkles" size={16} />
        </div>
      ))}
      {/* Success Message */}
      {showMessage && (
        <div className="bg-card rounded-lg shadow-floating border border-border p-8 text-center animate-scale-in">
          <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success animate-bounce-gentle" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-card-foreground mb-2">
            {message}
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            Welcome to BuddySign! Redirecting you to your dashboard...
          </p>
          
          {/* Panda Celebration */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/20 rounded-full animate-bounce-gentle">
                <div className="absolute top-2 left-2 w-2 h-2 bg-primary/60 rounded-full" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary/60 rounded-full" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary/80 rounded-full" />
              </div>
              <div className="absolute -top-2 -right-2 animate-spin-slow">
                <Icon name="Star" size={16} className="text-accent" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessAnimation;