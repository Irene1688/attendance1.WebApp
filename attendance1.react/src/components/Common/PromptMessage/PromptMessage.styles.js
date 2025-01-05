export const styles = {
  container: {
    width: (fullWidth) => fullWidth ? '100%' : 'auto',
    position: 'relative'
  },
  alert: {
    mb: 2,
    width: '100%',
    transform: 'translateY(0)',
    '& .MuiAlert-message': {
      color: (severity) => severity === 'error' ? 'error.main' : 'success.main'
    },
    '& .MuiAlert-icon': {
      color: (severity) => severity === 'error' ? 'error.main' : 'success.main'
    }
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
    '& .MuiLinearProgress-bar': {
      backgroundColor: (severity) => 
        severity === 'error' ? 'error.main' : 'success.main',
    }
  },
  grow: {
    transformOrigin: 'center top'
  }
}; 