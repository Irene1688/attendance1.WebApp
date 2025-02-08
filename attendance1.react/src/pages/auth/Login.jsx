import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Collapse, 
  Typography, 
  useTheme, 
  Container, 
  Paper,
  Link
} from '@mui/material';
import { styles } from './Login.styles';
import { StudentLoginForm, StaffLoginForm, LoginRoleToggle } from '../../components/Auth';
import { PromptMessage } from '../../components/Common';
import { useAuth } from '../../hooks/auth';
import { formatPageTitle } from '../../utils/helpers';
import { ADMIN_EMAIL, BUG_REPORT_FORM_URL } from '../../constants/contactConstatnt';
import { useMessageContext } from '../../contexts/MessageContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [isStaffLogin, setIsStaffLogin] = useState(false);
  const [helperTextCount, setHelperTextCount] = useState(0);
  const { handleLogin } = useAuth();
  const [error, setError] = useState('');
  const { message, hideMessage, showErrorMessage } = useMessageContext();
  // handle the error message in the URL parameters
  useEffect(() => {
    const errorMessage = searchParams.get('error');
    const from = searchParams.get('from');
    
    if (errorMessage) {
      // clear the URL parameters, but keep the current page state
      navigate('/login', { replace: true });
      setError(errorMessage);
    }
    
    // save the return path
    if (from) {
      localStorage.setItem('returnPath', from);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'invalid_device') {
      showErrorMessage(
        'Your account can only be accessed from your registered device. Please contact administrator if you need to change devices.'
      );
    }
  }, [searchParams, showErrorMessage]);

  const handleHelperTextChange = (helperTextCount) => {
    setHelperTextCount(helperTextCount);
  };

  const toggleLoginRole = () => {
    setIsStaffLogin(!isStaffLogin);
  };

  return (
    <>
      <Helmet>
        <title>{formatPageTitle('Login')}</title>
      </Helmet>
      <Container  maxWidth="sm" sx={themedStyles.loginContainer}>
        {message.show && message.severity === 'error' && (
          <PromptMessage
            open={true}
            message={message.text}
            severity={message.severity}
            fullWidth
            onClose={hideMessage}
            sx={{ mb: 2 }}
          />
        )}
        <Paper sx={themedStyles.loginPaper(isStaffLogin)}>
          <Typography 
            variant="h1" 
            onClick={toggleLoginRole} 
            sx={{
              marginTop: isStaffLogin ? 5 : 3,
              marginBottom: isStaffLogin ? 4 : 2,
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
        </Paper>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {/* navigate to email with title */}
          <Link href={`mailto:${ADMIN_EMAIL}?subject=Need help with Attendance System`}>Contact Admin</Link> | &nbsp;
          <Link href={BUG_REPORT_FORM_URL}>Report bug</Link>
        </Typography>
      </Container>
    </>
  );
};

export default Login; 