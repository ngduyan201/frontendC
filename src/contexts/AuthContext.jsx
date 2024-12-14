import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Chỉ thực hiện refresh token nếu có user trong localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const response = await authService.refreshToken();
          if (response.success) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Xóa user từ localStorage nếu refresh thất bại
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 