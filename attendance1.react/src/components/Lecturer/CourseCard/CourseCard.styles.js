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
      boxShadow: theme.shadows[4]
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
  dialogHeader: {
    backgroundColor: theme.palette.primary.light,
    px: theme.spacing(3),
    py: theme.spacing(1.5),
  },
  dialogHeaderText: {
    color: theme.palette.white.dark,
    fontWeight: 600
  },
  radioLabel: {
    color: theme.palette.grey[600],
    marginRight: theme.spacing(8)
  }
}); 