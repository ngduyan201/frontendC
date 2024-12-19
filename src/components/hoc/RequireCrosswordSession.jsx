import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequireCrosswordSession = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCookie = () => {
      // Kiểm tra cookie crosswordSession
      const cookies = document.cookie.split(';');
      const hasCrosswordSession = cookies.some(cookie => 
        cookie.trim().startsWith('crosswordSession=')
      );

      if (!hasCrosswordSession) {
        toast.error('Vui lòng tạo ô chữ mới từ trang chủ');
        navigate('/homepage');
        return;
      }
      
      setIsChecking(false);
    };

    checkCookie();
  }, [navigate]);

  if (isChecking) {
    return null; // hoặc loading spinner
  }

  return children;
};

export default RequireCrosswordSession; 