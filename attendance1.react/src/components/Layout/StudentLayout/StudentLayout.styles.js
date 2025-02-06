export const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100vw',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1]
  },
  title: {
    flexGrow: 1,
    fontSize: '1.2rem',
    fontWeight: 500
  },
  profileButton: {
    padding: 0
  },
  avatar: {
    width: 32,
    height: 32
  },
  avatarIcon: {
    width: 32,
    height: 32,
    color: theme.palette.grey[600]
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingTop: `calc(${theme.spacing(7)} + ${theme.spacing(2)})`,
    paddingBottom: `calc(${theme.spacing(7)} + ${theme.spacing(2)})`,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
      paddingTop: `calc(${theme.spacing(8)} + ${theme.spacing(3)})`,
      paddingBottom: `calc(${theme.spacing(8)} + ${theme.spacing(3)})`
    }
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.appBar
  }
}); 