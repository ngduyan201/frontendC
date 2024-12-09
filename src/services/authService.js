import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    return response.data;
  }
}; 