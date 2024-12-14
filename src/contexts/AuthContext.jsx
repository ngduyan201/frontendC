import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm kiểm tra và refresh token
  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        // Gọi API để verify và refresh token
        const response = await authService.refreshToken();
        
        if (response.success) {
          // Cập nhật access token mới
          localStorage.setItem('accessToken', response.accessToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Nếu refresh thất bại, xóa thông tin cũ
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Chạy kiểm tra khi component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
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