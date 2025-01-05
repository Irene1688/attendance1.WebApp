import { Navigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, getRedirectPath } = useAuthRedirect();

  if (isAuthenticated && user) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children;
};

export default PublicRoute; 