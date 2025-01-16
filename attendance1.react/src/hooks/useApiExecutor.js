import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useMessageContext } from '../contexts/MessageContext';

export const useApiExecutor = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showErrorMessage, hideMessage } = useMessageContext();

  const handleApiCall = useMemo(() => {
    return async (apiCall, onSuccess, OnComplete) => {
      setLoading(true);
      hideMessage();

      try {
        const response = await apiCall();
        
        if (onSuccess) {
          await onSuccess(response.data);
        }

        return response.data;
      } catch (error) { 
        if (error.response) {
          // get error message from server
          const messageFromServer = error.response.data?.errorMessage;
          
          if (messageFromServer === "Failed to refresh token: Invalid or expired refresh token") {
            dispatch(logout());
            navigate('/login');
            showErrorMessage('Your session has expired. Please login again.');
            return;
          }

          showErrorMessage(messageFromServer);
          throw new Error(messageFromServer);
        } else if (error.request) {
          // Handle network errors
          const errorMessage = 'Network error. Please check your connection.';
          showErrorMessage(errorMessage);
          throw new Error(errorMessage);
        } else {
          // Handle unexpected errors
          const errorMessage = error.message || 'An unexpected error occurred';
          showErrorMessage(errorMessage);
          throw new Error(errorMessage);
        }
      } finally {
        if (OnComplete) {
          OnComplete();
        }
        setLoading(false);
      }
    };
  }, [navigate, dispatch, showErrorMessage, hideMessage]);

  return {
    loading,
    setLoading,
    handleApiCall
  };
}; 