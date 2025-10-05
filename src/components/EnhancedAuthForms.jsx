// Example integration of authentication with existing Sign-In/Sign-Up component
import React, { useState, useEffect } from 'react';
import { useAuthWithNavigation, useAuthForm } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

// Enhanced Sign-In Form with Firebase Auth
export const EnhancedSignInForm = ({ onToggleMode }) => {
  const { 
    loginAndRedirect, 
    loginWithGoogleAndRedirect, 
    resetPassword,
    error, 
    loading 
  } = useAuthWithNavigation();

  const {
    formData,
    updateField,
    validateField,
    fieldErrors,
    clearAuthError
  } = useAuthForm();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    // Validate fields
    const emailValid = validateField('email', formData.email, { 
      required: true, 
      email: true 
    });
    const passwordValid = validateField('password', formData.password, { 
      required: true, 
      minLength: 6 
    });

    if (!emailValid || !passwordValid) return;

    try {
      await loginAndRedirect(formData.email, formData.password);
    } catch (err) {
      // Error is handled by the auth context
      console.error('Sign in failed:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearAuthError();
      await loginWithGoogleAndRedirect();
    } catch (err) {
      console.error('Google sign in failed:', err);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const emailValid = validateField('email', formData.email, { 
      required: true, 
      email: true 
    });

    if (!emailValid) return;

    try {
      await resetPassword(formData.email);
      setResetEmailSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmailSent(false);
      }, 3000);
    } catch (err) {
      console.error('Password reset failed:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">
          Sign in to continue your BuddySign journey
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message for Password Reset */}
      {resetEmailSent && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-success">
              Password reset email sent! Check your inbox.
            </span>
          </div>
        </div>
      )}

      {!showForgotPassword ? (
        <>
          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email || ''}
                onChange={handleInputChange}
                className={fieldErrors.email ? 'border-destructive' : ''}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password || ''}
                onChange={handleInputChange}
                className={fieldErrors.password ? 'border-destructive' : ''}
                disabled={loading}
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mb-4"
          >
            <Icon name="Chrome" size={16} className="mr-2" />
            Continue with Google
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              Forgot your password?
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary font-medium hover:underline"
                disabled={loading}
              >
                Sign up for free
              </button>
            </p>
          </div>
        </>
      ) : (
        /* Forgot Password Form */
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className={fieldErrors.email ? 'border-destructive' : ''}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              ← Back to sign in
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Enhanced Sign-Up Form with Firebase Auth
export const EnhancedSignUpForm = ({ onToggleMode }) => {
  const { 
    signupAndRedirect, 
    loginWithGoogleAndRedirect,
    error, 
    loading 
  } = useAuthWithNavigation();

  const {
    formData,
    updateField,
    validateField,
    fieldErrors,
    clearAuthError
  } = useAuthForm();

  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    // Validate all fields
    const nameValid = validateField('name', formData.name, { 
      required: true, 
      minLength: 2 
    });
    const emailValid = validateField('email', formData.email, { 
      required: true, 
      email: true 
    });
    const passwordValid = validateField('password', formData.password, { 
      required: true, 
      minLength: 6 
    });

    if (!nameValid || !emailValid || !passwordValid) return;

    if (!acceptTerms) {
      // You could set a custom error here
      return;
    }

    try {
      await signupAndRedirect(formData.email, formData.password, {
        name: formData.name
      });
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      clearAuthError();
      await loginWithGoogleAndRedirect();
    } catch (err) {
      console.error('Google sign up failed:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Join BuddySign!
        </h1>
        <p className="text-muted-foreground">
          Create your account to start your child's learning journey
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className={fieldErrors.name ? 'border-destructive' : ''}
            disabled={loading}
          />
          {fieldErrors.name && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className={fieldErrors.email ? 'border-destructive' : ''}
            disabled={loading}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <Input
            name="password"
            type="password"
            placeholder="Create a password (min. 6 characters)"
            value={formData.password || ''}
            onChange={handleInputChange}
            className={fieldErrors.password ? 'border-destructive' : ''}
            disabled={loading}
          />
          {fieldErrors.password && (
            <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 py-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1"
            disabled={loading}
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={loading || !acceptTerms}
          className="mt-6"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Sign Up */}
      <Button
        variant="outline"
        fullWidth
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="mb-4"
      >
        <Icon name="Chrome" size={16} className="mr-2" />
        Continue with Google
      </Button>

      {/* Sign In Link */}
      <div className="text-center mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-primary font-medium hover:underline"
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default { EnhancedSignInForm, EnhancedSignUpForm };

/*
INTEGRATION INSTRUCTIONS:

1. Replace your existing SignInForm and SignUpForm components with these enhanced versions
2. Update your main Sign-In/Sign-Up page to use these components:

import { EnhancedSignInForm, EnhancedSignUpForm } from './components/EnhancedAuthForms';

function SignInSignUpPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6">
        {isSignIn ? (
          <EnhancedSignInForm onToggleMode={() => setIsSignIn(false)} />
        ) : (
          <EnhancedSignUpForm onToggleMode={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
}

3. Wrap your App with AuthProvider in main App.jsx:

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        // Your routes here
      </Router>
    </AuthProvider>
  );
}
*/