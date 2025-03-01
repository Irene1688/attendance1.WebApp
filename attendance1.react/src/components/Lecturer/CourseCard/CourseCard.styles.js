import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  card: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    border: '2px solid', 
    borderColor: theme.palette.grey[300], 
    borderRadius: 0.7,
    py: theme.spacing(0),
    px: theme.spacing(1),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
      '& .actionWrapper': {
        opacity: 1,
        transform: 'translate(0, -50%)',
      }
    }
  },
  courseCode: {
    fontWeight: 600,
    marginBottom: 1,
    color: theme.palette.info.main
  },
  courseName: {
    marginBottom: theme.spacing(3),
    color: theme.palette.grey[600]
  },
  actionWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    bottom: '0%',
    transform: 'translate(100%, -50%)',
    opacity: 0,
    transition: 'all 0.3s ease-in-out',
    className: 'actionWrapper'
  },
  actionText: {
    marginRight: 1,
    fontWeight: 500,
    color: theme.palette.secondary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.75rem'
  },
  actionButton: {
    padding: 1,
    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    color: theme.palette.secondary.main,
    '& .MuiSvgIcon-root': {
        fontSize: '1rem'
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
    }
  }
}); 