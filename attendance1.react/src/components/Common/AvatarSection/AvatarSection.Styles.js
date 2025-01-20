export const styles = (theme) => ({
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },

  avatar: {
    width: 100,
    height: 100,
    fontSize: '2.5rem',
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  
  userName: {
    marginBottom: theme.spacing(0.5)
  }
})