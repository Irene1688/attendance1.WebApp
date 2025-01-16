import { alpha } from '@mui/material/styles';

export const styles = {
  base: {
    borderRadius: 1
  },
  primary: {
    backgroundColor: (theme) => theme.palette.primary.main,
    color: (theme) => alpha(theme.palette.common.white, 0.7),
    '&:hover': {
      color: (theme) => theme.palette.white.off,
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8)
    }
  },
  cancel: {
    color: (theme) => theme.palette.grey[500],
    '&:hover': {
      backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.08)
    }
  },
  delete: {
    backgroundColor: (theme) => theme.palette.error.main,
    color: (theme) => theme.palette.white.off,
    '&:hover': {
      color: (theme) =>alpha(theme.palette.common.white, 0.7),
      backgroundColor: (theme) => alpha(theme.palette.error.main, 0.8)
    }
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  }
}; 