import { styled } from '@mui/material/styles';
import { Link } from '@mui/material';

export const StyledLoginRoleToggle = styled(Link, {
  shouldForwardProp: (prop) => !['isStaff', 'helperTextCount', 'error'].includes(prop)
})(({ theme, isStaff, error, helperTextCount }) => ({
  width: '100%',
  height: isStaff 
    ? 'auto' 
    : error ? theme.spacing(4) : 'auto',
  fontWeight: 'bold',
  position: 'absolute',
  top: isStaff 
    ? theme.spacing(2)
    : error 
      ? theme.spacing(66) // when has error
      : helperTextCount === 1 
        ? theme.spacing(61) // when has 1 helper text
        : helperTextCount === 2 
          ? theme.spacing(63) // when has 2 helper text
          : theme.spacing(58), // when has no helper text and no error
  cursor: 'pointer',
  color: isStaff 
    ? theme.palette.common.white
    : theme.palette.grey[800],
  textDecoration: 'none',
  opacity: 1,
  padding: theme.spacing(1.5, 3),
  zIndex: 1,
  textAlign: 'center',
  '&:hover': {
    opacity: 0.8,
    color: isStaff 
      ? theme.palette.common.white
      : theme.palette.grey[800],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: isStaff 
      ? theme.spacing(-5)
      : theme.spacing(-2),
    left: theme.spacing(0),
    right: theme.spacing(0),
    bottom: isStaff 
      ? theme.spacing(-2)
      : theme.spacing(-8),
    background: isStaff 
      ? theme.palette.grey[800]
      : theme.palette.common.white,
    borderTopLeftRadius: isStaff 
      ? theme.spacing(0)
      : theme.spacing(40),
    borderTopRightRadius: isStaff 
      ? theme.spacing(0)
      : theme.spacing(40),
    borderBottomLeftRadius: isStaff 
      ? theme.spacing(40)
      : theme.spacing(0),
    borderBottomRightRadius: isStaff 
      ? theme.spacing(40)
      : theme.spacing(0),
    zIndex: -1,
    transition: 'all 0.8s ease',
  }
})); 