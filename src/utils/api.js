import { API_BASE_URL } from '../config/apiConfig';
import { toast } from 'react-toastify';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const api = {
  get: async (url) => {
    try {
      console.log('GET Request to:', `${API_BASE_URL}${url}`);
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('GET Error:', errorData);
        toast.error(errorData.message || 'Có lỗi xảy ra');
        throw errorData;
      }
      
      return response.json();
    } catch (error) {
      console.error('GET Request failed:', error);
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      console.log('POST Request to:', `${API_BASE_URL}${url}`);
      console.log('POST Data:', data);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('POST Error:', errorData);
        toast.error(errorData.message || 'Có lỗi xảy ra');
        throw errorData;
      }
      
      return response.json();
    } catch (error) {
      console.error('POST Request failed:', error);
      throw error;
    }
  },

  put: async (url, data) => {
    try {
      console.log('PUT Request to:', `${API_BASE_URL}${url}`);
      console.log('PUT Data:', data);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('PUT Error:', errorData);
        toast.error(errorData.message || 'Có lỗi xảy ra');
        throw errorData;
      }
      
      return response.json();
    } catch (error) {
      console.error('PUT Request failed:', error);
      throw error;
    }
  },

  delete: async (url) => {
    try {
      console.log('DELETE Request to:', `${API_BASE_URL}${url}`);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('DELETE Error:', errorData);
        toast.error(errorData.message || 'Có lỗi xảy ra');
        throw errorData;
      }
      
      return response.json();
    } catch (error) {
      console.error('DELETE Request failed:', error);
      throw error;
    }
  }
}; 