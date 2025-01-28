import { useTheme, Link } from '@mui/material';
import { styles } from './LoginRoleToggle.styles';

const LoginRoleToggle = ({ isStaff, onClick, children, error, helperTextCount, ...props }) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <Link onClick={onClick} sx={themedStyles.loginRoleToggle(isStaff, helperTextCount, error)}>
      {children}
    </Link>
    // <StyledLoginRoleToggle 
    //   onClick={onClick}
    //   isStaff={isStaff}
    //   error={error}
    //   helperTextCount={helperTextCount}
    //   {...props}
    // >
    //   {children}
    // </StyledLoginRoleToggle>
  );
};

export default LoginRoleToggle; 