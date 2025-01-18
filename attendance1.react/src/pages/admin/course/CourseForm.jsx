import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { 
  Loader, 
  PromptMessage, 
  TextButton 
} from '../../../components/Common';
import { CourseForm } from '../../../components/Admin';
import { useCourseManagement } from '../../../hooks/features';
import { useMessageContext } from '../../../contexts/MessageContext';

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
    fetchProgrammes,
    fetchLecturers
  } = useCourseManagement();

  const [programmes, setProgrammes] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  // 加载课程详情（如果是编辑）
  useEffect(() => {
    const loadCourse = async () => {
      if (id) {
        await fetchCourseById(id);
      }
    };
    loadCourse();
  }, [id, fetchCourseById]);

  // 加载项目和讲师列表
  useEffect(() => {
    const loadData = async () => {
      const [programmeResult, lecturerResult] = await Promise.all([
        fetchProgrammes(),
        fetchLecturers()
      ]);
      setProgrammes(programmeResult?.data || []);
      setLecturers(lecturerResult?.data || []);
    };
    loadData();
  }, [fetchProgrammes, fetchLecturers]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const operation = id ? updateCourse : createCourse;
    const success = await operation(values);
    if (success) {
      showSuccessMessage(
        id ? 'Course updated successfully' : 'Course created successfully'
      );
      navigate('/admin/courses');
    }
    setSubmitting(false);
  };

  return (
    <Box sx={{ p: 3 }}>
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

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {id ? 'Edit Course' : 'Add New Course'}
        </Typography>
      </Box>

      <CourseForm
        initialValues={id ? {
          courseCode: selectedCourse?.courseCode,
          courseName: selectedCourse?.courseName,
          courseSession: selectedCourse?.courseSession,
          programmeId: selectedCourse?.programmeId,
          lecturerId: selectedCourse?.lecturerId,
          classDay: selectedCourse?.classDay,
          startDate: selectedCourse?.startDate,
          endDate: selectedCourse?.endDate,
          tutorials: selectedCourse?.tutorials?.map(t => ({
            id: t.tutorialId,
            name: t.tutorialName,
            classDay: t.classDay
          })) || []
        } : undefined}
        programmes={programmes}
        lecturers={lecturers}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/courses')}
        isEditing={!!id}
      />
    </Box>
  );
};

export default CourseFormPage; 