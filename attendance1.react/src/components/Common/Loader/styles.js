export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    zIndex: 9999,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
      zIndex: -1
    }
  },
  
  loaderBox: {
    bgcolor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 2,
    p: 3,
    boxShadow: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },

  spinner: {
    color: 'white.off'
  },

  message: {
    fontWeight: 500,
    letterSpacing: 0.5,
    color: 'white.off'
  }
}; 