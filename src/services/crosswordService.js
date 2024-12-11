import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const createCrossword = async (crosswordData) => {
  try {
    const response = await axios.post(
      `${API_URL}/crosswords/create`,
      crosswordData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi tạo ô chữ' };
  }
};

const getCrossword = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/crosswords/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi lấy thông tin ô chữ' };
  }
};

export const crosswordService = {
  createCrossword,
  getCrossword
};
