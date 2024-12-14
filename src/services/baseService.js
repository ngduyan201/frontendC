import axios from 'axios';

export const createApiInstance = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
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

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        isRefreshing = true;

        try {
          const response = await instance.post('/auth/refresh-token');
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          window.location.href = '/login';
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