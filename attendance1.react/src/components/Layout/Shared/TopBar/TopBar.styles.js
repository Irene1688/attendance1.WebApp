export const styles = {
  appBar: (open) => ({
    backgroundColor: 'common.white',
    color: 'grey.800',
    boxShadow: 1,
    zIndex: (theme) => theme.zIndex.drawer + 1,
    transition: (theme) =>
      theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    ...(open && {
      marginLeft: 250,
      width: `calc(100% - 250px)`,
      transition: (theme) =>
        theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    }),
  }),
  menuButton: {
    mr: 2,
    color: 'grey.600',
    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
    '&:hover': {
      color: 'primary.main'
    }
  },
  title: {
    flexGrow: 1,
    color: 'grey.900',
    fontWeight: 500
  }
}; 