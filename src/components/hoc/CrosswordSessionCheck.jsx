import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crosswordService } from '../../services/crosswordService';
import { toast } from 'react-toastify';

const CrosswordSessionCheck = ({ children, onSessionData }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await crosswordService.getCurrentSession();
        
        if (!response.success) {
          if (response.redirect) {
            toast.error('Phiên làm việc đã hết hạn');
            navigate('/create');
          }
          return;
        }

        if (response.data) {
          setSessionData(response.data);
          if (onSessionData) {
            onSessionData(response.data);
          }

          // Kiểm tra thời gian còn lại của phiên
          const timeLeft = response.data.expiresIn;
          if (timeLeft < 300000) { // 5 phút
            setShowTimeoutWarning(true);
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Session check error:', error);
        toast.error('Có lỗi xảy ra khi kiểm tra phiên làm việc');
        navigate('/create');
      }
    };

    checkSession();

    // Kiểm tra session định kỳ
    const interval = setInterval(checkSession, 60000); // 1 phút
    return () => clearInterval(interval);
  }, [navigate, onSessionData]);

  return (
    <>
      {isChecking ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Đang kiểm tra phiên làm việc...</div>
        </div>
      ) : (
        <>
          {showTimeoutWarning && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 fixed top-0 right-0 m-4">
              <p className="font-bold">Cảnh báo!</p>
              <p>Phiên làm việc sắp hết hạn. Vui lòng lưu công việc của bạn.</p>
            </div>
          )}
          {children}
        </>
      )}
    </>
  );
};

export default CrosswordSessionCheck; 