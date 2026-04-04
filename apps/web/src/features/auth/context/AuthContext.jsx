import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginRequest, logoutRequest } from '../api/authApi.js';
import {
  setAuthTokens,
  getAccessToken,
  getRefreshToken,
  clearAuthTokens,
  isAuthenticated
} from '../storage/tokenStorage.js';

// Create the authentication context
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Provides authentication state and functions throughout the app.
 * Handles:
 * - User state management
 * - Login/logout operations
 * - JWT token storage and retrieval
 * - Auto-login on page refresh
 * - Loading and error states
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount (check if token exists)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = getAccessToken();
        if (accessToken) {
          // Parse JWT to get user info (basic parsing, doesn't verify signature)
          // In production, you might want to validate the token with the backend
          const parts = accessToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            setUser({
              userId: payload.userId,
              username: payload.username,
              role: payload.role,
              profileId: payload.profileId,
              permissions: payload.permissions
            });
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        clearAuthTokens();
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * Calls the login API and stores tokens
   */
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginRequest(username, password);

      // Extract tokens from response
      const { accessToken, refreshToken, user } = response;

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid response: Missing authentication tokens');
      }

      // Store tokens
      setAuthTokens(accessToken, refreshToken);

      // Set user state - handle flexible user object format
      const userData = {
        userId: user?.userId || user?._id,
        username: user?.username || 'User',
        role: user?.role || 'user',
        profileId: user?.profileId || user?.profile_id,
        permissions: user?.permissions || []
      };

      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears tokens and user state
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // Call logout endpoint if tokens exist
      if (accessToken || refreshToken) {
        try {
          await logoutRequest(accessToken, refreshToken);
        } catch (err) {
          // Log error but continue with local logout
          console.error('Error logging out on server:', err);
        }
      }

      // Clear local state
      clearAuthTokens();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if server logout fails
      clearAuthTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    isInitializing,
    error,
    isAuthenticated: !!user && isAuthenticated(),
    login,
    logout,
    clearError,
    // Exposed for debugging/testing
    getAccessToken,
    getRefreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the AuthContext
 * Must be used inside AuthProvider
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
