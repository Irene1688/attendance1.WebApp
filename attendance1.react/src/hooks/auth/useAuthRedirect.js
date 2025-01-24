import { useSelector } from 'react-redux';

export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getRedirectPath = () => {
    if (!isAuthenticated || !user) {
      return '/login';
    }

    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Lecturer':
        return '/lecturer/take-attendance';
      case 'Student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };

  return {
    isAuthenticated,
    user,
    getRedirectPath
  };
}; 