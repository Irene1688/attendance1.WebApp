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
  const attendanceCode = location?.state?.attendanceCode;
  const courseInfo = location?.state?.courseInfo;
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const { loading, markAbsentForUnattendedStudents } = useAttendanceManagement();
  const { showSuccessMessage } = useMessageContext();
  const [countdownStarted, setCountdownStarted] = useState(false);

  //#region server
  const calculateTimes = () => {
    if (!attendanceCode) return { totalTime: 0, remainingTime: 0 };

    const now = new Date();
    // Function to correctly interpret time in local timezone
    const parseLocalTime = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const localDate = new Date();

        // Set time manually and prevent UTC conversion
        localDate.setHours(hours, minutes, seconds, 0);

        return localDate;
    };

    // Correctly parse times
    const endTime = parseLocalTime(attendanceCode.endTime);
    const startTime = parseLocalTime(attendanceCode.startTime);

    const totalTime = endTime.getTime() - startTime.getTime();
    const remainingTime = endTime.getTime() - now.getTime();

    return {
        totalTime,
        remainingTime: Math.max(0, remainingTime)
    };
  };


  // initialize the time left and progress
  useEffect(() => {
    if (!attendanceCode) navigate('/lecturer/take-attendance');

    const { remainingTime } = calculateTimes();
    
    // Prevent incorrect calculations from affecting UI
    const safeRemainingTime = Math.max(0, Math.ceil(remainingTime / 1000)); // Convert to seconds

    setTimeLeft(safeRemainingTime);
  }, [attendanceCode, navigate]);
  //#endregion

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

  // handle countdown complete, insert attendance records for unattended students
  const handleCountdownComplete = useCallback(async () => {
    if (!attendanceCode) return;
    // mark absent for unattended students
    const success = await markAbsentForUnattendedStudents(courseInfo.courseId, attendanceCode.codeId, attendanceCode.tutorialId);
    if (success) {
      showSuccessMessage('Attendance session completed');
    }
  }, [attendanceCode, timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) setCountdownStarted(true);
    if (countdownStarted && timeLeft === 0) handleCountdownComplete();
  }, [timeLeft, handleCountdownComplete, countdownStarted]);

  if (loading) return <Loader message="Processing attendance session..." />;

  return (
    <Box sx={themedStyles.container}>
        {/* Header */}
        <Box sx={themedStyles.header}>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.grey[600] }}>
                {courseInfo ? `${courseInfo.courseCode} - ${courseInfo.courseName}` : 'No course info'}
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
          { attendanceCode ? attendanceCode.attendanceCode : 'No attendance code'}
        </Typography>

        {/* Duration */}
        <Typography variant="h6" sx={themedStyles.duration}>
          {attendanceCode ? formatDuration(attendanceCode.startTime, attendanceCode.endTime) : 'No duration'}
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