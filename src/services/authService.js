import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor chỉ log thông tin an toàn
axiosInstance.interceptors.request.use(
  (config) => {
    // Log an toàn không có password
    const safeData = { ...config.data };
    if (safeData.password) {
      safeData.password = '[HIDDEN]';
    }
    
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: config.headers,
      data: safeData // Log data đã được sanitize
    });
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    try {
      // Không log credentials
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        status: error.response?.status,
        message: error.message
      });
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export default authService;