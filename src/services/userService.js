import { createApiInstance } from './baseService';

const api = createApiInstance();

class UserService {
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Lỗi không xác định');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Lỗi không xác định');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.post('/user/change-password', passwordData);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Lỗi không xác định');
      }
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
}

export const userService = new UserService();