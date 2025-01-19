export const styles = (theme) => ({
  container: {
    position: 'relative',
    minHeight: 200,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
  },

  table: {
    minHeight: 200,
  },

  pagination: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },

  tableBody: {
    '& .MuiTableRow-root:last-child td': {
      borderBottom: 'none'
    }
  }
}); 