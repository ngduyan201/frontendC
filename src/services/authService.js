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
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Thử gọi API logout
          await axios.post(`${API_URL}/api/auth/logout`, null, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          // Log lỗi nhưng không throw
          console.log('Logout API notice:', {
            status: error.response?.status,
            message: error.response?.data?.message
          });
        }
      }

      // Luôn xóa local data
      localStorage.clear();
      return { success: true };
      
    } catch (error) {
      // Log lỗi và vẫn xóa local data
      console.error('Logout error:', error);
      localStorage.clear();
      return { success: true };
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken: refreshToken
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.token;
      }
      throw new Error(response.data.message || 'Failed to refresh token');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }
}; 