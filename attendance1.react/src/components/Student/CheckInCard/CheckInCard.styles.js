export const styles = (theme) => ({
  card: {
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    boxShadow: 'none'
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 3),
    '&:last-child': {
      paddingBottom: theme.spacing(4)
    }
  },

  icon: {
    fontSize: 38,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1)
  },

  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    textAlign: 'center'
  },

  subtitle: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },

  input: {
    marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      }
    }
  }
}); 