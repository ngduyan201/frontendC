import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Interceptor để tự động refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Cập nhật access token mới
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Thêm token mới vào header và thử lại request
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        // Nếu refresh token cũng hết hạn, chuyển về trang login
        localStorage.removeItem('accessToken');
        window.location.href = '/';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { accessToken, user } = response.data;
      
      if (response.data.success) { // Kiểm tra success
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    try {
      // 1. Gọi API logout để xóa refresh token ở backend
      await axiosInstance.post('/auth/logout', {}, {
        withCredentials: true
      });

      // 2. Xóa access token và user info ở frontend
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // 3. Reset axios instance (optional)
      axiosInstance.defaults.headers.common['Authorization'] = '';

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getAccessToken: () => localStorage.getItem('accessToken'),

  refreshToken: async () => {
    console.log('🔄 Calling refresh token API...');
    try {
      const response = await axiosInstance.post('/auth/refresh-token', {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        console.log('✅ New access token received');
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      console.error('🚫 Refresh token error:', error);
      throw error;
    }
  },

  // Thêm method kiểm tra trạng thái auth
  checkAuthStatus: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm 3 phương thức mới cho quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const response = await axiosInstance.post('/auth/verify-reset-code', { 
        email, 
        code 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;