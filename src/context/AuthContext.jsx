// Authentication Context for BuddySign
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  updateParentProfile,
  getCurrentUser
} from '../services/authService';

// Create Auth Context
const AuthContext = createContext({
  // Auth state
  currentUser: null,
  loading: true,
  error: null,
  
  // Auth methods
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  clearError: () => {}
});

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error message
  const clearError = () => setError(null);

  // Sign up with email and password
  const signup = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signUpWithEmail(email, password, additionalData);
      
      // Note: currentUser will be updated by onAuthStateChanged listener
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signInWithEmail(email, password);
      
      // Note: currentUser will be updated by onAuthStateChanged listener
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signInWithGoogle();
      
      // Note: currentUser will be updated by onAuthStateChanged listener
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await signOutUser();
      setCurrentUser(null);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPasswordHandler = async (email) => {
    try {
      setError(null);
      return await resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setError(null);
      
      if (!currentUser?.uid) {
        throw new Error('No user is currently signed in');
      }

      const result = await updateParentProfile(currentUser.uid, updates);
      
      // Update local user state
      setCurrentUser(prev => ({
        ...prev,
        ...updates,
        updatedAt: new Date()
      }));
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, get full user data from Firestore
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Failed to load user data');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    // State
    currentUser,
    loading,
    error,
    
    // Methods
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword: resetPasswordHandler,
    updateProfile,
    clearError,
    
    // Utility getters
    get isAuthenticated() {
      return !!currentUser;
    },
    
    get isEmailVerified() {
      return currentUser?.emailVerified || false;
    },
    
    get userDisplayName() {
      return currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// HOC for components that require authentication
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { currentUser, loading } = useAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (!currentUser) {
      // Redirect to sign-in page or show sign-in component
      return <div>Please sign in to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Hook for components that need loading state
export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};

export default AuthContext;

/*
USAGE EXAMPLES:

1. Wrap your App component with AuthProvider:
   import { AuthProvider } from './context/AuthContext';
   
   function App() {
     return (
       <AuthProvider>
         <Router>
           <Routes>
             // Your routes here
           </Routes>
         </Router>
       </AuthProvider>
     );
   }

2. Use in any component:
   import { useAuth } from '../context/AuthContext';
   
   function Dashboard() {
     const { currentUser, logout, isAuthenticated } = useAuth();
     
     if (!isAuthenticated) {
       return <Navigate to="/signin" />;
     }
     
     return (
       <div>
         <h1>Welcome, {currentUser.displayName}!</h1>
         <button onClick={logout}>Sign Out</button>
       </div>
     );
   }

3. Protected Route component:
   import { useAuth } from '../context/AuthContext';
   import { Navigate } from 'react-router-dom';
   
   function ProtectedRoute({ children }) {
     const { currentUser, loading } = useAuth();
     
     if (loading) return <div>Loading...</div>;
     
     return currentUser ? children : <Navigate to="/signin" />;
   }

4. Sign-in form example:
   import { useAuth } from '../context/AuthContext';
   
   function SignInForm() {
     const { login, loginWithGoogle, error, loading } = useAuth();
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await login(email, password);
         // Redirect to dashboard
       } catch (error) {
         // Error is handled by context
       }
     };
     
     return (
       <form onSubmit={handleSubmit}>
         {error && <div className="error">{error}</div>}
         <input 
           type="email" 
           value={email} 
           onChange={(e) => setEmail(e.target.value)} 
           required 
         />
         <input 
           type="password" 
           value={password} 
           onChange={(e) => setPassword(e.target.value)} 
           required 
         />
         <button type="submit" disabled={loading}>
           {loading ? 'Signing In...' : 'Sign In'}
         </button>
         <button type="button" onClick={loginWithGoogle}>
           Sign In with Google
         </button>
       </form>
     );
   }
*/