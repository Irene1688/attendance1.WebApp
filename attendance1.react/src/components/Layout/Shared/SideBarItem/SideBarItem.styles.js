import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  menuItem: (isActive, collapsed) => ({
    color: isActive ? theme.palette.common.white : alpha(theme.palette.common.white, 0.7),
    backgroundColor: isActive ? alpha(theme.palette.common.white, 0.15) : 'transparent',
    ml: collapsed ? theme.spacing(-1) : theme.spacing(0),
    mr: collapsed ? theme.spacing(0) : theme.spacing(0),
    justifyContent: collapsed ? 'center' : 'flex-start',
    '&:hover': {
      backgroundColor: isActive 
        ? alpha(theme.palette.common.white, 0.2) 
        : alpha(theme.palette.common.white, 0.1)
    }
  }),
  subMenuItem: (isActive) => ({
    pl: 4,
    color: isActive ? theme.palette.common.white : alpha(theme.palette.common.white, 0.7),
    backgroundColor: isActive ? alpha(theme.palette.common.white, 0.15) : 'transparent',
    '& .MuiListItemText-primary': {
      ...theme.components.MuiListItemText.styleOverrides.secondary
    }
  }),
  icon: (collapsed) => ({
    height: collapsed ? 40 : 'auto',
    alignItems: 'center',
    minWidth: collapsed ? 'auto' : 40,
    mr: collapsed ? 0 : 2,
    '& .MuiSvgIcon-root': {
      fontSize: collapsed ? '1.75rem' : '1.5rem',
      transition: theme.transitions.create('font-size', {
        duration: theme.transitions.duration.shorter
      })
    }
  }),
  expandIcon: {
    fontSize: '1.25rem'
  }
}); 