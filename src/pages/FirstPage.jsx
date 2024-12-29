import { useState } from 'react'; 
import bg1 from '../assets/imgs/bg1.jpeg';
import logo from '../assets/imgs/logo.png';
import LoginForm from '../components/features/LoginForm';
import RegisterForm from '../components/features/RegisterForm';
import ForgotPasswordForm from '../components/features/ForgotPasswordForm';
import { useAuth } from '../contexts/AuthContext';

function FirstPage() {
  const [activeForm, setActiveForm] = useState(null);
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isLoginLoading } = useAuth();

  // Hàm chuyển đổi form
  const handleFormToggle = (form) => {
    setActiveForm(form);
    if (form === 'register') {
      setIsRegisterActive(true);
    } else {
      setIsRegisterActive(false);
    }
  };

  // Hàm xử lý khi đăng ký thành công và chuyển sang form đăng nhập
  const handleSwitchToLogin = () => {
    handleFormToggle('login');
  };

  // Hàm xử lý hiển thị form quên mật khẩu
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Hàm đóng modal
  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
      {isLoginLoading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Đang đăng nhập...</p>
          </div>
        </div>
      ) : null}

      {/* Modal Quên mật khẩu */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg relative max-w-md w-full mx-4">
            {/* Nút đóng */}
            <button
              onClick={handleCloseForgotPassword}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <ForgotPasswordForm onClose={handleCloseForgotPassword} />
          </div>
        </div>
      )}

      {/* Phần trái */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center py-16">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Logo" 
          className="absolute top-6 left-6 h-12 w-auto"
        />

        {/* Tên game */}
        <h1
          className="text-6xl md:text-8xl font-extrabold text-teal-600 mb-20 flex flex-col items-center justify-center"
          style={{ fontFamily: 'Bungee Shade, sans-serif' }}
        >
          <span className="text-45xl mb-8">TRÒ CHƠI</span>
          <span className="text-65xl">Ô CHỮ</span>
        </h1>

        {/* Nút Đăng nhập và Đăng ký */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleFormToggle('login')}
            className={`px-10 py-3 rounded-full font-bold shadow-lg transition-transform ${
              activeForm === 'login' ? 'bg-teal-600 text-white scale-110' : 'bg-teal-600 text-white hover:scale-105 hover:shadow-xl'
            }`}
          >
            ĐĂNG NHẬP
          </button>

          <button
            onClick={() => handleFormToggle('register')}
            className={`px-10 py-3 bg-white text-teal-600 border border-teal-600 rounded-full font-bold 
                       shadow-lg hover:bg-teal-100 hover:scale-105 transition-transform ${
                         isRegisterActive ? 'scale-110 bg-blue-600 text-teal-600' : ''
                       }`}
          >
            ĐĂNG KÝ
          </button>

          <button
            onClick={handleForgotPassword}
            className="text-teal-600 hover:underline mt-2 text-sm font-medium"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>

      {/* Phần phải */}
      <div className="w-1/2 bg-transparent flex justify-center items-center relative">
        {activeForm === 'login' ? (
          <LoginForm />
        ) : activeForm === 'register' ? (
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <img src={bg1} alt="Background Illustration" className="w-3/5 h-auto rounded-lg shadow-2xl" />
        )}
      </div>
    </div>
  );
}

export default FirstPage;
