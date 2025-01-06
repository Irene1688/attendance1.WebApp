import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Collapse, Typography } from '@mui/material';
import { LoginContainer, LoginPaper } from './Login.styles';
import { StudentLoginForm, StaffLoginForm, LoginRoleToggle } from '../../components/Auth';
import { PromptMessage } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { formatPageTitle } from '../../utils/helpers';

const Login = () => {
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [helperTextCount, setHelperTextCount] = useState(0);
  const { error, setError, handleLogin } = useAuth();
  const location = useLocation();

  const [notification, setNotification] = useState({
    message: '',
    severity: 'info',
    show: false
  });

  const handleHelperTextChange = (helperTextCount) => {
    setHelperTextCount(helperTextCount);
  };

  const toggleLoginRole = () => {
    setIsStaffLogin(!isStaffLogin);
    setError(''); // clear error message
    setNotification(prev => ({ ...prev, show: false })); // 清除通知
  };

  // 处理路由传递的消息
  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        severity: location.state.severity || 'info',
        show: true
      });
    }
  }, [location]);

  // 处理错误消息
  useEffect(() => {
    if (error) {
      setNotification({
        message: typeof error === 'string' ? error : 'An error occurred. Please try again.',
        severity: 'error',
        show: true
      });
    }
  }, [error]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
    if (notification.severity === 'error') {
      setError(''); // 如果是错误消息，同时清除错误状态
    }
  };

  return (
    <>
      <Helmet>
        <title>{formatPageTitle('Login')}</title>
      </Helmet>
      <LoginContainer maxWidth="sm">
        <LoginPaper isStaff={isStaffLogin}>
          <Typography 
            variant="h1" 
            onClick={toggleLoginRole} 
            sx={{
              marginTop: isStaffLogin ? 8 : 0,
              marginBottom: 4,
              color: isStaffLogin ? 'grey.800' : 'common.white',
              fontWeight: 600,
              fontSize: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            {isStaffLogin ? 'Staff Login' : 'Student Login'}
          </Typography>

          {/* 统一的消息提示组件 */}
          {notification.show && (
            <PromptMessage
              open={true}
              message={notification.message}
              severity={notification.severity}
              fullWidth={true}
              onClose={handleCloseNotification}
              sx={{ mb: 2 }}
            />
          )}

          <Collapse in={!isStaffLogin} timeout={900}>
            <StudentLoginForm 
              isStaff={isStaffLogin}
              onSubmit={(values, formikHelpers) => handleLogin(values, formikHelpers, false)}
              onHelperTextChange={handleHelperTextChange}
            />
          </Collapse>

          <Collapse in={isStaffLogin} timeout={900}>
            <StaffLoginForm 
              isStaff={isStaffLogin}
              onSubmit={(values, formikHelpers) => handleLogin(values, formikHelpers, true)}
            />
          </Collapse>

          <LoginRoleToggle 
            onClick={toggleLoginRole} 
            sx={{ display: 'block', textAlign: 'center' }}
            isStaff={isStaffLogin}
            error={error}
            helperTextCount={helperTextCount}
          >
            {isStaffLogin ? 'Student Login' : 'Staff Login'}
          </LoginRoleToggle>
        </LoginPaper>
      </LoginContainer>
    </>
  );
};

export default Login; 