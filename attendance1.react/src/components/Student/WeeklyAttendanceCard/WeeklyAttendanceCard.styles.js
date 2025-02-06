import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    width: '100%',
  },

  title: {
    fontWeight: 600,
    color: theme.palette.text.disabled,
    textAlign: 'left',
  },

  cardContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    height: '102px',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    overflowX: 'auto',
    pb: theme.spacing(1),
    '&::-webkit-scrollbar': {
      height: 0
    },
    '&::-webkit-scrollbar-track': {
      //backgroundColor: alpha(theme.palette.primary.main, 0.1),
      backgroundColor: 'transparent',
      borderRadius: 3
    },
    '&::-webkit-scrollbar-thumb': {
      //backgroundColor: theme.palette.primary.main,
      backgroundColor: 'transparent',
      borderRadius: 3
    }
  },

  card: (isSelected, isToday) => ({
    flex: '1 0 auto',
    width: 60,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${isSelected 
      ? theme.palette.primary.main 
      : isToday
        ? alpha(theme.palette.primary.main, 0.5)
        : theme.palette.divider}`,
    backgroundColor: isSelected 
      ? alpha(theme.palette.primary.main, 0.1)
      : 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: 'translateY(-2px)'
    }
  }),

  cardContent: {
    padding: theme.spacing(2, 0.5),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.5)
  },

  dayNumber: {
    fontWeight: 700,
    color: theme.palette.primary.main
  },

  weekday: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase'
  }
}); 