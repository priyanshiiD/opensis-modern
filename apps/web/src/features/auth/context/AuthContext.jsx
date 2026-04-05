import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loginUser } from '../api/authApi.js';
import {
  setToken,
  getToken,
  removeToken,
  isAuthenticated as _isAuthenticated
} from '../storage/tokenStorage.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getToken();
        if (token) {
          // Typically we would fetch the user profile from the server using the token,
          // but for this simplified flow, we'll decode the basic JWT or assume user needs a refresh.
          // Because the requirement states { token, user: {id, name, role} } on login,
          // we might just store user in localStorage or only rely on the token.
          // Let's grab user from localStorage if it exists, or just set derived defaults.
          const storedUser = localStorage.getItem('opensis_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Decoding simple payload if present
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              setUser({ id: payload.id, name: payload.name, role: payload.role });
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        removeToken();
        localStorage.removeItem('opensis_user');
      } finally {
        setIsInitializing(false);
      }
    };
    initializeAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser({ username, password });
      
      const { token, user } = response;
      if (!token) {
        throw new Error('Invalid response: Missing token');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('opensis_user', JSON.stringify(user));
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Optionally call logoutUser() from api here if needed
    removeToken();
    localStorage.removeItem('opensis_user');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    isInitializing,
    error,
    isAuthenticated: !!user && _isAuthenticated(),
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

