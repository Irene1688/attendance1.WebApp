import { createContext, useContext } from 'react';
import { useMessage } from '../hooks/common/useMessage';

export const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const messageUtils = useMessage();
  
  return (
    <MessageContext.Provider value={messageUtils}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
}; 