import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (currentUser) {
    // Nếu đã đăng nhập, redirect về homepage
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default PublicRoute; 