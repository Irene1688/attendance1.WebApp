import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // if the role is specified but the user role does not match, redirect to the corresponding home page
    switch(user.role) {
      case 'Admin':
        return <Navigate to="/admin" replace />;
      case 'Lecturer':
        return <Navigate to="/lecturer" replace />;
      case 'Student':
        return <Navigate to="/student" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute; 