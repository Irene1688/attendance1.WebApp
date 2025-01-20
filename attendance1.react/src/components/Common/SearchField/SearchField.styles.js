export const styles = (theme) => ({
  searchField: {
    width: '100%',
    marginBottom: 3,
    backgroundColor: 'transparent',
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main
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

  oadingIndicator: {
    color: theme.palette.primary.main
  }
}); 