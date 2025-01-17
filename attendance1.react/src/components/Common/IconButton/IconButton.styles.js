import { alpha } from '@mui/material/styles';

export const styles = {
  base: {
    borderRadius: 1,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1)
    }
  },
  primary: {
    color: (theme) => theme.palette.grey[500],
  },
  secondary: {
    color: (theme) => theme.palette.secondary.main,
  },
  delete: {
    color: (theme) => theme.palette.error.main,
  },
  
  iconButton: {
    minWidth: 'auto',
    padding: 1,
  }
}; 