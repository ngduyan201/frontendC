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
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCrossword: async (id) => {
    try {
      if (!id) {
        throw new Error('ID ô chữ không được để trống');
      }
      console.log('Deleting crossword:', id);
      const response = await api.delete(API_URLS.CROSSWORDS.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  }
};

