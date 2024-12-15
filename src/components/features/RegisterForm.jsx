import React, { useState } from 'react';
import enterImg from '../../assets/imgs/enter.png';
import { authService } from '../../services/authService';
import RegisterSuccessModal from '../modals/RegisterSuccessModal';
import { toast } from 'react-toastify';

function RegisterForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Vui lòng nhập tài khoản.';
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ.';
    }
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu.';
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);
      
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      const response = await authService.register(userData);
      
      if (response.success) {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setShowSuccessModal(true);
      } else {
        toast.error(response.message || 'Đăng ký thất bại');
      }

    } catch (error) {
      toast.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    setShowSuccessModal(false);
    onSwitchToLogin();
  };

  return (
    <>
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Nhập email..."
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 mt-2">{errors.email}</p>}
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

          {/* Nhập lại mật khẩu */}
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-bold text-gray-700 mb-2">
              Nhập lại mật khẩu
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Nhập lại mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-500 mt-2">{errors.confirmPassword}</p>}
          </div>

          {/* Hiển thị mật khẩu */}
          <div className="flex items-center mt-2">
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

          {/* Nút Enter */}
          <button 
            type="submit" 
            className="flex justify-center mt-4"
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

          {/* Hiển thị trạng thái loading */}
          {isLoading && (
            <div className="text-center text-gray-500">Đang xử lý...</div>
          )}
        </form>
      </div>

      <RegisterSuccessModal 
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onLoginClick={handleLoginClick}
      />
    </>
  );
}

export default RegisterForm;
