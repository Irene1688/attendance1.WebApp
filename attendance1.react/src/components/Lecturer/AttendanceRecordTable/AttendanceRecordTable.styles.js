export const styles = (theme) => ({
  typeCell: (isLecture) => ({
    color: isLecture 
      ? theme.palette.primary.main 
      : theme.palette.text.secondary,
    fontWeight: isLecture ? 500 : 400
  }),

  countCell: {
    fontWeight: 500,
    textAlign: 'center'
  },

  tabs: {
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },

  tableContainer: {
    marginTop: theme.spacing(2)
  },

  tableTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 500,
    color: theme.palette.text.secondary
  },

  presentChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.white.main,
    fontWeight: 500,
    fontSize: '0.75rem'
  },

  absentChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.white.main,
    fontWeight: 500,
    fontSize: '0.75rem'
  },

  attendanceRate: (rate) => ({
    color: rate >= 80 
      ? theme.palette.success.main 
      : rate >= 60 
        ? theme.palette.warning.main 
        : theme.palette.error.main,
    fontWeight: 500
  })
}); 