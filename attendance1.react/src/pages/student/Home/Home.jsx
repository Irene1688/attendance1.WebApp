import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { 
  AttendanceRecordList, 
  CheckInCard,
  WeeklyAttendanceCard 
} from '../../../components/Student';
import { styles } from './Home.styles';
import { useCourseById } from '../../../hooks/features/course/useCourseById';
import { useAttendanceManagement } from '../../../hooks/features/attendance/useAttendanceManagement';
import { useMessageContext } from '../../../contexts/MessageContext';
import { PromptMessage, Loader } from '../../../components/Common';
import { isTodayOnClass, isSameDay } from '../../../constants/courseConstant';
import { format } from 'date-fns';

const StudentHome = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { setPageTitle } = useOutletContext();
  const { user } = useSelector((state) => state.auth);
  const { loading: activeCoursesLoading, fetchActiveCoursesByStudentId } = useCourseById();
  const { loading: attendanceLoading, fetchAttendanceOfStudent, submitAttendance } = useAttendanceManagement();
  const { message, hideMessage, showSuccessMessage } = useMessageContext();
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setPageTitle('Home');
  }, [setPageTitle]);

  const loadRecentAttendance = useCallback(async () => {
    if (!user.campusId) return;
    const attendance = await fetchAttendanceOfStudent(user.campusId, 0, true);
    setRecentAttendance(attendance);
  }, [user.campusId]);

  useEffect(() => {
    loadRecentAttendance();
  }, [loadRecentAttendance]);

  // filter attendance records by selected date
  const filteredAttendance = useMemo(() => {
    return recentAttendance.filter(record => 
      isSameDay(new Date(record.date), selectedDate) && record.isPresent === true
    );
  }, [recentAttendance, selectedDate]);

  // handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // handle attendance submission
  const handleSubmitAttendance = async (attendanceCode) => {
    if (!attendanceCode) return;
    if (!user.campusId) return;

    const requestDto = {
      studentId: user.campusId,
      attendanceCode: attendanceCode
    };
    const success = await submitAttendance(requestDto);
    if (success) {
      loadRecentAttendance();
      showSuccessMessage("Attendance submitted successfully");
    }
  };

  if (activeCoursesLoading || attendanceLoading) 
    return <Loader />;

  return (
    <Box sx={themedStyles.root}>
      {message.show && (
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      <Box sx={themedStyles.header}>
        <Typography variant="h5" sx={themedStyles.headerTitle}>
          Welcome back, {user?.name || 'Student'}
        </Typography>
        <Typography variant="body1" sx={themedStyles.headerSubtitle}>
          {user?.campusId || ''}
        </Typography>
      </Box>

      <CheckInCard 
        onSubmit={handleSubmitAttendance}
        isLoading={attendanceLoading}
      />

      <WeeklyAttendanceCard
        records={recentAttendance}
        onDateSelect={handleDateSelect}
      />

      <AttendanceRecordList
        title={`Attendance Records (${format(selectedDate, 'dd MMM yyyy')})`}
        isLoading={attendanceLoading}
        records={filteredAttendance}
        emptyMessage="No attendance record for this date"
      />
    </Box>
  );
};

export default StudentHome; 