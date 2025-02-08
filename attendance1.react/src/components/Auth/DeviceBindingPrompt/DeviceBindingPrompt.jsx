import { Alert, Typography } from '@mui/material';

const DeviceBindingPrompt = ({ isFirstLogin }) => {
  if (!isFirstLogin) return null;

  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="body2">
        For security reasons, your account will be bound to this device. 
        You will only be able to login from this device in the future.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Please contact administrator if you need to change devices.
      </Typography>
    </Alert>
  );
};

export default DeviceBindingPrompt; 