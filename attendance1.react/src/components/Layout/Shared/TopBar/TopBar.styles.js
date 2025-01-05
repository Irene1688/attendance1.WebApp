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
      marginLeft: 320,
      width: `calc(100% - 320px)`,
      transition: (theme) =>
        theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    }),
  }),
  menuButton: {
    marginRight: (theme) => theme.spacing(5),
    color: 'grey.600',
    '& .MuiSvgIcon-root': {
      fontSize: '1.7rem',
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