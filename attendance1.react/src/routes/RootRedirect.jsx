import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RootRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
};

export default RootRedirect; 