const API_BASE_URL = 'http://localhost:5001/api';

export const API_URLS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },

  CROSSWORDS: {
    CREATE: '/crosswords',
    GET: '/crosswords',
    GET_BY_ID: (id) => `/crosswords/${id}`,
    UPDATE: (id) => `/crosswords/${id}`,
    DELETE: (id) => `/crosswords/${id}`,
    GET_SESSION: '/crosswords/session',
    SAVE_SESSION: '/crosswords/save',
    END_SESSION: '/crosswords/end-session'
  }
}; 

export { API_BASE_URL }; 