import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  tableContainer: {
    position: 'relative',
    minHeight: 200
  },
  
  statusChip: (status) => ({
    backgroundColor: status === 'ACTIVE' 
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.grey[500], 0.1),
    color: status === 'ACTIVE' 
      ? theme.palette.success.main 
      : theme.palette.grey[500],
    fontWeight: 600
  }),

  actionButton: {
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },

  bulkActionContainer: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1)
  }
}); 