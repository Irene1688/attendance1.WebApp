import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation, useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import { 
  Loader, 
  PromptMessage, 
} from '../../../../components/Common';
import { CourseForm } from '../../../../components/Shared';
import { useCourseManagement, useCourseById } from '../../../../hooks/features';
import { useMessageContext } from '../../../../contexts/MessageContext';
import { NUMBER_TO_DAY } from '../../../../constants/courseConstant';
import { USER_ROLES } from '../../../../constants/userRoles';

const LecturerCourseFormPage = () => {
  const { setPageTitle } = useOutletContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { message, showSuccessMessage } = useMessageContext();
  const { loading: sideMenuReloading, course, fetchActiveCoursesMenuItems, fetchCourseById } = useCourseById();
  const { 
    loading: courseLoading,
    createCourse,
    updateCourse,
  } = useCourseManagement();

  const [selectedCourse, setSelectedCourse] = useState(null);

  // get selected course from state (for edit)
  useEffect(() => {
    setSelectedCourse(location.state?.course);
  }, [location.state?.course]);

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
  const loadCourse = useCallback(async () => {
    if (!id || selectedCourse) return;
    setSelectedCourse(await fetchCourseById(id));
  }, [id, selectedCourse]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    setPageTitle(id ? 'Edit Class' : 'Add New Class');
  }, [setPageTitle, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (id) {
      const success = await updateCourse(id, values, USER_ROLES.LECTURER)
      if (success) {
        await fetchActiveCoursesMenuItems();
        showSuccessMessage('Class updated successfully. Auto redirecting to class details.');
        setTimeout(() => {
          navigate(`/lecturer/classes/${id}`);
        }, 3000); 
      }
    } else {
      const newCourseId = await createCourse(values, USER_ROLES.LECTURER)
      if (newCourseId) {
        await fetchActiveCoursesMenuItems();
        showSuccessMessage('Class created successfully. Auto redirecting to class details.');
        setTimeout(() => {
          navigate(`/lecturer/classes/${newCourseId}`);
        }, 3000); 
      }
    }

    setSubmitting(false);
  };

  if (courseLoading || sideMenuReloading) return <Loader />;

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
          courseCode: selectedCourse?.courseCode,
          courseName: selectedCourse?.courseName,
          sessionMonth: parseSession(selectedCourse?.courseSession).month,
          sessionYear: parseSession(selectedCourse?.courseSession).year,
          programmeId: selectedCourse?.programmeId,
          userId: selectedCourse?.lecturerUserId,
          classDays: selectedCourse?.classDay?.split(',').map(Number).map(num => NUMBER_TO_DAY[num]) || [],
          startDate: selectedCourse?.startDate || selectedCourse?.semester?.startDate,
          endDate: selectedCourse?.endDate || selectedCourse?.semester?.endDate,
          tutorials: selectedCourse?.tutorials?.map(t => ({
            id: t.tutorialId,
            name: t.tutorialName,
            classDay: NUMBER_TO_DAY[Number(t.classDay)]
          })) || []
        } : undefined}
        userRole={USER_ROLES.LECTURER}
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
        isEditing={!!id}
      />
    </Box>
  );
};

export default LecturerCourseFormPage; 