import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { crosswordService } from '../../services/crosswordService';

const RequireCrosswordSession = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Thay vì kiểm tra cookie trực tiếp, gọi API kiểm tra session
        const response = await crosswordService.getCurrentSession();

        if (!response.success) {
          toast.error('Vui lòng tạo ô chữ mới từ trang chủ');
          navigate('/homepage');
          return;
        }

        setIsChecking(false);

      } catch (error) {
        toast.error('Vui lòng tạo ô chữ mới từ trang chủ');
        navigate('/homepage');
      }
    };

    checkSession();
  }, [navigate]);

  if (isChecking) {
    return <div>Đang kiểm tra phiên làm việc...</div>;
  }

  return children;
};

export default RequireCrosswordSession; 