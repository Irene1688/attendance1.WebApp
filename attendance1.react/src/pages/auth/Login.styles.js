import { styled } from '@mui/material/styles';
import { Container, Paper } from '@mui/material';

export const LoginContainer = styled(Container)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default
  }));
  
  export const LoginPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isStaff'
  })(({ theme, isStaff }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)',
    background: isStaff 
      ? theme.palette.background.paper
      : theme.palette.grey[800],
    color: isStaff 
      ? theme.palette.grey[800]
      : theme.palette.common.white,
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6),
    }
  }));