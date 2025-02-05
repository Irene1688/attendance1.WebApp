import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  base: {
    borderRadius: 1
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white.off,
    '&:hover': {
      color: alpha(theme.palette.common.white, 0.7),
      backgroundColor: alpha(theme.palette.primary.main, 0.8)
    }
  },
  cancel: {
    color: theme.palette.grey[500],
    '&:hover': {
      backgroundColor: alpha(theme.palette.grey[500], 0.08)
    }
  },
  delete: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.white.off,
    '&:hover': {
      color: alpha(theme.palette.common.white, 0.7),
      backgroundColor: alpha(theme.palette.error.main, 0.8)
    }
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }
}); 