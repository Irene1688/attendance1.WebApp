export const styles = {
  container: (fullWidth) => ({
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
  }),
  alert: (severity) => ({
    mb: 2,
    width: '100%',
    transform: 'translateY(0)',
    '& .MuiAlert-message': {
      color: (theme) => severity === 'error' 
        ? theme.palette.error.main 
        : theme.palette.success.main
    },
    '& .MuiAlert-icon': {
      color: (theme) => severity === 'error' 
        ? theme.palette.error.main 
        : theme.palette.success.main
    }
  }),
  progress: (severity) => ({
    position: 'absolute',
    top: 0,
    left: 1,
    right: 0,
    height: 3,
    backgroundColor: 'transparent',
    '& .MuiLinearProgress-bar': {
      backgroundColor: (theme) => severity === 'error' 
        ? theme.palette.error.main 
        : theme.palette.success.main
    }
  }),
  grow: {
    transformOrigin: 'center top'
  }
}; 