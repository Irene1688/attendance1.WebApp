import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export const useAuthApiError = (initialState = '') => {
  // initial state that will be used
  const [error, setError] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // main business logi
  const handleAuthApiCall = useCallback(async (apiCall, onSuccess) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall();
      
      if (!response.success) {
        throw new Error(response.errorMessage || 'Authentication failed');
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const messageFromServer = err.response?.data?.errorMessage;
      const errorMessage = err.message || 'Authentication failed';

      // 如果是token过期，清除认证信息并重定向
      if (err.response?.status === 401 && err.response?.headers['token-expired']) {
        dispatch(logout());
        const params = new URLSearchParams({
          error: messageFromServer || 'Your session has expired. Please login again.',
          from: window.location.pathname
        }).toString();
        navigate(`/login?${params}`);
      } else {
        setError(messageFromServer || errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, dispatch]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    error,
    setError,
    loading,
    setLoading,
    handleAuthApiCall,
    clearError
  };
}; 