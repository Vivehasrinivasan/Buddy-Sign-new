import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AuthToggle from './components/AuthToggle';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import AnimatedBackground from './components/AnimatedBackground';
import SuccessAnimation from './components/SuccessAnimation';

const SignInSignUp = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const user = localStorage.getItem('buddysign_user');
    if (user) {
      navigate('/home-dashboard');
    }
  }, [navigate]);

  const handleSignIn = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - check demo credentials
      if (formData?.email === 'parent@buddysign.com' && formData?.password === 'parent123') {
        const userData = {
          id: 1,
          name: 'Sarah Johnson',
          email: 'parent@buddysign.com',
          isParent: true,
          children: [
            {
              id: 1,
              name: 'Emma Johnson',
              age: 8,
              points: 450,
              level: 5,
              lessonsCompleted: 12,
              testsAttended: 8,
              strengths: ['Alphabet', 'Numbers'],
              weaknesses: ['Complex Words']
            }
          ],
          points: 450,
          rememberMe: formData?.rememberMe
        };
        
        localStorage.setItem('buddysign_user', JSON.stringify(userData));
        setSuccessMessage('Welcome back to BuddySign!');
        setShowSuccess(true);
      } else {
        throw new Error('Invalid credentials. Please use: parent@buddysign.com / parent123');
      }
    } catch (error) {
      alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData = {
        id: Date.now(),
        name: formData?.childName,
        email: formData?.parentEmail,
        isParent: true,
        children: [
          {
            id: Date.now(),
            name: formData?.childName,
            age: parseInt(formData?.childAge),
            points: 0,
            level: 1,
            lessonsCompleted: 0,
            testsAttended: 0,
            strengths: [],
            weaknesses: []
          }
        ],
        points: 0,
        isNewUser: true
      };
      
      localStorage.setItem('buddysign_user', JSON.stringify(userData));
      setSuccessMessage(`Welcome to BuddySign, ${formData?.childName}!`);
      setShowSuccess(true);
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    navigate('/home-dashboard');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-soft transform hover:scale-105 transition-transform duration-300">
                <Icon name="Hand" size={32} color="white" />
              </div>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BuddySign
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Learn sign language with your panda friend
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-floating border border-border/50 p-6 animate-slide-up">
            {/* Tab Toggle */}
            <AuthToggle 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="mb-6"
            />

            {/* Forms */}
            <div className="transition-all duration-300">
              {activeTab === 'signin' ? (
                <SignInForm 
                  onSubmit={handleSignIn}
                  isLoading={isLoading}
                  className="animate-fade-in"
                />
              ) : (
                <SignUpForm 
                  onSubmit={handleSignUp}
                  isLoading={isLoading}
                  className="animate-fade-in"
                />
              )}
            </div>

            {/* Footer Links */}
            <div className="text-center mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <button className="hover:text-primary transition-colors focus:outline-none focus:underline">
                  Privacy Policy
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors focus:outline-none focus:underline">
                  Terms of Service
                </button>
                <span>•</span>
                <button className="hover:text-primary transition-colors focus:outline-none focus:underline">
                  Help
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={14} className="text-success" />
                <span>Child Safe</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={14} className="text-primary" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Award" size={14} className="text-accent" />
                <span>Educational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <SuccessAnimation 
        isVisible={showSuccess}
        message={successMessage}
        onComplete={handleSuccessComplete}
      />

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SignInSignUp;