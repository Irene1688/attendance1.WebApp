import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { AttendanceRecordList, ClassesList } from '../../../components/Student';
import { styles } from './Home.styles';
import { useCourseById } from '../../../hooks/features/course/useCourseById';
import { useAttendanceManagement } from '../../../hooks/features/attendance/useAttendanceManagement';
import { useMessageContext } from '../../../contexts/MessageContext';
import { PromptMessage, Loader } from '../../../components/Common';
import { isTodayOnClass } from '../../../constants/courseConstant';

const StudentHome = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { setPageTitle } = useOutletContext();
  const { user } = useSelector((state) => state.auth);
  const { loading: activeCoursesLoading, fetchActiveCoursesByStudentId } = useCourseById();
  const { loading: attendanceLoading, fetchAttendanceOfStudent } = useAttendanceManagement();
  const { message, hideMessage } = useMessageContext();
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    setPageTitle('Home');
  }, [setPageTitle]);

  const loadTodayCourses = useCallback(async () => {
    const courses = await fetchActiveCoursesByStudentId();
    setTodayClasses(courses?.filter(course => {
      // Check if the course is on today's class day
      const isOnClassDay = isTodayOnClass(course.onClassDay);
      // Mark the type as 'Lecture' if it's on class day
      const type = isOnClassDay ? 'Lecture' : course.tutorials?.some(tutorial => 
        isTodayOnClass(tutorial.classDay) ? 'Tutorial' : null
      );

      return isOnClassDay || type;
    }).map(course => ({
      ...course,
      type: isTodayOnClass(course.onClassDay) ? 'Lecture' : 
            course.tutorials?.some(tutorial => isTodayOnClass(tutorial.classDay)) ? 'Tutorial' : undefined
    })));
  }, []);

  useEffect(() => {
    loadTodayCourses();
  }, [loadTodayCourses]);

  const loadRecentAttendance = useCallback(async () => {
    if (!user.campusId) return;
    const attendance = await fetchAttendanceOfStudent(user.campusId);
    setRecentAttendance(attendance);
    console.log(attendance);
  }, [user.campusId]);

  useEffect(() => {
    loadRecentAttendance();
  }, [loadRecentAttendance]);

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
      
      <ClassesList
        title="Today's Classes"
        isLoading={activeCoursesLoading}
        classes={todayClasses}
        emptyMessage="No classes scheduled for today"
      />

      <AttendanceRecordList
        title="Recent Attendance"
        isLoading={attendanceLoading}
        records={recentAttendance}
      />
    </Box>
  );
};

export default StudentHome; 