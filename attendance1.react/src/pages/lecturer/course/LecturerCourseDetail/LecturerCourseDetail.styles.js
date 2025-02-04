export const styles = (theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },

  backButton: {
    color: theme.palette.text.secondary
  },

  section: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 1,
    boxShadow: theme.shadows[1]
  },

  sectionTitle: {
    marginBottom: theme.spacing(3),
    fontWeight: 500,
    color: theme.palette.primary.main
  },

  infoItem: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0
    }
  },

  promptMessage: {
    color: theme.palette.text.info,
    fontStyle: 'italic',
  }
}); 