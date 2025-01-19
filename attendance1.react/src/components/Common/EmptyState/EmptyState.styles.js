export const styles = (theme) => ({
  container: {
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: theme.palette.background.default
  },

  icon: {
    fontSize: 48,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2)
  },

  title: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: 500
  },

  message: {
    color: theme.palette.text.secondary
  },

  tableCell: {
    border: 'none'
  }
}); 