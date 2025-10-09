import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AuthToggle from './components/AuthToggle';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import AnimatedBackground from './components/AnimatedBackground';
import SuccessAnimation from './components/SuccessAnimation';
import authService from '../../services/authService';
import { useAuth } from '../../context/FlaskAuthContext';

const SignInSignUp = ({ initialTab = 'signin' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successSubtitle, setSuccessSubtitle] = useState('');
  const [successAction, setSuccessAction] = useState('login');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { login: loginUser, verifyToken: verifySession } = useAuth();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (hasCheckedSession.current) {
      return;
    }

    hasCheckedSession.current = true;

    const checkAuth = async () => {
      if (!authService.isAuthenticated()) return;

      try {
        const isValid = await verifySession({ force: true });
        if (isValid) {
          navigate('/home-dashboard', { replace: true });
        }
      } catch {
        // ignore errors; verifySession already handles state cleanup
      }
    };

    checkAuth();
  }, [navigate, verifySession]);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('signin');
    }
  }, [location.pathname]);

  const handleSignIn = async (formData) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
  const result = await loginUser(formData);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setShowSuccess(true);
        setSuccessSubtitle('Redirecting you to your BuddySign dashboard...');
        setSuccessAction('login');
        setAuthError('');
      }
    } catch (error) {
      setAuthError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const result = await authService.signup(formData);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Account created successfully.');
        setSuccessSubtitle('Redirecting you to the sign-in page...');
        setSuccessAction('signup');
        setShowSuccess(true);
        setAuthError('');
      }
    } catch (error) {
      setAuthError(error?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setAuthError('');

    if (successAction === 'signup') {
      setActiveTab('signin');
      navigate('/login', { replace: true });
    } else {
      navigate('/home-dashboard', { replace: true });
    }

    setSuccessAction('login');
    setSuccessSubtitle('');
  };

  const handleTabChange = (tab) => {
    setAuthError('');
    setActiveTab(tab);

    const nextPath = tab === 'signup' ? '/signup' : '/login';
    if (location.pathname !== nextPath) {
      navigate(nextPath, { replace: true });
    }
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
              onTabChange={handleTabChange}
              className="mb-6"
            />

            {/* Forms */}
            <div className="transition-all duration-300">
              {authError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
                  {authError}
                </div>
              )}
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
        subtitle={successSubtitle}
        onComplete={handleSuccessComplete}
      />

      {/* Custom Styles */}
      <style>{`
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