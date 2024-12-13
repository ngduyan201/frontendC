import axios from 'axios';
import { createApiInstance } from './baseService';

const api = createApiInstance();
const API_URL = 'http://localhost:5001';

export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  },
  
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      
      console.log('Login response:', response.data);

      if (response.data.success) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        console.log('Stored tokens:', {
          accessToken: localStorage.getItem('token'),
          refreshToken: localStorage.getItem('refreshToken'),
          user: localStorage.getItem('user')
        });

        return response.data;
      }

      throw new Error(response.data.message || 'Đăng nhập thất bại');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('Pre-logout tokens:', { token, refreshToken });

      if (!token || !refreshToken) {
        localStorage.clear();
        throw new Error('Phiên đăng nhập không hợp lệ');
      }

      try {
        const response = await axios.post(`${API_URL}/api/auth/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Logout response:', response.data);
        localStorage.clear();
        return response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const newToken = await authService.refreshToken();
            const retryResponse = await axios.post(`${API_URL}/api/auth/logout`, null, {
              headers: {
                Authorization: `Bearer ${newToken}`
              }
            });
            localStorage.clear();
            return retryResponse.data;
          } catch (refreshError) {
            localStorage.clear();
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Attempting refresh with token:', refreshToken);

      if (!refreshToken) {
        throw new Error('Không tìm thấy refresh token');
      }

      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken
      });

      console.log('Refresh token response:', response.data);

      if (response.data.success && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data.accessToken;
      }

      throw new Error('Invalid refresh token response');
    } catch (error) {
      console.error('Refresh token error:', error);
      localStorage.clear();
      throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }
  }
}; 