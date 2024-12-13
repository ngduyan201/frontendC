import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import enterImg from '../../assets/imgs/enter.png';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập tài khoản';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      console.log('Login successful:', response);

      // Kiểm tra accessToken thay vì token
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (!storedToken || !storedRefreshToken) {
        throw new Error('AccessToken hoặc RefreshToken không được lưu đúng cách');
      }

      // Login với user data
      login(response.user, response.accessToken, response.refreshToken);

      setSuccessMessage('Đăng nhập thành công!');
      
      setTimeout(() => {
        navigate('/homepage');
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-3/4 bg-white p-8 rounded-lg shadow-2xl">
      <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
        {/* Tài khoản */}
        <div>
          <label htmlFor="username" className="block text-lg font-bold text-gray-700 mb-2">
            Tài khoản
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập tài khoản..."
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 mt-2">{errors.username}</p>}
        </div>

        {/* Mật khẩu */}
        <div>
          <label htmlFor="password" className="block text-lg font-bold text-gray-700 mb-2">
            Mật khẩu
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập mật khẩu..."
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 mt-2">{errors.password}</p>}
        </div>

        {/* Hiển thị mật khẩu */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-gray-700">
            Hiển thị mật khẩu
          </label>
        </div>

        {/* Hiển thị thông báo lỗi hoặc thành công */}
        {errorMessage && (
          <div className="text-red-500 text-center font-semibold">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-center font-semibold">{successMessage}</div>
        )}

        {/* Nút đăng nhập - Ẩn khi có thông báo thành công */}
        {!successMessage && (
          <button 
            type="submit" 
            className="flex justify-center"
            disabled={isLoading}
          >
            <img
              src={enterImg}
              alt="Enter"
              className={`w-40 h-auto hover:scale-110 transition-transform ${
                isLoading ? 'opacity-50' : ''
              }`}
            />
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center text-gray-500">Đang xử lý...</div>
        )}
      </form>
    </div>
  );
}

export default LoginForm;