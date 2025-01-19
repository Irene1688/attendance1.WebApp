export const styles = (theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: 400
    }
  },

  dialogContent: {
    padding: theme.spacing(2, 3),
    paddingBottom: theme.spacing(1)
  },

  dialogActions: {
    padding: theme.spacing(2, 3),
    paddingTop: theme.spacing(1)
  },

  icon: (type) => ({
    fontSize: 40,
    marginBottom: theme.spacing(1),
    color: type === 'delete' 
      ? theme.palette.error.main
      : type === 'warning'
        ? theme.palette.warning.main
        : theme.palette.info.main
  }),

  title: {
    marginBottom: theme.spacing(1)
  },

  content: {
    color: theme.palette.text.secondary
  }
}); 