import { StyledLoginRoleToggle } from './LoginRoleToggle.styles';

const LoginRoleToggle = ({ isStaff, onClick, children, error, helperTextCount, ...props }) => {
  return (
    <StyledLoginRoleToggle 
      onClick={onClick}
      isStaff={isStaff}
      error={error}
      helperTextCount={helperTextCount}
      {...props}
    >
      {children}
    </StyledLoginRoleToggle>
  );
};

export default LoginRoleToggle; 