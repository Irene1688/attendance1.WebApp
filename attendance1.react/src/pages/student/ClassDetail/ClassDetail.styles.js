import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3)
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },

  backButton: {
    padding: theme.spacing(0),
    marginRight: theme.spacing(1.2)
  },

  courseTitle: {
    display: 'flex',
    flexDirection: 'column',
  },

  card: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    boxShadow: 'none'
  },

  courseCode: {
    fontWeight: 600,
    color: theme.palette.text.info,
    marginBottom: theme.spacing(0)
  },

  courseName: {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3)
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary
  },

  icon: {
    fontSize: '1.2rem'
  },

  attendanceRate: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: theme.spacing(1),
    padding: theme.spacing(3, 5),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: theme.shape.borderRadius
  },

  rateLabel: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    fontWeight: 500
  },

  rateValue: {
    color: theme.palette.primary.main,
    textAlign: 'center',
    fontWeight: 700
  },

  divider: {
    borderColor: theme.palette.grey[300]
  },

  attendanceSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
  },

  tabs: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main
    }
  },

  tab: {
    textTransform: 'none',
    fontWeight: 500,
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  },

  statsCard: {
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    boxShadow: 'none',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[2]
    }
  },

  statsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },

  statsIcon: {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    padding: theme.spacing(0.5),
    borderRadius: '50%'
  },

  statsValue: {
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5)
  },
});