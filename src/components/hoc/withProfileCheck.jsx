import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export const withProfileCheck = (WrappedComponent) => {
  return function WithProfileCheck(props) {
    const { profileStatus, checkProfileStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const checkProfile = async () => {
        const status = await checkProfileStatus?.();
        
        if (status && !status.isCompleted) {
          toast.info('Vui lòng cập nhật thông tin cá nhân để tiếp tục');
          navigate('/account', { 
            state: { 
              requireUpdate: true,
              returnPath: window.location.pathname,
              missingFields: status.missingFields
            },
            replace: true
          });
        }
      };

      checkProfile();
    }, []); // Chỉ chạy một lần khi component mount

    // Chỉ render component khi profile đã hoàn thành
    return profileStatus.isCompleted ? <WrappedComponent {...props} /> : null;
  };
};
