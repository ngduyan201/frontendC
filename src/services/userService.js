import { createApiInstance } from './baseService';

const api = createApiInstance();

class UserService {
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.post('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Không thể kết nối đến server...');
      }
      throw error;
    }
  }
}

export default new UserService();