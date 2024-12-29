import { api } from '../utils/api';
import { API_URLS } from '../config/apiConfig';

const VALID_OCCUPATIONS = ['Giáo viên', 'Học sinh', 'Sinh viên', 'Khác'];

// Constants cho validation
const VALIDATION_RULES = {
  MAX_FULLNAME_LENGTH: 50,
  MIN_FULLNAME_LENGTH: 2,
  PHONE_REGEX: /^\d{10,15}$/
};

class UserService {
  async getProfile() {
    try {
      const response = await api.get(API_URLS.USER.PROFILE);
      // Đảm bảo response.data có dữ liệu
      if (!response?.data) {
        return {
          success: false,
          message: 'Không nhận được dữ liệu từ server'
        };
      }

      const profileData = response.data;
      
      // Đảm bảo occupation hợp lệ
      if (profileData.occupation && !VALID_OCCUPATIONS.includes(profileData.occupation)) {
        profileData.occupation = '';
      }

      return {
        success: true,
        data: profileData
      };
    } catch (error) {
      // Xử lý lỗi từ interceptor của baseService
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Phiên đăng nhập đã hết hạn'
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Không thể kết nối đến server...'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin người dùng'
      };
    }
  }

  async updateProfile(profileData) {
    // Validate fullName
    if (!profileData.fullName?.trim()) {
      return {
        success: false,
        message: 'Vui lòng nhập họ và tên'
      };
    }

    const fullName = profileData.fullName.trim();
    if (fullName.length > VALIDATION_RULES.MAX_FULLNAME_LENGTH) {
      return {
        success: false,
        message: `Họ và tên không được dài quá ${VALIDATION_RULES.MAX_FULLNAME_LENGTH} ký tự`
      };
    }

    if (fullName.length < VALIDATION_RULES.MIN_FULLNAME_LENGTH) {
      return {
        success: false,
        message: `Họ và tên phải có ít nhất ${VALIDATION_RULES.MIN_FULLNAME_LENGTH} ký tự`
      };
    }

    // Validate birthDate
    if (profileData.birthDate) {
      const birthDate = new Date(profileData.birthDate);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        return {
          success: false,
          message: 'Ngày sinh không hợp lệ'
        };
      }
    }

    // Validate occupation
    if (!profileData.occupation || !VALID_OCCUPATIONS.includes(profileData.occupation)) {
      return {
        success: false,
        message: 'Vui lòng chọn nghề nghiệp'
      };
    }

    // Validate phone
    if (profileData.phone) {
      if (!VALIDATION_RULES.PHONE_REGEX.test(profileData.phone)) {
        return {
          success: false,
          message: 'Số điện thoại không hợp lệ (chỉ chứa từ 10-15 chữ số)'
        };
      }
    }

    // Format dữ liệu
    const formattedData = {
      fullName: fullName,
      birthDate: profileData.birthDate || null,
      occupation: profileData.occupation,
      phone: profileData.phone?.trim() || null
    };

    // Gọi API
    try {
      const response = await api.put(API_URLS.USER.UPDATE_PROFILE, formattedData);
      // Kiểm tra response
      if (!response?.data) {
        return {
          success: false,
          message: 'Không nhận được phản hồi từ server'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Xử lý lỗi từ interceptor của baseService
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Phiên đăng nhập đã hết hạn'
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Không thể kết nối đến server...'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Cập nhật thông tin thất bại'
      };
    }
  }

  async changePassword(passwordData) {
    try {
      const response = await api.post('/user/change-password', passwordData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Mật khẩu hiện tại không đúng'
        };
      }
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Không thể kết nối đến server...'
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại'
      };
    }
  }

  async getTopCrosswordCreators() {
    try {
      const response = await api.get('/user/leaderboard/crosswords');
            
      if (!response?.data) {
        return {
          success: false,
          message: 'Không nhận được dữ liệu từ server'
        };
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Không thể kết nối đến server...'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải bảng xếp hạng'
      };
    }
  }

  async getMostCompletions() {
    try {
      const response = await api.get('/users/leaderboard/completions');
      
      if (!response?.data) {
        return {
          success: false,
          message: 'Không nhận được dữ liệu từ server'
        };
      }

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'Không thể kết nối đến server...'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải bảng xếp hạng'
      };
    }
  }
}

export default new UserService();