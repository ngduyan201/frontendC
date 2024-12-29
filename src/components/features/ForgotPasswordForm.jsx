import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const ForgotPasswordForm = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success('Mã xác thực đã được gửi đến email của bạn');
        setStep(2);
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.verifyResetCode(email, code);
      if (response.success) {
        setStep(3);
      }
    } catch (error) {
      toast.error(error.message || 'Mã xác thực không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, code, newPassword);
      if (response.success) {
        toast.success('Đặt lại mật khẩu thành công');
        setResponse(response);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {step === 1 && (
        <form onSubmit={handleRequestReset}>
          <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLoading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          <h2 className="text-2xl font-bold mb-4">Nhập mã xác thực</h2>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã 6 số"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-blue-500 hover:underline"
          >
            Quay lại
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <h2 className="text-2xl font-bold mb-4">Đặt mật khẩu mới</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded mb-2"
          >
            {isLoading ? 'Đang xử lý...' : 'Hoàn tất'}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full text-blue-500 hover:underline"
          >
            Quay lại
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
