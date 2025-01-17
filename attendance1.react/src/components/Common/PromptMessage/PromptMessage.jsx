import { useState, useEffect } from 'react';
import { Alert, IconButton, Grow, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styles } from './PromptMessage.styles';

const PromptMessage = ({ 
  open, 
  message, 
  severity = 'success', // error || success
  duration = 5000,
  fullWidth = false,    
  onClose
}) => {
  const [show, setShow] = useState(open);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setShow(open);
    setProgress(100);  // reset progress
  }, [open]);

  useEffect(() => {
    if (show && duration) {
      // set progress bar animation
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.max(0, 100 * (1 - elapsedTime / duration));
        
        if (newProgress === 0) {
          clearInterval(timer);
          handleClose();
        } else {
          setProgress(newProgress);
        }
      }, 10);

      return () => {
        clearInterval(timer);
      };
    }
  }, [show, duration]);

  const handleClose = () => {
    setShow(false);
    setProgress(0);
    onClose?.();
  };

  return (
    <Grow 
      in={show}
      timeout={{
        enter: 400,
        exit: 300
      }}
      style={styles.grow}
    >
      <div style={styles.container(fullWidth)}>
        <Alert
          severity={severity}
          sx={styles.alert(severity)}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={styles.progress(severity)}
          />
          {message}
        </Alert>
      </div>
    </Grow>
  );
};

export default PromptMessage; 