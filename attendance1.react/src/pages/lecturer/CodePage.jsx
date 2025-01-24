import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { TextButton } from '../../components/Common';

const CodePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const attendanceCode = location.state.attendanceCode;
  const courseInfo = location.state.courseInfo;
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  
  // calculate the total time and remaining time
  const calculateTimes = () => {
    if (!attendanceCode) return { totalTime: 0, remainingTime: 0 };

    const now = new Date();
    const endTime = new Date(`${new Date().toDateString()} ${attendanceCode.endTime}`);
    const startTime = new Date(`${new Date().toDateString()} ${attendanceCode.startTime}`);
    
    const totalTime = endTime - startTime;
    const remainingTime = endTime - now;

    return {
      totalTime,
      remainingTime: Math.max(0, remainingTime)
    };
  };

  // initialize the time left and progress
  useEffect(() => {
    if (!attendanceCode) navigate('/lecturer/take-attendance');

    const { remainingTime } = calculateTimes();
    setTimeLeft(Math.ceil(remainingTime / 1000)); // 转换为秒
  }, [attendanceCode, navigate]);

  // countdown effect
  useEffect(() => {
    if (!timeLeft || !attendanceCode) return;

    const { totalTime } = calculateTimes();
    const totalSeconds = Math.ceil(totalTime / 1000);

    const timer = setInterval(() => {
      const { remainingTime } = calculateTimes();
      const remainingSeconds = Math.ceil(remainingTime / 1000);

      if (remainingSeconds <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setProgress(0);
        return;
      }

      setTimeLeft(remainingSeconds);
      setProgress((remainingSeconds / totalSeconds) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, attendanceCode, navigate]);

  const handleBack = () => {
    navigate('/lecturer/take-attendance');
  };

  // format the time display
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return 'Expired';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // format the duration display
  const formatDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const duration = end - start;

    const totalSeconds = Math.floor(duration / 1000);
    return `${totalSeconds} sec`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        p: 0
      }}
    >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', px: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.grey[600] }}>
                {courseInfo.courseCode} - {courseInfo.courseName}
            </Typography>
        </Box>

        <Divider sx={{ width: '100%', mb: 5 }} />
      
        {/* Progress Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 4,
            width: `${progress}%`,
            backgroundColor: timeLeft <= 5 ? theme.palette.error.main : theme.palette.primary.main,
            transition: 'width 1s linear, background-color 0.3s ease'
          }}
        />

        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          Attendance Code
        </Typography>

        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            letterSpacing: 8,
            mb: 3
          }}
        >
          {attendanceCode.attendanceCode}
        </Typography>

        {/* Duration */}
        <Typography 
          variant="h6" 
          sx={{ 
              color: theme.palette.text.disabled,
              fontWeight: 'bold',
              mb: 2
          }}
        >
          {formatDuration(attendanceCode.startTime, attendanceCode.endTime)}
        </Typography>

        {/* Circular Progress */}
        <Box sx={{ position: 'relative', display: 'inline-flex', mt: 5, mb: 10 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={150}
            thickness={3}
            sx={{
              color: timeLeft <= 5 ? theme.palette.error.main : theme.palette.primary.main,
              transition: 'color 0.3s ease'
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" component="div" sx={{ color: timeLeft === 0 ? theme.palette.error.main : theme.palette.text.secondary }}>
              {formatTimeLeft(timeLeft)}
            </Typography>
          </Box>
        </Box>

        <TextButton
          onClick={handleBack}
          variant="contained"
          fullWidth={false}
        >
          Back
        </TextButton>
    </Box>
  );
};

export default CodePage; 