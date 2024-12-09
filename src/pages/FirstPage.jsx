import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import bg1 from '../assets/imgs/bg1.jpeg';
import logo from '../assets/imgs/logo.png';
import LoginForm from '../components/features/LoginForm'; // Import LoginForm
import RegisterForm from '../components/features/RegisterForm'; // Import RegisterForm
import { toast } from 'react-toastify'; // Import toast for notifications

function FirstPage() {
  const [activeForm, setActiveForm] = useState(null); // Quản lý trạng thái form đang hiển thị
  const [isRegisterActive, setIsRegisterActive] = useState(false); // Trạng thái để phóng to nút Đăng ký
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Trạng thái hiển thị thông báo Đăng ký
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false); // Trạng thái hiển thị thông báo Xin chào

  const navigate = useNavigate();

  // Hàm chuyển đổi form
  const handleFormToggle = (form) => {
    setActiveForm(form);
    setShowSuccessMessage(false); // Ẩn thông báo nếu chuyển form
    setShowWelcomeMessage(false); // Ẩn thông báo Xin chào nếu chuyển form
    if (form === 'register') {
      setIsRegisterActive(true);
    } else {
      setIsRegisterActive(false);
    }
  };

  // Hàm xử lý khi đăng ký thành công
  const handleRegisterSubmit = () => {
    setActiveForm(null); // Ẩn form Đăng ký
    setShowSuccessMessage(true); // Hiển thị thông báo thành công
  };

  // Hàm xử lý khi nhấn "Đăng nhập ngay"
  const handleLoginRedirect = () => {
    setShowSuccessMessage(false); // Ẩn thông báo
    handleFormToggle('login'); // Chuyển sang form Đăng nhập
  };

  // Hàm xử lý khi đăng nhập thành công
  const handleLoginSubmit = async (credentials) => {
    try {
      // Assume login API call here
      const response = await loginApi(credentials);
      if (response.success) {
        setActiveForm(null); // Ẩn form Đăng nhập chỉ khi đăng nhập thành công
        setShowWelcomeMessage(true); // Hiển thị thông báo Xin chào
      } else {
        toast.error(response.message); // Show error message
      }
    } catch (error) {
      toast.error('Lỗi khi đăng nhập'); // Show generic error message
    }
  };

  // Hàm chuyển hướng sang Homepage
  const navigateToHomepage = () => {
    navigate('/homepage'); 
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#0097b2] to-[#7ed957]">
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
        </div>
      </div>

      {/* Phần phải */}
      <div className="w-1/2 bg-transparent flex justify-center items-center relative">
        {/* Hiển thị thông báo thành công */}
        {showSuccessMessage ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Đăng ký thành công!</h2>
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : showWelcomeMessage ? (
          // Hiển thị thông báo Xin chào
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Xin chào!</h2>
            <button
              onClick={navigateToHomepage}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              Khám phá ngay
            </button>
          </div>
        ) : activeForm === 'login' ? (
          // Hiển thị form Đăng nhập
          <LoginForm onSubmit={handleLoginSubmit} />
        ) : activeForm === 'register' ? (
          // Hiển thị form Đăng ký
          <RegisterForm onSubmit={handleRegisterSubmit} /> 
        ) : (
          // Hiển thị ảnh nền khi chưa chọn form
          <img src={bg1} alt="Background Illustration" className="w-3/5 h-auto rounded-lg shadow-2xl" />
        )}
      </div>
    </div>
  );
}

export default FirstPage;
