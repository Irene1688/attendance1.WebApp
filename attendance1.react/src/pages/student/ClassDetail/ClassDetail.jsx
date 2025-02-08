import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Divider,
  useTheme,
  Grid,
} from '@mui/material';
import { Loader, PromptMessage, IconButton, EmptyState } from '../../../components/Common';
import { AttendanceRecordList } from '../../../components/Student';
import { useCourseById } from '../../../hooks/features';
import { useAttendanceManagement } from '../../../hooks/features';
import { useMessageContext } from '../../../contexts/MessageContext';
import { styles } from './ClassDetail.styles';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import { getAttendanceRateColor } from '../../../utils/helpers';
import { alpha } from '@mui/material/styles';

const ATTENDANCE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'lecture', label: 'Lecture' },
  { value: 'tutorial', label: 'Tutorial' }
];

const ClassDetail = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { id } = useParams();
  const { setPageTitle, setHideBottomNav } = useOutletContext();
  const { fetchEnrolledCourseDetailsWithEnrolledTutorial, course, loading: courseLoading } = useCourseById();
  const { fetchAttendanceOfStudent, studentAttendanceRecords, loading: attendanceRecordsLoading } = useAttendanceManagement();
  const { message, hideMessage } = useMessageContext();
  const [selectedTab, setSelectedTab] = useState('all');
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // load course
  const loadCourse = useCallback(async () => {
    if (!id) return;
    await fetchEnrolledCourseDetailsWithEnrolledTutorial(id);
  }, [id]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // load attendance records
  const loadAttendanceRecords = useCallback(async () => {
    if (!id || !user) return;
    await fetchAttendanceOfStudent(user?.campusId, id, false);
  }, [id]);

  useEffect(() => {
    loadAttendanceRecords();
  }, [loadAttendanceRecords]);


  // initialize page title
  useEffect(() => {
    if (course) {
        setPageTitle(`${course.courseCode} - ${course.courseName}`);
      }
  }, [course, setPageTitle]);

  // 设置隐藏底部导航
  useEffect(() => {
    setHideBottomNav(true);
    return () => setHideBottomNav(false);
  }, [setHideBottomNav]);

  const filteredAttendanceRecords = useMemo(() => {
    if (!studentAttendanceRecords) return [];
    if (selectedTab === 'all') return studentAttendanceRecords;
    if (selectedTab === 'lecture') {
      return studentAttendanceRecords.filter(record => 
        record.sessionName.toLowerCase() === 'lecture'
      );
    }
    return studentAttendanceRecords.filter(record => 
      record.sessionName.toLowerCase() !== 'lecture'
    );
  }, [studentAttendanceRecords, selectedTab]);

  const stats = useMemo(() => {
    if (!studentAttendanceRecords?.length) {
      return {
        attendanceRate: 0,
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        lectureAttendanceRate: 0,
        lecturePresentCount: 0,
        lectureAbsentCount: 0,
        tutorialAttendanceRate: 0,
        tutorialPresentCount: 0,
        tutorialAbsentCount: 0,
        lastAttendance: null
      };
    }

    const total = studentAttendanceRecords.length;
    const present = studentAttendanceRecords.filter(r => r.isPresent === true).length;
    const absent = studentAttendanceRecords.filter(r => r.isPresent === false).length;

    const lectures = studentAttendanceRecords.filter(r => r.sessionName === 'Lecture');
    const lecturePresent = lectures.filter(r => r.isPresent === true).length;
    const lectureAbsent = lectures.filter(r => r.isPresent === false).length;
    const lectureRate = lectures.length ? 
      (lecturePresent / lectures.length) * 100 : 0;

    const tutorials = studentAttendanceRecords.filter(r => r.sessionName !== 'Lecture');
    const tutorialPresent = tutorials.filter(r => r.isPresent === true).length;
    const tutorialAbsent = tutorials.filter(r => r.isPresent === false).length;
    const tutorialRate = tutorials.length ?
      (tutorialPresent / tutorials.length) * 100 : 0;

    const lastRecord = [...studentAttendanceRecords].sort((a, b) => 
      new Date(b.date) - new Date(a.date))[0];

    return {
      attendanceRate: (present / total) * 100,
      totalSessions: total,
      presentCount: present,
      absentCount: absent,
      lectureAttendanceRate: lectureRate,
      lectureTotalSessions: lectures.length,
      lecturePresentCount: lecturePresent,
      lectureAbsentCount: lectureAbsent,
      tutorialAttendanceRate: tutorialRate,
      tutorialTotalSessions: tutorials.length,
      tutorialPresentCount: tutorialPresent,
      tutorialAbsentCount: tutorialAbsent,
      lastAttendance: lastRecord
    };
  }, [studentAttendanceRecords]);

  if (courseLoading || attendanceRecordsLoading) return <Loader />;

  return (
    <Box sx={themedStyles.root}>
      {message.show && (
        <PromptMessage
          open={message.show}
          message={message.text}
          severity={message.severity}
          fullWidth
          onClose={hideMessage}
          sx={{ mb: 2 }}
        />
      )}

      <Card sx={themedStyles.card}>
        <CardContent>
          <Box sx={themedStyles.header}>
            <IconButton
              sx={themedStyles.backButton}
              onClick={() => navigate('/student/me')}
              Icon={<ArrowBackIcon />}/>
            <Box sx={themedStyles.courseTitle}>
              <Typography variant="h5" sx={themedStyles.courseCode}>
                {course?.courseCode}
              </Typography>
              <Typography variant="h6" sx={themedStyles.courseName}>
                {course?.courseName}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={themedStyles.infoContainer}>
            <Box sx={themedStyles.infoItem}>
              <PersonIcon sx={themedStyles.icon} />
              <Typography variant="body2">
                {course?.lecturerName}
              </Typography>
            </Box>

            <Box sx={themedStyles.infoItem}>
              <CalendarTodayIcon sx={themedStyles.icon} />
              <Typography variant="body2">
                {course?.courseSession}
              </Typography>
            </Box>

            <Box sx={themedStyles.infoItem}>
              <SchoolIcon sx={themedStyles.icon} />
              <Typography variant="body2">
                {course?.programmeName}
              </Typography>
            </Box>
          </Box>

          <Box sx={themedStyles.attendanceRate}>
            <Box>
              <Typography variant="subtitle1" sx={themedStyles.rateLabel}>
                Attendance Rate
              </Typography>
              <Typography 
                variant="h5" 
                sx={{
                  ...themedStyles.rateValue,
                  color: theme.palette[getAttendanceRateColor(stats.attendanceRate)].main
                }}
              >
                {stats.attendanceRate.toFixed(1)}%
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={themedStyles.divider} />
            <Box>
              <Typography variant="subtitle1" sx={themedStyles.rateLabel}>
                Total Class Sessions
              </Typography>
              <Typography variant="h5" sx={themedStyles.rateValue}>
                {stats.totalSessions}
              </Typography>
            </Box>
           
          </Box>
        </CardContent>
      </Card>

      {/* stats cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={themedStyles.statsCard}>
            <CardContent>
              <Box sx={themedStyles.statsHeader}>
                <EventAvailableIcon 
                  sx={{
                    ...themedStyles.statsIcon,
                    color: theme.palette[getAttendanceRateColor(stats.lectureAttendanceRate)].main,
                    backgroundColor: alpha(
                      theme.palette[getAttendanceRateColor(stats.lectureAttendanceRate)].main, 
                      0.1
                    )
                  }} 
                />
                <Typography variant="subtitle2">Lecture Rate</Typography>
              </Box>
              <Typography 
                variant="h5" 
                sx={{
                  ...themedStyles.statsValue,
                  color: theme.palette[getAttendanceRateColor(stats.lectureAttendanceRate)].main
                }}
              >
                {stats.lectureAttendanceRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present: {stats.lecturePresentCount} | Absent: {stats.lectureAbsentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sessions: {stats.lectureTotalSessions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={themedStyles.statsCard}>
            <CardContent>
              <Box sx={themedStyles.statsHeader}>
                <AssignmentTurnedInIcon 
                  sx={{
                    ...themedStyles.statsIcon,
                    color: theme.palette[getAttendanceRateColor(stats.tutorialAttendanceRate)].main,
                    backgroundColor: alpha(
                      theme.palette[getAttendanceRateColor(stats.tutorialAttendanceRate)].main, 
                      0.1
                    )
                  }} 
                />
                <Typography variant="subtitle2">Tutorial Rate</Typography>
              </Box>
              <Typography 
                variant="h5" 
                sx={{
                  ...themedStyles.statsValue,
                  color: theme.palette[getAttendanceRateColor(stats.tutorialAttendanceRate)].main
                }}
              >
                {stats.tutorialAttendanceRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present: {stats.tutorialPresentCount} | Absent: {stats.tutorialAbsentCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sessions: {stats.tutorialTotalSessions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={themedStyles.statsCard}>
            <CardContent>
              <Box sx={themedStyles.statsHeader}>
                <AccessTimeIcon sx={themedStyles.statsIcon} />
                <Typography variant="subtitle2">Last Attendance</Typography>
              </Box>
              <Typography variant="h6" sx={themedStyles.statsValue}>
                {stats.lastAttendance ? format(new Date(stats.lastAttendance.date), 'dd MMM') : '-'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: stats.lastAttendance?.isPresent ? 
                    theme.palette.success.main : 
                    theme.palette.error.main 
                }}
              >
                {stats.lastAttendance?.isPresent ? 'Present' : 'Absent' || 'No records'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={themedStyles.attendanceSection}>
        <Tabs 
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value)}
          sx={themedStyles.tabs}
        >
          {ATTENDANCE_TABS.map(tab => (
            <Tab 
              key={tab.value}
              value={tab.value}
              label={tab.label}
              sx={themedStyles.tab}
            />
          ))}
        </Tabs>

        <AttendanceRecordList
          records={filteredAttendanceRecords}
          emptyMessage={`No ${selectedTab} attendance records found`}
        />
      </Box>
    </Box>
  );
};

export default ClassDetail;