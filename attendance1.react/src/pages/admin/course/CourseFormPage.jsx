import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { 
  Loader, 
  PromptMessage, 
  TextButton 
} from '../../../components/Common';
import { CourseForm } from '../../../components/Admin';
import { 
    useCourseManagement, 
    useProgrammeManagement, 
    useUserManagement } from '../../../hooks/features';
import { useMessageContext } from '../../../contexts/MessageContext';
import { convertNumbersToDays, NUMBER_TO_DAY } from '../../../validations/schemas/courseValidation';

const CourseFormPage = () => {
  const { setPageTitle } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message, showSuccessMessage } = useMessageContext();
  const { 
    loading, 
    createCourse,
    updateCourse,
  } = useCourseManagement();

  const { programmeSelection, fetchProgrammeSelection } = useProgrammeManagement();
  const { lecturerSelection, fetchLecturerSelection } = useUserManagement();

  // get selected course from state (for edit)
  const selectedCourse = location.state?.course;

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
      ? await updateCourse(id, values)
      : await createCourse(values);

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

  return (
    <Box>
      {loading && <Loader />}
      
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
          courseCode: selectedCourse?.courseCode,
          courseName: selectedCourse?.courseName,
          sessionMonth: parseSession(selectedCourse?.courseSession).month,
          sessionYear: parseSession(selectedCourse?.courseSession).year,
          programmeId: selectedCourse?.programmeId,
          userId: selectedCourse?.lecturerUserId,
          classDays: selectedCourse?.classDay?.split(',').map(Number).map(num => NUMBER_TO_DAY[num]) || [],
          startDate: selectedCourse?.startDate,
          endDate: selectedCourse?.endDate,
          tutorials: selectedCourse?.tutorials?.map(t => ({
            id: t.tutorialId,
            name: t.tutorialName,
            classDay: NUMBER_TO_DAY[Number(t.classDay)]
          })) || []
        } : undefined}
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