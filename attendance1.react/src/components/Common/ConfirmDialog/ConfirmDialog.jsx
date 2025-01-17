import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography 
} from '@mui/material';
import { TextButton } from '../../Common';

const ConfirmDialog = ({ 
  open, 
  title, 
  content, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary' 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      disablePortal={false}
      keepMounted={false}
      disableEnforceFocus={false}
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <TextButton 
          onClick={onCancel}
          variant="text"
          color="cancel"
        >
          {cancelText}
        </TextButton>
        <TextButton 
          onClick={onConfirm}
          variant="contained"
          color={type === 'delete' ? 'delete' : 'primary'}
          autoFocus
        >
          {confirmText}
        </TextButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 