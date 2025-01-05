import { useState, useEffect } from 'react';
import { Alert, IconButton, Grow, LinearProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
      style={{
        transformOrigin: 'center top'
      }}
    >
      <div style={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}>
        <Alert
          severity={severity}
          sx={{
            mb: 2,
            width: '100%',
            transform: 'translateY(0)',
            '& .MuiAlert-message': {
              color: severity === 'error' ? 'error.main' : 'success.main'
            },
            '& .MuiAlert-icon': {
              color: severity === 'error' ? 'error.main' : 'success.main'
            }
          }}
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
            sx={{
                position: 'absolute',
                top: 0,
                left: 1,
                right: 0,
                height: 3,
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                backgroundColor: severity === 'error' 
                    ? 'error.main' 
                    : 'success.main',
                }
            }}
        />
          {message}
          
        </Alert>
        
      </div>
    </Grow>
  );
};

export default PromptMessage;