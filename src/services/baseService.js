import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
export const createApiInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:5001/api',
    withCredentials: true,
    timeout: 10000,
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
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              return instance(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await instance.post('/auth/refresh-token');
          isRefreshing = false;
          processQueue(null, response.data.accessToken);
          return instance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          throw refreshError;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}; 