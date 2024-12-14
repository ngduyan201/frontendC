import { API_BASE_URL } from '../config/apiConfig';
import { toast } from 'react-toastify';

export const api = {
  get: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
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
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
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