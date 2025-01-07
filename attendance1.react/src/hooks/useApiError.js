import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export const useApiError = (initialState = '') => {
  const [error, setError] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleApiCall = useCallback(async (apiCall, onSuccess) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall();

      if (!response.success) {
        throw new Error(response.errorMessage || 'Operation failed');
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const messageFromServer = err.response?.data?.errorMessage;
      const errorMessage = err.message || 'An error occurred';
      
      // if token expired and failed to refresh token
      if (messageFromServer === "Failed to refresh token: Invalid or expired refresh token") {
        // 清除认证信息
        dispatch(logout());
        
        // build redirect params
        const params = new URLSearchParams({
          error: 'Your session has expired. Please login again.',
          from: window.location.pathname
        }).toString();
        navigate(`/login?${params}`);
        return;
      } 
      
      setError(messageFromServer || errorMessage);
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
    handleApiCall,
    clearError
  };
}; 