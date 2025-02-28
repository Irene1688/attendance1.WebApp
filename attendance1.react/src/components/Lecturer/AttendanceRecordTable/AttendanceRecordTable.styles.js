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
    marginTop: theme.spacing(2),
    overflow: 'auto',
    position: 'relative',
    '& .MuiTableContainer-root': {
      overflow: 'auto',
    },
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: 0,
    }
  },

  tableTitle: {
    fontWeight: 600,
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
  }),

  fixedCell: {
    position: 'sticky',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    borderLeft: `1px solid ${theme.palette.divider}`,
  },

  statusButton: (isPresent) => ({
    padding: theme.spacing(0.5),
    color: isPresent ? theme.palette.success.main : theme.palette.error.main,
    '&:hover': {
      backgroundColor: 'transparent',
      opacity: 0.8
    },
  }),

  presentIcon: {
    color: theme.palette.success.main,
    fontSize: '1.5rem'
  },

  absentIcon: {
    color: theme.palette.error.main,
    fontSize: '1.5rem'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },

  printButton: {
    marginLeft: 'auto'
  },

  '@media print': {
    tableContainer: {
      margin: 0,
      padding: 0,
      boxShadow: 'none'
    },
    printHide: {
      display: 'none !important'
    }
  },

  tabsContainer: {
    flex: 1
  },

  deleteButton: {
    marginLeft: 'auto',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&:hover': {
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main,
    }
  },

  infoText: {
    color: theme.palette.text.info,
    fontStyle: 'italic',
    marginBottom: theme.spacing(2)
  }
}); 