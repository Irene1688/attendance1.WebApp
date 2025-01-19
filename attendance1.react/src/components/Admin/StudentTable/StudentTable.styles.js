import { alpha } from '@mui/material/styles';

export const styles = (theme) => ({
  actionButton: {
    display: 'flex',
    gap: theme.spacing(1)
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

  bulkActionContainer: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1)
  }
}); 