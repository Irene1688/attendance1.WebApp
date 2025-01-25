export const styles = (theme) => ({
  section: {
    marginBottom: theme.spacing(4)
  },

  sectionTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  },

  fieldGroup: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0
    }
  },

  field: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0
    }
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1)
  }
}); 