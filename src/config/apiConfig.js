const API_BASE_URL = 'http://localhost:5001/api';

export const API_URLS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile/update`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  }
}; 