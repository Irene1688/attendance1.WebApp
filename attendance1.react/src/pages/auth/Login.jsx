import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Collapse, Typography } from '@mui/material';
import { LoginContainer, LoginPaper } from './Login.styles';
import { StudentLoginForm, StaffLoginForm, LoginRoleToggle } from '../../components/Auth';
import { PromptMessage } from '../../components/Common';
import { useAuth } from '../../hooks/useAuth';
import { formatPageTitle } from '../../utils/helpers';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [helperTextCount, setHelperTextCount] = useState(0);
  const { error, setError, handleLogin } = useAuth();

  // 处理 URL 参数中的错误信息
  useEffect(() => {
    const errorMessage = searchParams.get('error');
    const from = searchParams.get('from');
    
    if (errorMessage) {
      setError(errorMessage);
      // 清除 URL 中的参数，但保持当前页面状态
      navigate('/login', { replace: true });
    }
    
    // 可以保存 from 路径，登录成功后跳回原页面
    if (from) {
      localStorage.setItem('returnPath', from);
    }
  }, [searchParams, setError, navigate]);

  const handleHelperTextChange = (helperTextCount) => {
    setHelperTextCount(helperTextCount);
  };

  const toggleLoginRole = () => {
    setIsStaffLogin(!isStaffLogin);
    setError(''); // clear error message
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
          
          {error && (
            <PromptMessage
              open={true}
              message={
                typeof error === 'string' 
                  ? error 
                  : 'An error occurred. Please try again.'
              }
              severity="error"
              fullWidth={true}
              onClose={() => setError('')}
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