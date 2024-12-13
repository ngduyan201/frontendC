import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token && refreshToken) {
          // Thử refresh token khi khởi động
          const newToken = await authService.refreshToken();
          const storedUser = localStorage.getItem('user');

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Lưu token mới
          localStorage.setItem('token', newToken);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    console.log('Login function called with:', {
      userData,
      accessToken,
      refreshToken
    });
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    authError,
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