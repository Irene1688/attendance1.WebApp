export const styles = (theme) => ({
    container: {
      position: 'relative',
      minHeight: 200,
      boxShadow: 'none',
      border: `1px solid ${theme.palette.divider}`,
      width: '100%',
      overflow: 'auto',
      '& .MuiTable-root': {
        borderCollapse: 'collapse',
        borderSpacing: 0,
      },
      '& .MuiTableCell-root': {
        borderRight: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        // '&:last-child': {
        //   borderRight: 'none'
        // }
      },
      '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
          backgroundColor: theme.palette.background.default,
          fontWeight: 600,
          borderBottom: `2px solid ${theme.palette.divider}`,
        },
        '& .MuiTableRow-root:first-of-type': {
          '& .MuiTableCell-root': {
            borderTop: `1px solid ${theme.palette.divider}`,
          }
        }
      },
      '& .week-column': {
        borderRight: `2px solid ${theme.palette.divider}`,
      },
      '& .base-column': {
        borderRight: `2px solid ${theme.palette.divider}`,
      }
    },
  
    table: {
      minHeight: 200,
      minWidth: 650,
    },
  
    tableBody: {
      '& .MuiTableRow-root:last-child td': {
        borderBottom: 'none'
      }
    }
  }); 