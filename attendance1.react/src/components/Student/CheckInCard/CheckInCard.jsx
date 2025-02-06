import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  TextField,
  Card,
  CardContent,
  useTheme 
} from '@mui/material';
import { TextButton, Loader } from '../../../components/Common';
import { useAttendanceManagement } from '../../../hooks/features';
import { styles } from './CheckInCard.styles';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const CheckInCard = ({
    onSubmit,
    isLoading
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = async () => {
    if (!code) {
      setError('Please enter attendance code');
      return;
    }

    if (code.length !== 6) {
      setError('Attendance code must be 6 digits');
      return;
    }

    await onSubmit(code);

    setCode('');
    setError('');
  };

  return (
    <Card sx={themedStyles.card}>
      <CardContent sx={themedStyles.cardContent}>
        <DriveFileRenameOutlineIcon sx={themedStyles.icon} />
        <Typography variant="h6" sx={themedStyles.title}>
          Enter Attendance Code
        </Typography>
        <Typography variant="body2" sx={themedStyles.subtitle}>
          Please enter the 6-digit code provided by your lecturer
        </Typography>

        {error && (
          <Typography variant="body2" sx={themedStyles.error}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter 6-digit code"
          variant="outlined"
          sx={themedStyles.input}
          inputProps={{
            maxLength: 6,
            style: { textAlign: 'center', fontSize: '1rem', letterSpacing: '0.3rem' }
          }}
        />

        <TextButton
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Checking in...' : 'Check In'}
        </TextButton>
      </CardContent>
    </Card>
  );
};

export default CheckInCard; 