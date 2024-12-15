import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Hàm kiểm tra và refresh token
  const checkAuth = async () => {
    console.log('🔄 Checking authentication state...');
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        console.log('📍 Found stored user, attempting to refresh token...');
        const response = await authService.refreshToken();
        
        if (response.success) {
          console.log('✅ Token refresh successful');
          localStorage.setItem('accessToken', response.accessToken);
          setUser(JSON.parse(storedUser));
        } else {
          console.log('❌ Token refresh failed');
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      } else {
        console.log('ℹ️ No stored user found');
      }
    } catch (error) {
      console.error('🚫 Auth check failed:', error);
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

  const login = async (userData) => {
    try {
      setIsLoginLoading(true);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Đăng nhập thành công!', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsLoginLoading(false);
    }
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

  // Thêm hàm fetchUserProfile để lấy thông tin chi tiết user
  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser: user,
      user,
      login, 
      logout, 
      isLoading,
      isLoginLoading,
      fetchUserProfile
    }}>
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