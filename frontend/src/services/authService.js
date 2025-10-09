/**
 * Authentication Service for BuddySign React Frontend
 * Connects to Flask backend API for JWT authentication
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';
const DEFAULT_VERIFY_TTL_MINUTES = Number(import.meta.env?.VITE_AUTH_VERIFICATION_TTL_MINUTES ?? 5);
const VERIFICATION_TTL_MS = Math.max(1, DEFAULT_VERIFY_TTL_MINUTES) * 60 * 1000;

class AuthService {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('buddysign_user') || 'null');
    this.lastVerification = 0;
    this.verificationResult = false;
    this.verifyTtlMs = VERIFICATION_TTL_MS;
  }

  clearSession() {
    this.user = null;
    this.verificationResult = false;
    this.lastVerification = 0;
    localStorage.removeItem('buddysign_user');
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(url, options = {}) {
    const { headers = {}, ...rest } = options;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include',
      ...rest,
    };

    delete config.headers.Authorization;

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.error === 'token_expired') {
        this.clearSession();
        throw new Error('Session expired. Please log in again.');
      }

      if (response.status === 401 || response.status === 403) {
        this.clearSession();
      }

      return { response, data };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * User signup
   */
  async signup(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          parentEmail: formData.parentEmail,
          password: formData.password,
          childName: formData.childName,
          childAge: formData.childAge,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.clearSession();
        return {
          success: true,
          message: data.message,
          userId: data?.data?.user_id || null,
          email: data?.data?.email || formData?.parentEmail,
        };
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * User login
   */
  async login(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe || false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.user = data.data.user;
        localStorage.setItem('buddysign_user', JSON.stringify(this.user));
        this.verificationResult = true;
        this.lastVerification = Date.now();

        return {
          success: true,
          message: data.message,
          user: this.user,
        };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Verify current token
   */
  async verifyToken(options = {}) {
    const { force = false } = options;
    const now = Date.now();

    if (!force && this.lastVerification && now - this.lastVerification < this.verifyTtlMs) {
      return this.verificationResult;
    }

    try {
      const { response, data } = await this.apiRequest('/auth/verify-token', {
        method: 'POST',
      });

      if (response.ok && data.success) {
        this.user = data.data.user;
        localStorage.setItem('buddysign_user', JSON.stringify(this.user));
        this.verificationResult = true;
      } else {
        this.clearSession();
        this.verificationResult = false;
      }
    } catch (error) {
      this.clearSession();
      this.verificationResult = false;
    } finally {
      this.lastVerification = Date.now();
    }

    return this.verificationResult;
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const { response, data } = await this.apiRequest('/profile', {
        method: 'GET',
      });

      if (response.ok && data.success) {
        this.user = data.data;
        localStorage.setItem('buddysign_user', JSON.stringify(this.user));
        this.verificationResult = true;
        this.lastVerification = Date.now();
        return this.user;
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.user;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check backend health
   */
  async checkHealth() {
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();

export default authService;

// Named exports for backward compatibility
export const {
  signup,
  login,
  logout,
  verifyToken,
  getProfile,
  isAuthenticated,
  getCurrentUser,
  checkHealth,
} = authService;
