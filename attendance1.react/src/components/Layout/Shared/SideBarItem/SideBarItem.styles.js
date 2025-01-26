import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  menuItem: (isActive, collapsed) => ({
    mb: 0.5,
    py: 0.75,
    px: collapsed ? 1 : 2,
    mx: collapsed ? 0 : 0.5,
    borderRadius: 1,
    justifyContent: collapsed ? 'center' : 'flex-start',
    color: isActive ? theme.palette.common.white : alpha(theme.palette.common.white, 0.7),
    backgroundColor: isActive ? alpha(theme.palette.common.white, 0.15) : 'transparent',
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
    wordWrap: 'break-word',
    whiteSpace: 'normal', 
    overflow: 'hidden',    
    '& .MuiListItemText-primary': {
      ...theme.components.MuiListItemText.styleOverrides.secondary
    }
  }),
  icon: (collapsed) => ({
    height: collapsed ? 30 : 'auto',
    alignItems: 'center',
    minWidth: collapsed ? 'auto' : 40,
    mr: 0,
    '& .MuiSvgIcon-root': {
      fontSize: collapsed ? '1.3rem' : '1.25rem',
      transition: theme.transitions.create('font-size', {
        duration: theme.transitions.duration.shorter
      })
    },
  }),
  expandIcon: {
    fontSize: '1.25rem'
  }
}); 