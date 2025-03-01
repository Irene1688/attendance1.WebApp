import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid,
  Dialog,
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';
import { useOutletContext } from 'react-router-dom';
import { Loader } from '../../../components/Common';
import { CourseCard } from '../../../components/Lecturer';
import { useCourseById } from '../../../hooks/features';
import { useAttendanceManagement } from '../../../hooks/features';
import { isTodayOnClass } from '../../../constants/courseConstant';
import PromptMessage from '../../../components/Common/PromptMessage/PromptMessage';
import { useMessageContext } from '../../../contexts/MessageContext';

const TakeAttendance = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { activeCourses, loading, fetchActiveCoursesByLecturerId } = useCourseById();
  const { generateAttendanceCode, revalidAttendanceCode } = useAttendanceManagement();
  const { message, hideMessage } = useMessageContext();

  useEffect(() => {
    setPageTitle('Take Attendance');
    fetchActiveCoursesByLecturerId();
  }, [setPageTitle]);

  // categorize courses
  const { todayClasses, otherClasses } = activeCourses?.reduce((acc, course) => {
    const isMainClassToday = isTodayOnClass(course.onClassDay);
    const hasTutorialToday = course.tutorials?.some(tutorial => 
      isTodayOnClass(tutorial.classDay)  
    );

    if (course && (isMainClassToday || hasTutorialToday)) {
      acc.todayClasses.push({
        ...course,
        isMainClassToday,
        tutorialsToday: course.tutorials?.filter(tutorial => 
          isTodayOnClass(tutorial.classDay)
        ) || []
      });
    } else if (course) {
      acc.otherClasses.push(course);
    }
    return acc;
  }, { todayClasses: [], otherClasses: [] }) || { todayClasses: [], otherClasses: [] };

  // render course card
  const renderCourseCard = (course) => (
    <Grid item xs={12} sm={4} md={3} key={course.courseId}>
      <CourseCard
        course={course}
        onTakeAttendance={handleTakeAttendance}
        onSelectExistedCode={handleSelectExistedCode}
      />
    </Grid>
  );

  const handleTakeAttendance = async (duration, selectedTutorialId, courseInfo) => {
    const requestDto = {
      courseId: courseInfo.courseId,
      duration,
      tutorialId: selectedTutorialId
    };
    const attendanceCode = await generateAttendanceCode(requestDto);
    if (attendanceCode) navigate(`/lecturer/codePage`, { state: { attendanceCode, courseInfo, mode: 'new' } });
  };

  const handleSelectExistedCode = async (recordId, duration, courseInfo) => {
    const attendanceCode = await revalidAttendanceCode(recordId, duration);
    if (attendanceCode) navigate(`/lecturer/codePage`, { state: { attendanceCode, courseInfo, mode: 'reuse' } });
  };

  

  if (loading) return <Loader />;

  return (
    <Box>
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

      {/* Today's Classes */}
      {todayClasses.length > 0 && (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
              Today's Classes
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {todayClasses.map(renderCourseCard)}
          </Grid>
        </>
      )}

      {/* Other Classes */}
      {otherClasses.length > 0 && (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
              Other Classes
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {otherClasses.map(renderCourseCard)}
          </Grid>
        </>
      )}     
    </Box>
  );
};

export default TakeAttendance; 