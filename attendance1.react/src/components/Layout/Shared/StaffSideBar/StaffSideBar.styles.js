import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  drawer: (open) => ({
    width: open ? 320 : 80,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    '& .MuiDrawer-paper': {
      width: open ? 320 : 80,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.primary.main,
      borderRight: 'none',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    '& .simplebar-scrollbar:before': {
      background: theme.palette.common.white,
    },
    '& .simplebar-track.simplebar-vertical': {
      width: 8,
    },
    '& .simplebar-track.simplebar-horizontal': {
      height: 8,
    },
    '& .simplebar-mask': {
      zIndex: 'inherit'
    }
  }),
  logoContainer: (open) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid',
    borderColor: alpha(theme.palette.common.white, 0.1),
    height: open ? 120 : 50,
    transition: theme.transitions.create(['width', 'height', 'display'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  }),
  logo: (open) => ({
    height:64,
    width: 'auto',
    display: open ? 'block' : 'none',
    transition: theme.transitions.create(['width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  }),
  menuTitle: (open) => ({
    color: alpha(theme.palette.common.white, 0.7),
    fontWeight: 'bold',
    display: open ? 'block' : 'none',
  }),
  menuContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    '& .MuiList-root': {
      padding: theme.spacing(1, 0)
    }
  },
  fixedBottomMenuContainer: {
    padding: theme.spacing(2),
    pt: theme.spacing(1),
    pb: theme.spacing(0.5),
    borderTop: '1px solid',
    borderColor: alpha(theme.palette.common.white, 0.1),
    '& .MuiList-root': {
      padding: theme.spacing(0)
    }
  }
}); 