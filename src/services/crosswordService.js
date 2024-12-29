import { api } from '../utils/api';
import { API_URLS } from '../config/apiConfig';

export const crosswordService = {
  createCrossword: async (crosswordData) => {
    try {
      console.log('Creating crossword with data:', crosswordData);
      const response = await api.post(API_URLS.CROSSWORDS.CREATE, crosswordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCrossword: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }
      console.log('Fetching crossword:', id);
      const response = await api.get(API_URLS.CROSSWORDS.GET_BY_ID(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAllCrosswords: async () => {
    try {
      console.log('Fetching all crosswords');
      const response = await api.get(API_URLS.CROSSWORDS.GET);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCrossword: async (id, updateData) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }
      console.log('Updating crossword:', id, updateData);
      const response = await api.put(API_URLS.CROSSWORDS.UPDATE(id), updateData);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update crossword error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
      };
    }
  },

  deleteCrossword: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }
      const response = await api.delete(API_URLS.CROSSWORDS.DELETE(id));
      return response;
    } catch (error) {
      console.error('Delete crossword error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa ô chữ'
      };
    }
  },

  // Kiểm tra phiên hiện tại
  getCurrentSession: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET_SESSION);
      return response;
    } catch (error) {
      if (error.status === 404) {
        // Không có phiên hoặc phiên hết hạn
        return { success: false, redirect: true };
      }
      throw error;
    }
  },

  // Lưu và kết thúc phiên
  saveAndEndSession: async (mainKeyword) => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.SAVE_SESSION, { mainKeyword });
      return response;
    } catch (error) {
      throw error;
    }
  },

  autoSave: async (data) => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.AUTO_SAVE, data);
      return response;
    } catch (error) {
      console.error('Auto save error:', error);
      throw error;
    }
  },

  // Thêm method khôi phục phiên
  recoverSession: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.RECOVER_SESSION);
      return response;
    } catch (error) {
      console.error('Session recovery error:', error);
      throw error;
    }
  },

  endSession: async () => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.END_SESSION);
      return response;
    } catch (error) {
      console.error('End session error:', error);
      throw error;
    }
  },

  saveCrossword: async (crosswordData) => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.SAVE_CROSSWORD, crosswordData);
      return response;
    } catch (error) {
      console.error('Save crossword error:', error);
      throw error;
    }
  },

  fetchCrosswords: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET_USER_CROSSWORDS);
      
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response);
        return {
          success: false,
          data: []
        };
      }

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Fetch crosswords error:', error);
      return {
        success: false,
        data: []
      };
    }
  },

  startEditSession: async (crosswordId) => {
    try {
      const response = await api.post(`${API_URLS.CROSSWORDS.START_EDIT}/${crosswordId}`);
      return response;
    } catch (error) {
      console.error('Start edit session error:', error);
      throw error;
    }
  },

  fetchLibraryCrosswords: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET_LIBRARY);
      
      if (!response.success || !response.data) {
        console.error('Invalid library response format:', response);
        return {
          success: false,
          data: {
            random: [],
            mostPlayed: [],
            newest: []
          }
        };
      }

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Fetch library crosswords error:', error);
      return {
        success: false,
        data: {
          random: [],
          mostPlayed: [],
          newest: []
        }
      };
    }
  },

  startSinglePlay: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }

      const response = await api.post(API_URLS.CROSSWORDS.START_PLAY(id), {
        mode: 'single'
      });
      
      console.log('Response từ API startPlay:', response);

      if (response.success) {
        localStorage.setItem('crosswordPlayData', JSON.stringify({
          success: response.success,
          data: response.data,
          timestamp: new Date().getTime()
        }));
      }

      return response;
    } catch (error) {
      console.error('Start single play error:', error);
      throw error;
    }
  },

  // Thêm method mới để kiểm tra play session
  getCurrentPlaySession: () => {
    try {
      const cookies = document.cookie.split(';');
      const playSession = cookies.find(cookie => cookie.trim().startsWith('playSession='));
      
      if (!playSession) {
        return { success: false };
      }

      // Parse cookie value
      const sessionData = JSON.parse(playSession.split('=')[1]);
      return { 
        success: true,
        data: sessionData
      };
    } catch (error) {
      console.error('Get play session error:', error);
      return { success: false };
    }
  },

  // Thêm method mới
  clearPlaySession: async () => {
    try {
      // Gọi API để xóa session
      const response = await api.post(API_URLS.CROSSWORDS.CLEAR_SESSION);
      
      // Xóa dữ liệu từ localStorage
      localStorage.removeItem('crosswordPlayData');
      
      return response;
    } catch (error) {
      console.error('Clear play session error:', error);
      throw error;
    }
  },

  getSecretKey: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET_SECRET_KEY);
      if (!response.success) {
        throw new Error('Không thể lấy secret key');
      }
      return response.data.secretKey;
    } catch (error) {
      console.error('Get secret key error:', error);
      throw error;
    }
  },

  searchCrosswords: async (params) => {
    try {
      const queryString = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 9,
        query: params.query || '',
        subject: params.subject || '',
        grade: params.grade || ''
      }).toString();

      const response = await api.get(`${API_URLS.CROSSWORDS.SEARCH}?${queryString}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Có lỗi xảy ra khi tìm kiếm');
      }

      return {
        success: true,
        data: {
          crosswords: response.data.crosswords,
          totalPages: response.data.totalPages,
          totalResults: response.data.totalResults
        }
      };

    } catch (error) {
      console.error('Search crosswords error:', error);
      return {
        success: false,
        message: error.message || 'Có lỗi xảy ra khi tìm kiếm',
        data: {
          crosswords: [],
          totalPages: 0,
          totalResults: 0
        }
      };
    }
  },

  checkDuplicateTitle: async (title) => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.CHECK_TITLE, { title });
      return response;
    } catch (error) {
      console.error('Check duplicate title error:', error);
      throw error;
    }
  },

  markAsCompleted: async () => {
    try {
      const response = await api.post(API_URLS.CROSSWORDS.COMPLETE);
      
      if (!response.success) {
        throw new Error(response.message || 'Có lỗi xảy ra khi đánh dấu hoàn thành');
      }

      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      console.error('Mark as completed error:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Có lỗi xảy ra'
      };
    }
  }
};

