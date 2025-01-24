export const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    bgcolor: theme.palette.background.default,
    p: 0
  },
  header: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    px: 3,
    mb: 2
  },
  divider: {
    width: '100%',
    mb: 5
  },
  progressBar: (progress, timeLeft) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    width: `${progress}%`,
    backgroundColor: timeLeft <= 5 ? theme.palette.error.main : theme.palette.primary.main,
    transition: 'width 1s linear, background-color 0.3s ease'
  }),
  code: {
    color: theme.palette.primary.main,
    letterSpacing: 8,
    fontSize: '4rem',
    fontWeight: 'bold',
    mb: 3
  },
  duration: {
    color: theme.palette.text.disabled,
    fontWeight: 'bold',
    mb: 2
  },
  circularProgress: (timeLeft) => ({
    color: timeLeft <= 5 ? theme.palette.error.main : theme.palette.primary.main,
    transition: 'color 0.3s ease'
  }),
  circularProgressText: (timeLeft) => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: timeLeft === 0 ? theme.palette.error.main : theme.palette.text.secondary
  })
});