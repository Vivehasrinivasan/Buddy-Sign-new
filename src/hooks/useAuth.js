// Custom Auth Hook for BuddySign
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

// Main useAuth hook (re-export from context for convenience)
export { useAuth } from '../context/AuthContext';

// Enhanced auth hook with additional utilities
export const useAuthState = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }

  return {
    ...auth,
    // Additional computed properties
    hasChildren: auth.currentUser?.childrenCount > 0,
    isPremium: auth.currentUser?.subscription?.type !== 'free',
    userName: auth.currentUser?.displayName || 'User',
    userInitials: auth.currentUser?.displayName 
      ? auth.currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : auth.currentUser?.email?.[0]?.toUpperCase() || '?'
  };
};

// Hook for authentication with navigation
export const useAuthWithNavigation = () => {
  const auth = useAuthState();
  const navigate = useNavigate();

  const signupAndRedirect = async (email, password, additionalData = {}) => {
    try {
      const result = await auth.signup(email, password, additionalData);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loginAndRedirect = async (email, password) => {
    try {
      const result = await auth.login(email, password);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogleAndRedirect = async () => {
    try {
      const result = await auth.loginWithGoogle();
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logoutAndRedirect = async () => {
    try {
      const result = await auth.logout();
      if (result.success) {
        navigate('/signin', { replace: true });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...auth,
    signupAndRedirect,
    loginAndRedirect,
    loginWithGoogleAndRedirect,
    logoutAndRedirect
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectTo = '/signin') => {
  const { currentUser, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, loading, navigate, redirectTo]);

  return { currentUser, loading, isAuthenticated: !!currentUser };
};

// Hook for guest-only routes (redirect authenticated users)
export const useRequireGuest = (redirectTo = '/dashboard') => {
  const { currentUser, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, loading, navigate, redirectTo]);

  return { currentUser, loading, isGuest: !currentUser };
};

// Hook for form handling with auth
export const useAuthForm = () => {
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuthState();

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateField = (name, value, rules = {}) => {
    let error = null;

    if (rules.required && (!value || value.trim() === '')) {
      error = `${name} is required`;
    } else if (rules.email && value && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Please enter a valid email address';
    } else if (rules.minLength && value && value.length < rules.minLength) {
      error = `${name} must be at least ${rules.minLength} characters`;
    } else if (rules.pattern && value && !rules.pattern.test(value)) {
      error = rules.message || `${name} format is invalid`;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const resetForm = () => {
    setFormData({});
    setFieldErrors({});
    setIsSubmitting(false);
    auth.clearError();
  };

  return {
    formData,
    fieldErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateField,
    resetForm,
    authError: auth.error,
    clearAuthError: auth.clearError
  };
};

// Hook for email verification status
export const useEmailVerification = () => {
  const { currentUser } = useAuthState();
  const [verificationSent, setVerificationSent] = useState(false);

  const sendVerificationEmail = async () => {
    try {
      if (currentUser && !currentUser.emailVerified) {
        // This would need to be implemented in authService
        // await sendEmailVerification(auth.currentUser);
        setVerificationSent(true);
        return { success: true, message: 'Verification email sent!' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return {
    isEmailVerified: currentUser?.emailVerified || false,
    verificationSent,
    sendVerificationEmail
  };
};

// Hook for subscription status and features
export const useSubscription = () => {
  const { currentUser } = useAuthState();
  
  const subscription = currentUser?.subscription || { type: 'free', features: [] };
  
  const hasFeature = (featureName) => {
    return subscription.features?.includes(featureName) || false;
  };

  const canAccessPremiumContent = () => {
    return subscription.type !== 'free';
  };

  const remainingDays = () => {
    if (!subscription.endDate || subscription.type === 'free') return null;
    
    const endDate = subscription.endDate.toDate ? subscription.endDate.toDate() : new Date(subscription.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    isPremium: subscription.type !== 'free',
    hasFeature,
    canAccessPremiumContent,
    remainingDays: remainingDays()
  };
};

// Hook for managing loading states
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const withLoading = async (asyncOperation) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncOperation();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    withLoading,
    clearError,
    setLoading,
    setError
  };
};

/*
USAGE EXAMPLES:

1. In a component that needs authentication:
   import { useRequireAuth } from '../hooks/useAuth';
   
   function Dashboard() {
     const { currentUser, loading } = useRequireAuth();
     
     if (loading) return <div>Loading...</div>;
     
     return <div>Welcome, {currentUser.displayName}!</div>;
   }

2. In Sign-In component with navigation:
   import { useAuthWithNavigation } from '../hooks/useAuth';
   
   function SignInPage() {
     const { loginAndRedirect, error, loading } = useAuthWithNavigation();
     
     const handleSubmit = (email, password) => {
       loginAndRedirect(email, password);
     };
     
     return (
       // Your sign-in form
     );
   }

3. In a form component:
   import { useAuthForm } from '../hooks/useAuth';
   
   function SignUpForm() {
     const {
       formData,
       updateField,
       validateField,
       fieldErrors,
       authError,
       isSubmitting,
       setIsSubmitting
     } = useAuthForm();
     
     const handleChange = (e) => {
       const { name, value } = e.target;
       updateField(name, value);
     };
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsSubmitting(true);
       
       // Validate all fields
       const emailValid = validateField('email', formData.email, { required: true, email: true });
       const passwordValid = validateField('password', formData.password, { required: true, minLength: 6 });
       
       if (emailValid && passwordValid) {
         // Submit form
       }
       
       setIsSubmitting(false);
     };
     
     return (
       <form onSubmit={handleSubmit}>
         {authError && <div className="error">{authError}</div>}
         <input 
           name="email"
           type="email"
           value={formData.email || ''}
           onChange={handleChange}
         />
         {fieldErrors.email && <span className="error">{fieldErrors.email}</span>}
       </form>
     );
   }

4. Check subscription features:
   import { useSubscription } from '../hooks/useAuth';
   
   function PremiumContent() {
     const { hasFeature, isPremium } = useSubscription();
     
     if (!hasFeature('advanced_lessons')) {
       return <div>Upgrade to access this content</div>;
     }
     
     return <div>Premium lesson content</div>;
   }
*/