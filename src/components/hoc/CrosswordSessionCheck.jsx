import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crosswordService } from '../../services/crosswordService';

const CrosswordSessionCheck = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await crosswordService.getCurrentSession();
        
        if (!response.success) {
          // Nếu không có phiên hoặc phiên hết hạn
          navigate('/create-new');
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/create-new');
      }
    };

    checkSession();
  }, [navigate]);

  if (isChecking) {
    return <div>Đang kiểm tra phiên làm việc...</div>;
  }

  return children;
};

export default CrosswordSessionCheck; 