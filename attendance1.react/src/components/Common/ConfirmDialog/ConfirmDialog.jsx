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
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
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
        >
          {confirmText}
        </TextButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 