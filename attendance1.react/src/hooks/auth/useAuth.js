import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout } from '../../store/slices/authSlice';
import { authApi } from '../../api/auth';
import { useApiExecutor } from '../../hooks/common';
import { useMessageContext } from '../../contexts/MessageContext';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, handleApiCall } = useApiExecutor();

  const handleLogin = useCallback(async (values, formikHelpers, isStaff) => {
    try {
      const loginData = isStaff 
        ? {
            username: values.username,
            password: values.password,
            role: values.role
          }
        : {
            email: values.email.toLowerCase(),
            password: values.password,
            role: 'Student'
          };

      await handleApiCall(
        () => isStaff ? authApi.staffLogin(loginData) : authApi.studentLogin(loginData),
        (data) => {
          const { name, role, campusId, accessToken, refreshToken } = data;
          dispatch(setCredentials({
            user: { name, role, campusId },
            accessToken,
            refreshToken
          }));

          let redirectPath;
          if (isStaff) {
            redirectPath = role === 'Admin' ? '/admin/dashboard' : '/lecturer/dashboard';
          } else {
            redirectPath = '/student/dashboard';
          }

          localStorage.removeItem('returnPath');
          navigate(redirectPath);
        }
      );
    } catch (err) {
      formikHelpers?.setSubmitting(false);
    }
  }, [dispatch, navigate, handleApiCall]);

  const handleLogout = useCallback(async () => {
    try {
      const logoutData = {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      }

      await handleApiCall(
        () => authApi.logout(logoutData),
        () => {
          dispatch(logout());
          navigate('/login');
        }
      );
    } catch (err) {
      // even logout failed, also clear local auth info
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, navigate, handleApiCall]);

  return {
    loading,
    handleLogin,
    handleLogout
  };
}; 