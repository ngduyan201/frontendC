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
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  getAccessToken: () => localStorage.getItem('accessToken')
};

export default authService;