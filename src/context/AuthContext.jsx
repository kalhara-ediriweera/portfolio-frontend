import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on page mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const profileData = await api.auth.getProfile();
          if (profileData.success) {
            setIsAuthenticated(true);
            setUser(profileData.user);
          } else {
            // Invalid token
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.auth.login(username, password);
      if (response.success && response.token) {
        localStorage.setItem('adminToken', response.token);
        setIsAuthenticated(true);
        setUser(response.user);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, error: 'Login failed' };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
