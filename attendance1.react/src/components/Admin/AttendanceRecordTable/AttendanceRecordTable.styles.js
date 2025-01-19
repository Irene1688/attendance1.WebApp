export const styles = (theme) => ({
  attendanceRate: (rate) => ({
    color: rate >= 0.8 
      ? theme.palette.success.main 
      : rate >= 0.6 
        ? theme.palette.warning.main 
        : theme.palette.error.main
  }),

  typeCell: (isLecture) => ({
    color: isLecture 
      ? theme.palette.primary.main 
      : theme.palette.text.secondary
  }),

  countCell: {
    fontWeight: 500
  }
}); 