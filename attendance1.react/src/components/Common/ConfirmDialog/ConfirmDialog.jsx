import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { styles } from './ConfirmDialog.styles';


const ConfirmDialog = ({ 
  open, 
  title, 
  content, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info' 
}) => {
  const { message, hideMessage } = useMessageContext();
  const theme = useTheme();
  const themedStyles = styles(theme);

  const Icon = type === 'delete' 
    ? DeleteIcon 
    : type === 'warning' 
      ? WarningIcon 
      : InfoIcon;

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
      sx={themedStyles.dialog}
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent 
        sx={{ ...themedStyles.dialogContent, textAlign: 'center' }}
      >
        {message.show && message.severity === 'error' && (
          <Box sx={{ mt: 2, mb: 0 }}>
            <PromptMessage
              open={true}
              message={message.text}
              duration={10000}
              severity={message.severity}
              fullWidth
              onClose={hideMessage}
              scrollToTop={false}
            />
          </Box>
        )}
        <Icon 
          sx={themedStyles.icon(type)}
        />
        <Typography variant="h6" sx={themedStyles.title}>
          {title}
        </Typography>
        <Typography variant="body1" sx={themedStyles.content}>
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={themedStyles.dialogActions}>
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
          color={type === 'delete' ? 'error' : 'primary'}
          autoFocus
        >
          {confirmText}
        </TextButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 