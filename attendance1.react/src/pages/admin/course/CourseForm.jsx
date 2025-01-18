import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { message, showSuccessMessage } = useMessageContext();
  const { 
    loading, 
    selectedCourse,
    createCourse,
    updateCourse,
    fetchCourseById,
  } = useCourseManagement();

  const { programmeSelection, fetchProgrammeSelection } = useProgrammeManagement();
  const { lecturerSelection, fetchLecturerSelection } = useUserManagement();

  // Initialize
  useEffect(() => {
    let isMounted = true;

    fetchProgrammeSelection();
    fetchLecturerSelection();

    return () => {
      isMounted = false;
    };
  }, []);

  // 加载课程详情（如果是编辑）
  useEffect(() => {
    const loadCourse = async () => {
      if (id) {
        await fetchCourseById(id);
      }
    };
    loadCourse();
  }, [id, fetchCourseById]);


  const handleSubmit = async (values, { setSubmitting }) => {
    const operation = id ? updateCourse : createCourse;
    const success = await operation(values);
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
      
      {message.show && message.severity === 'success' && (
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
          courseSession: selectedCourse?.courseSession,
          programmeId: selectedCourse?.programmeId,
          userId: selectedCourse?.userId,
          classDays: selectedCourse?.classDays ? convertNumbersToDays(selectedCourse.classDays) : [],
          startDate: selectedCourse?.startDate,
          endDate: selectedCourse?.endDate,
          tutorials: selectedCourse?.tutorials?.map(t => ({
            id: t.tutorialId,
            name: t.tutorialName,
            classDay: NUMBER_TO_DAY[t.classDay]
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