export const styles = (theme) => ({
  formContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
  },

  sectionTitle: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  },

  tutorialRow: {
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    '&:last-child': {
      marginBottom: 0
    }
  },

  deleteButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiIconButton-root': {
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.dark
      }
    }
  },

  addButton: {
    marginTop: theme.spacing(2),
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
    borderTop: `1px solid ${theme.palette.divider}`
  }
}); 