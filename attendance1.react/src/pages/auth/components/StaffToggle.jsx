import { StyledToggle } from '../styles/ToggleStyles';

const StaffToggle = ({ isStaff, onClick, children, error, helperTextCount, ...props }) => {
  return (
    <StyledToggle 
      onClick={onClick}
      isStaff={isStaff}
      error={error}
      helperTextCount={helperTextCount}
      {...props}
    >
      {children}
    </StyledToggle>
  );
};

export default StaffToggle; 