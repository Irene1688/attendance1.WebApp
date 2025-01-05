import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { setCredentials } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (values, { setSubmitting }, isStaff = false) => {
    try {
      setError('');
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

      const response = await authApi.staffLogin(loginData);
      if (!response.success && response.ErrorMessage !== "") {
        setError(response.ErrorMessage);
        return;
      }

      const { name, role, campusId, accessToken, refreshToken } = response.data;
      dispatch(setCredentials({
        user: { name, role, campusId },
        accessToken,
        refreshToken,
      }));

      if (isStaff) {
        const dashboardPath = values.role === 'Admin' 
          ? '/admin/dashboard' 
          : '/lecturer/dashboard';
        navigate(dashboardPath);
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error(`${isStaff ? 'Staff' : 'Student'} login error:`, err);
      handleError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleError = (err, setError) => {
    if (typeof err.response?.data === 'object') {
      setError(err.response.data.message || JSON.stringify(err.response.data));
    } else if (err.response?.data) {
      setError(err.response.data);
    } else {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return {
    error,
    setError,
    handleLogin
  };
}; 