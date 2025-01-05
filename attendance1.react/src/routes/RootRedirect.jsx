import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'Admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'Lecturer':
      return <Navigate to="/lecturer/dashboard" replace />;
    case 'Student':
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect; 