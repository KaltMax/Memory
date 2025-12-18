import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          const userData = await authService.verifyToken(storedToken);
          setUser(userData.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          console.log('Token verification failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    try {
      const data = await authService.register(username, email, password);

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', data.token);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
