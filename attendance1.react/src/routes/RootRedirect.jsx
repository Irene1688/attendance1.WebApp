import { Navigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const RootRedirect = () => {
  const { getRedirectPath } = useAuthRedirect();
  return <Navigate to={getRedirectPath()} replace />;
};

export default RootRedirect; 