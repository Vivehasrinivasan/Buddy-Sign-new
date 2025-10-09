/**
 * Authentication Context for BuddySign - Flask Backend Integration
 * Provides authentication state management using JWT tokens
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext({
  // Auth state
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  
  // Auth methods
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  verifyToken: async () => {},
  clearError: () => {},
  refreshUser: async () => {}
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      setError(null);
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
      }

      try {
        const profile = await authService.getProfile();
        if (profile) {
          setCurrentUser(profile);
          setIsAuthenticated(true);
          authService.verificationResult = true;
          authService.lastVerification = Date.now();
          setError(null);
          return;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        const message = error?.message?.toLowerCase?.() || '';
        if (message.includes('expired')) {
          setError('Your session has ended. Please sign in again.');
        } else if (message.includes('authorization token required')) {
          setError('Please sign in to continue.');
        }
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign up with email and password
  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.signup(formData);
      
      if (result.success) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        return result;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(formData);
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on backend, clear local state
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Verify token validity
  const verifyToken = async (options = {}) => {
    try {
      const isValid = await authService.verifyToken(options);
      
      if (isValid) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setError('Your session has ended. Please sign in again.');
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError('Unable to verify your session. Please sign in again.');
      return false;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return null;
      
      const user = await authService.getProfile();
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails due to invalid token, logout
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        await logout();
      }
      throw error;
    }
  };

  // Clear error message
  const clearError = () => setError(null);

  // Context value
  const value = {
    // State
    currentUser,
    isAuthenticated,
    loading,
    error,
    
    // Methods
    signup,
    login,
    logout,
    verifyToken,
    refreshUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;