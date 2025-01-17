import { useState, useCallback } from 'react';

export const useMessage = (
  initialState = { show: false, text: '', severity: 'success' },
  options = { scrollToTop: true, smooth: true }
) => {
  const [message, setMessage] = useState(initialState);

  const showMessage = useCallback((text, severity = 'success') => {
    setMessage({
      show: true,
      text,
      severity
    });
  }, [options]);

  const hideMessage = useCallback(() => {
    setMessage(prev => ({ ...prev, show: false }));
  }, []);

  const showSuccessMessage = useCallback((text) => {
    if (options.scrollToTop) {
        window.scrollTo({
          top: 0,
          behavior: options.smooth ? 'smooth' : 'auto'
        });
      }
    showMessage(text, 'success');
  }, [showMessage, options]);

  const showErrorMessage = useCallback((text) => {
    showMessage(text, 'error');
  }, [showMessage, options]);

  return {
    message,
    showMessage,
    showSuccessMessage,
    showErrorMessage,
    hideMessage
  };
}; 