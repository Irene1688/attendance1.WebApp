import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  Box
} from '@mui/material';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';


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
  const { message, hideMessage } = useMessageContext();
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
        {message.show && message.severity === 'error' && (
          <Box sx={{ mt: 2, mb: 0 }}>
            <PromptMessage
              open={true}
              message={message.text}
              duration={10000}
              severity={message.severity}
              fullWidth
              onClose={hideMessage}
            />
          </Box>
        )}
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