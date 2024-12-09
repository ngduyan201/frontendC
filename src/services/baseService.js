import axios from 'axios';

export const createApiInstance = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Bỏ qua refresh token cho API đổi mật khẩu
      if (originalRequest.url.includes('/change-password')) {
        return Promise.reject(error);
      }

      // Xử lý refresh token cho các API khác
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return instance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await instance.post('/auth/refresh-token', {
            refreshToken
          });

          const { token, newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          processQueue(null, token);
          
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          // Chỉ logout khi thực sự cần thiết
          if (refreshError.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}; 