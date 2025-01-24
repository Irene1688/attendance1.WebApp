import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid,
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { Loader, EmptyState } from '../../components/Common';
import { CourseCard } from '../../components/Lecturer';
import { useCourseById } from '../../hooks/features';
import { useAttendanceManagement } from '../../hooks/features';
import { isToday } from '../../utils/dateHelpers';
import PromptMessage from '../../components/Common/PromptMessage/PromptMessage';
import { useMessageContext } from '../../contexts/MessageContext';


const TakeAttendance = () => {
  const { setPageTitle } = useOutletContext();
  const navigate = useNavigate();
  const { activeCourses, loading, fetchActiveCourses } = useCourseById();
  const { generateAttendanceCode } = useAttendanceManagement();
  const { message, hideMessage } = useMessageContext();

  useEffect(() => {
    setPageTitle('Take Attendance');
    fetchActiveCourses();
  }, [setPageTitle]);

  const handleTakeAttendance = async (duration, selectedTutorialId, courseInfo) => {
    const requestDto = {
      courseId: courseInfo.courseId,
      duration,
      tutorialId: selectedTutorialId
    };
    const attendanceCode = await generateAttendanceCode(requestDto);
    if (attendanceCode) navigate(`/lecturer/codePage`, { state: { attendanceCode, courseInfo } });
  };

  // categorize courses
  const { todayClasses, otherClasses } = activeCourses?.reduce((acc, course) => {
    if (course && isToday(course.classDay)) {
      acc.todayClasses.push(course);
    } else if (course) {
      acc.otherClasses.push(course);
    }
    return acc;
  }, { todayClasses: [], otherClasses: [] }) || { todayClasses: [], otherClasses: [] };

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
      <Box sx={{ mb: 1 }}>
        <Typography variant="overline" sx={{ fontWeight: 'bold' }}>
            Today's Classes
        </Typography>
      </Box>
      {todayClasses.length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {todayClasses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard
                course={course}
                onTakeAttendance={handleTakeAttendance}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="No Classes Today"
          message="You don't have any classes scheduled for today."
        />
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
            {otherClasses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard
                  course={course}
                  onTakeAttendance={handleTakeAttendance}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default TakeAttendance; 