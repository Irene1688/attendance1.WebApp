import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    // 保存当前路径，以便登录后返回
    localStorage.setItem('returnPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // 检查用户是否有权限访问该路由
  if (Array.isArray(role) && !role.includes(user.role)) {
    // 根据用户角色重定向到相应的首页
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

export default PrivateRoute; 