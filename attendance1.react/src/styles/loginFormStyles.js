import { styled } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Form } from 'formik';

export const StyledLoginForm = styled(Form)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(1)
  }));

export const StyledLoginTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'isStaff'
  })(({ theme, isStaff }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiFormLabel-asterisk': {
      color: isStaff 
        ? theme.palette.primary.main 
        : theme.palette.common.white,
    },
    '& .MuiOutlinedInput-root': {
      color: isStaff ? theme.palette.grey[800] : theme.palette.common.white,
      '& fieldset': {
        borderColor: isStaff 
          ? `rgba(43, 45, 66, 0.3)`  
          : `rgba(255, 255, 255, 0.6)`,
      },
      '&:hover fieldset': {
        borderColor: isStaff 
          ? `rgba(43, 45, 66, 0.8)` 
          : `rgba(255, 255, 255, 0.8)`,
      },
      '&.Mui-focused fieldset': {
        borderColor: isStaff 
          ? theme.palette.primary.main 
          : theme.palette.common.white,
      },
      '&.Mui-error fieldset': {
        borderColor: isStaff 
          ? theme.palette.primary.main 
          : theme.palette.common.white,
      },
      '&.Mui-focused.Mui-error fieldset': {
        borderColor: isStaff 
          ? theme.palette.primary.main 
          : theme.palette.common.white,
      }
    },
    '& .MuiInputLabel-root': {
      color: isStaff 
        ? `rgba(43, 45, 66, 0.7)` 
        : `rgba(255, 255, 255, 0.7)`,
      '&.Mui-focused': {
        color: isStaff 
          ? theme.palette.primary.main 
          : theme.palette.common.white,
      },
      '&.Mui-error': {
        color: isStaff 
          ? theme.palette.primary.main 
          : theme.palette.common.white,
      }
    },
    '& .MuiInputBase-input::placeholder': {
      color: isStaff 
        ? `rgba(43, 45, 66, 0.5)` 
        : `rgba(255, 255, 255, 0.5)`,
      opacity: 1,
    },
    '& .MuiFormHelperText-root': {
      color: isStaff 
        ? theme.palette.error.main 
        : theme.palette.common.white,
      marginLeft: 0,
      '&.Mui-error': {
        color: isStaff 
          ? theme.palette.error.main 
          : theme.palette.common.white,
      }
    }
  }));
  
export const StyledLoginButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'isStaff'
  })(({ theme, isStaff }) => ({
    margin: isStaff 
      ? theme.spacing(5, 0, 8) 
      : theme.spacing(3, 0, 8),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: '1.1rem',
    textTransform: 'none',
    backgroundColor: isStaff 
      ? theme.palette.primary.main 
      : theme.palette.common.white,
    color: isStaff 
      ? theme.palette.common.white 
      : theme.palette.grey[800],
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: isStaff 
        ? theme.palette.primary.dark
        : `rgba(255, 255, 255, 0.9)`,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
    '&.Mui-disabled': {
      backgroundColor: isStaff 
        ? alpha(theme.palette.primary.main, 0.5)
        : alpha(theme.palette.common.white, 0.5),
      color: isStaff 
        ? alpha(theme.palette.common.white, 0.5)
        : alpha(theme.palette.grey[800], 0.5),
    }
  })); 