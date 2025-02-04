export const styles = (theme) => ({
  dialogContent: {
    padding: theme.spacing(2, 3),
    paddingBottom: theme.spacing(1)
  },

  dialogActions: {
    padding: theme.spacing(2, 3),
    paddingTop: theme.spacing(1)
  },

  pickerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },

  promptMessage: {
    fontStyle: 'italic',
    color: theme.palette.text.info,
    marginBottom: theme.spacing(2)
  }
}); 