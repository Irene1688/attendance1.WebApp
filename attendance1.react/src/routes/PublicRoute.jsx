import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    // 根据用户角色重定向到相应的页面
    switch (user.role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Lecturer':
        return <Navigate to="/lecturer/take-attendance" replace />;
      case 'Student':
        return <Navigate to="/student/home" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PublicRoute; 