const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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
    END_SESSION: '/crosswords/end-session',
    CLEAR_SESSION: '/crosswords/clear-session',
    SAVE_CROSSWORD: '/crosswords/save-crossword',
    GET_USER_CROSSWORDS: '/crosswords/user',
    START_EDIT: '/crosswords/edit',
    GET_LIBRARY: '/crosswords/library',
    START_PLAY: (id) => `/crosswords/play/${id}`,
    GET_SECRET_KEY: '/crosswords/get-secret-key',
    SEARCH: '/crosswords/search',
    CHECK_TITLE: '/crosswords/check-title'
  }
}; 

export { API_BASE_URL }; 