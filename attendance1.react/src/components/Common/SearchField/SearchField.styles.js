export const styles = {
  textField: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: (theme) => theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: (theme) => theme.palette.primary.main,
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: (theme) => theme.palette.primary.main,
    }
  }
}; 