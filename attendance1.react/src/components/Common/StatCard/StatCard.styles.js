import { alpha } from '@mui/material/styles';

export const styles = {
  card: {
    p: 2,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      '& .actionWrapper': {
        opacity: 1,
        transform: 'translate(0, -50%)',
      }
    }
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },
  iconWrapper: (color) => ({
    p: 1.5,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (theme) => alpha(theme.palette[color].main, 0.1),
    color: (theme) => theme.palette[color].main
  }),
  icon: {
    fontSize: '2rem'
  },
  textContent: {
    flex: 1
  },
  title: {
    color: 'text.secondary',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  count: {
    mt: 1,
    fontWeight: 600,
    fontSize: '1.5rem'
  },
  actionWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    top: '70%',
    transform: 'translate(100%, -50%)',
    opacity: 0,
    transition: 'all 0.3s ease-in-out',
    className: 'actionWrapper'
  },
  actionText: (color) => ({
    marginRight: 1,
    fontWeight: 500,
    color: (theme) => theme.palette[color].main,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.75rem'
  }),
  actionButton: (color) => ({
    padding: 1,
    backgroundColor: (theme) => alpha(theme.palette[color].main, 0.1),
    color: (theme) => theme.palette[color].main,
    '& .MuiSvgIcon-root': {
        fontSize: '1rem'
    },
    '&:hover': {
      backgroundColor: (theme) => alpha(theme.palette[color].main, 0.2),
    }
  })
}; 