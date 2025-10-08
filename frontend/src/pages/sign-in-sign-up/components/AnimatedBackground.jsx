import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const AnimatedBackground = ({ className = '' }) => {
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = [];
    for (let i = 0; i < 12; i++) {
      elements?.push({
        id: i,
        icon: ['Hand', 'Heart', 'Star', 'Sparkles', 'Smile']?.[Math.floor(Math.random() * 5)],
        size: Math.random() * 20 + 16,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 4
      });
    }
    setFloatingElements(elements);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      {/* Floating Icons */}
      {floatingElements?.map((element) => (
        <div
          key={element?.id}
          className="absolute opacity-20 animate-float"
          style={{
            left: `${element?.left}%`,
            top: `${element?.top}%`,
            animationDelay: `${element?.delay}s`,
            animationDuration: `${element?.duration}s`
          }}
        >
          <Icon 
            name={element?.icon} 
            size={element?.size} 
            className="text-primary/40"
          />
        </div>
      ))}
      {/* Panda Silhouettes */}
      <div className="absolute top-10 right-10 opacity-10 animate-bounce-gentle">
        <div className="w-24 h-24 bg-primary/20 rounded-full relative">
          <div className="absolute top-2 left-4 w-4 h-4 bg-primary/30 rounded-full" />
          <div className="absolute top-2 right-4 w-4 h-4 bg-primary/30 rounded-full" />
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary/40 rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 bg-secondary/20 rounded-full relative">
          <div className="absolute top-1 left-2 w-3 h-3 bg-secondary/30 rounded-full" />
          <div className="absolute top-1 right-2 w-3 h-3 bg-secondary/30 rounded-full" />
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-secondary/40 rounded-full" />
        </div>
      </div>
      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-accent/20 rotate-45 animate-spin-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-primary/10 rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-secondary/15 transform rotate-12 animate-bounce-gentle" style={{ animationDelay: '2s' }} />
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(96, 165, 250, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;