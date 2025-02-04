import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { TextButton, Loader } from '../../../components/Common';
import { styles } from './CodePage.styles';
import { useAttendanceManagement } from '../../../hooks/features';
import { useMessageContext } from '../../../contexts/MessageContext';

const CodePage = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const navigate = useNavigate();
  const location = useLocation();
  const attendanceCode = location.state.attendanceCode;
  const courseInfo = location.state.courseInfo;
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const { loading, markAbsentForUnattendedStudents } = useAttendanceManagement();
  const { showSuccessMessage } = useMessageContext();
  const [countdownStarted, setCountdownStarted] = useState(false);

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
    setTimeLeft(Math.ceil(remainingTime / 1000)); // convert to seconds
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

  // 处理倒计时结束
  const handleCountdownComplete = useCallback(async () => {
    // mark absent for unattended students
    const success = await markAbsentForUnattendedStudents(courseInfo.courseId, attendanceCode.codeId, attendanceCode.tutorialId);
    if (success) {
      showSuccessMessage('Attendance session completed');
    }
  }, [attendanceCode.codeId, courseInfo.courseId, attendanceCode.tutorialId, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) setCountdownStarted(true);
    if (countdownStarted && timeLeft === 0) handleCountdownComplete();
  }, [timeLeft, handleCountdownComplete, countdownStarted]);

  if (loading) return <Loader message="Processing attendance session..." />;

  return (
    <Box
      sx={themedStyles.container}
    >
        {/* Header */}
        <Box sx={themedStyles.header}>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.grey[600] }}>
                {courseInfo.courseCode} - {courseInfo.courseName}
            </Typography>
        </Box>

        <Divider sx={themedStyles.divider} />
      
        {/* Progress Bar */}
        <Box
          sx={themedStyles.progressBar(progress, timeLeft)}
        />

        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          Attendance Code
        </Typography>

        <Typography variant="h2" sx={themedStyles.code}>
          {attendanceCode.attendanceCode}
        </Typography>

        {/* Duration */}
        <Typography variant="h6" sx={themedStyles.duration}>
          {formatDuration(attendanceCode.startTime, attendanceCode.endTime)}
        </Typography>

        {/* Circular Progress */}
        <Box sx={{ position: 'relative', display: 'inline-flex', mt: 5, mb: 10 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={150}
            thickness={3}
            sx={themedStyles.circularProgress(timeLeft)}
          />
          <Box sx={themedStyles.circularProgressText(timeLeft)}>
            <Typography variant="h5" component="div" sx={themedStyles.circularProgressText(timeLeft)}>
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