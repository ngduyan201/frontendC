import { api } from '../utils/api';
import { API_URLS } from '../config/apiConfig';

export const crosswordService = {
  createCrossword: async (crosswordData) => {
    try {
      console.log('Creating crossword with data:', crosswordData);
      const response = await api.post(API_URLS.CROSSWORDS.CREATE, crosswordData);
      
      if (!response.success) {
        throw new Error(response.message || 'Tạo ô chữ thất bại');
      }
      
      console.log('Crossword created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Create crossword error:', error);
      throw error.response?.data || { 
        success: false,
        message: 'Có lỗi xảy ra khi tạo ô chữ' 
      };
    }
  },

  getCrossword: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }

      console.log('Fetching crossword:', id);
      const response = await api.get(API_URLS.CROSSWORDS.GET_BY_ID(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Không tìm thấy ô chữ');
      }

      return response;
    } catch (error) {
      console.error('Get crossword error:', error);
      throw error.response?.data || { 
        success: false,
        message: 'Có lỗi xảy ra khi lấy thông tin ô chữ' 
      };
    }
  },

  getAllCrosswords: async () => {
    try {
      console.log('Fetching all crosswords');
      const response = await api.get(API_URLS.CROSSWORDS.GET);
      
      if (!response.success) {
        throw new Error(response.message || 'Không thể lấy danh sách ô chữ');
      }

      return response;
    } catch (error) {
      console.error('Get all crosswords error:', error);
      throw error.response?.data || { 
        success: false,
        message: 'Có lỗi xảy ra khi lấy danh sách ô chữ' 
      };
    }
  },

  updateCrossword: async (id, updateData) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }

      console.log('Updating crossword:', id, updateData);
      const response = await api.put(API_URLS.CROSSWORDS.UPDATE(id), updateData);
      
      if (!response.success) {
        throw new Error(response.message || 'Cập nhật ô chữ thất bại');
      }

      return response;
    } catch (error) {
      console.error('Update crossword error:', error);
      throw error.response?.data || { 
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật ô chữ' 
      };
    }
  },

  deleteCrossword: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }

      console.log('Deleting crossword:', id);
      const response = await api.delete(API_URLS.CROSSWORDS.DELETE(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Xóa ô chữ thất bại');
      }

      return response;
    } catch (error) {
      console.error('Delete crossword error:', error);
      throw error.response?.data || { 
        success: false,
        message: 'Có lỗi xảy ra khi xóa ô chữ' 
      };
    }
  }
};

