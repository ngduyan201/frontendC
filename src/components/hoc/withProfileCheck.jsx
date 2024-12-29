import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export const withProfileCheck = (WrappedComponent) => {
  return function WithProfileCheck(props) {
    const { profileStatus } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!profileStatus.isCompleted) {
        toast.info('Vui lòng cập nhật thông tin cá nhân để tiếp tục');
        navigate('/account', { 
          state: { 
            requireUpdate: true,
            returnPath: window.location.pathname,
            missingFields: profileStatus.missingFields
          } 
        });
      }
    }, [profileStatus.isCompleted, navigate]);

    if (!profileStatus.isCompleted) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
