export const styles = (theme) => ({
  searchField: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.divider
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main
      }
    }
  },

  searchIcon: {
    color: theme.palette.text.secondary
  },

  clearButton: {
    padding: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },

  loadingIndicator: {
    color: theme.palette.primary.main
  }
}); 