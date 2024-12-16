import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!currentUser) {
    // Nếu chưa đăng nhập, redirect về trang chủ (login)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 