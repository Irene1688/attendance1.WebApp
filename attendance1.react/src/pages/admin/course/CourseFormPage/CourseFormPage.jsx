import { useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import { 
  Loader, 
  PromptMessage, 
} from '../../../../components/Common';
import { CourseForm } from '../../../../components/Shared';
import { 
    useCourseManagement, 
    useCourseById,
    useProgrammeManagement, 
    useUserManagement } from '../../../../hooks/features';
import { useMessageContext } from '../../../../contexts/MessageContext';
import { NUMBER_TO_DAY } from '../../../../constants/courseConstant';
import { USER_ROLES } from '../../../../constants/userRoles';

const CourseFormPage = () => {
  const { setPageTitle } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message, showSuccessMessage } = useMessageContext();
  const { 
    loading: submitFormLoading, 
    createCourse,
    updateCourse,
  } = useCourseManagement();
  const { loading: initialCourseLoading, fetchCourseById, course } = useCourseById();

  const { programmeSelection, fetchProgrammeSelection } = useProgrammeManagement();
  const { lecturerSelection, fetchLecturerSelection } = useUserManagement();

  // get selected course from state (for edit)
  //const selectedCourse = location.state?.course;
  const loadSelectedCourse = useCallback(async () => {
    await fetchCourseById(id);
  }, [id]);

  useEffect(() => {
    loadSelectedCourse();
  }, [loadSelectedCourse]);

  // seperate session from passed state (for edit)
  const parseSession = (courseSession) => {
    if (!courseSession) return { month: '', year: '' };
    const [month, year] = courseSession.split(' ');
    return {
      month: month,
      year: year
    };
  };

  // Initialize
  useEffect(() => {
    setPageTitle('Class Form');
  }, [setPageTitle]);

  useEffect(() => {
    let isMounted = true;

    fetchProgrammeSelection();
    fetchLecturerSelection();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const success = id 
      ? await updateCourse(id, values, USER_ROLES.ADMIN)
      : await createCourse(values, USER_ROLES.ADMIN);

    if (success) {
      showSuccessMessage(
        id 
        ? 'Class updated successfully. Auto redirecting to class list.' 
        : 'Class created successfully. Auto redirecting to class list.'
      );
      setTimeout(() => {
        navigate('/admin/courses');
      }, 3000); 
    }
    setSubmitting(false);
  };

  if (initialCourseLoading || submitFormLoading) 
    return <Loader />;

  return (
    <Box>      
    {message.show &&(
        <PromptMessage
          open={true}
          message={message.text}
          severity={message.severity}
          fullWidth
          sx={{ mb: 2 }}
        />
      )}

      <CourseForm
        initialValues={id ? {
          courseCode: course?.courseCode,
          courseName: course?.courseName,
          sessionMonth: parseSession(course?.courseSession).month,
          sessionYear: parseSession(course?.courseSession).year,
          programmeId: course?.programme.programmeId,
          userId: course?.lecturer.userId,
          classDays: course?.classDay?.split(',').map(Number).map(num => NUMBER_TO_DAY[num]) || [],
          startDate: course?.semester.startDate,
          endDate: course?.semester.endDate,
          tutorials: course?.tutorials?.map(t => ({
            id: t.tutorialId,
            name: t.tutorialName,
            classDay: NUMBER_TO_DAY[Number(t.classDay)]
          })) || []
        } : undefined}
        userRole={USER_ROLES.ADMIN}
        programmes={programmeSelection}
        lecturers={lecturerSelection}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/courses')}
        isEditing={!!id}
      />
    </Box>
  );
};

export default CourseFormPage; 