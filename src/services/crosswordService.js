import { api } from '../utils/api';
import { API_URLS } from '../config/apiConfig';

export const crosswordService = {
  createCrossword: async (crosswordData) => {
    try {
      const url = API_URLS.CROSSWORDS.CREATE;
      console.log('Service URL:', url);
      
      const response = await api.post(url, crosswordData);
      return response;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  },

  getCrossword: async (id) => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET_BY_ID(id));
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi lấy thông tin ô chữ' };
    }
  },

  getAllCrosswords: async () => {
    try {
      const response = await api.get(API_URLS.CROSSWORDS.GET);
      return response;
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi lấy danh sách ô chữ' };
    }
  }
};

