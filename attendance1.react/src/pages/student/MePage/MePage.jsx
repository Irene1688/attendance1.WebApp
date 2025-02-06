import { Box, Typography, ListItemText, ListItem, ListItemIcon, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ClassIcon from '@mui/icons-material/Class';
import { AvatarSection, ListCard, Loader, PromptMessage } from '../../../components/Common';
import { useCourseById } from '../../../hooks/features';
import { useMessageContext } from '../../../contexts/MessageContext';
import { styles } from './MePage.styles';

const MePage = () => {
  const { user } = useSelector(state => state.auth);
  const theme = useTheme();
  const themedStyles = styles(theme);
  const navigate = useNavigate();
  const { setPageTitle } = useOutletContext();
  const { message, hideMessage } = useMessageContext();
  const { fetchEnrolledCoursesSelectionByStudentId, loading: enrolledCoursesLoading } = useCourseById();
  const [activeCourses, setActiveCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);

  useEffect(() => {
    setPageTitle('Me');
  }, [setPageTitle]);

  const loadCourses = useCallback(async () => {
    const courses = await fetchEnrolledCoursesSelectionByStudentId();
    setActiveCourses(courses.filter(course => course.isActive));
    setArchivedCourses(courses.filter(course => !course.isActive));
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const renderMenu = (item) => (
    <ListItem sx={themedStyles.menuItem}>
      <ListItemIcon>
        {item.icon}
      </ListItemIcon>
      <ListItemText>
        <Box sx={themedStyles.cardItemTitle} onClick={() => navigate(item.path)}>
          <Typography variant="body1" sx={themedStyles.menuTitle}>
              {item.title}
          </Typography>
          <KeyboardArrowRightIcon />
        </Box> 
      </ListItemText>
    </ListItem>
  );

  if (enrolledCoursesLoading) {
    return <Loader />;
  }

  return (
    <>
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
      <Box sx={themedStyles.avatarSection}>
        <AvatarSection name={user?.name} campusId={user?.campusId} />
      </Box>

      <ListCard 
        title="Profile"
        isLoading={false}
        items={[{ id: 1, title: 'Profile', icon: <PersonIcon />, path: '/student/profile' }]}
        renderItem={renderMenu}
        emptyMessage="No profile data available"
        sx={{ mb: 2 }}
      />
      
      <ListCard 
        title="Active Classes"
        isLoading={false}
        items={activeCourses.map(course => ({ 
            ...course, 
            id: course.courseId, 
            title: `${course.courseCode} - ${course.courseName}`,
            icon: <ClassIcon />,
            path: `/student/classes/${course.courseId}`
        }))}
        renderItem={renderMenu}
        emptyMessage="No active classes"
        sx={{ mb: 2 }}
      />

      {
        archivedCourses.length > 0 && (
          <ListCard 
            title="Archived Classes"
            isLoading={false}
            items={archivedCourses.map(course => ({ 
                ...course, 
                id: course.courseId,
                title: `${course.courseCode} - ${course.courseName}`,
                icon: <ClassIcon />,
                path: `/student/classes/${course.courseId}`
            }))}
            renderItem={renderMenu}
            emptyMessage="No archived classes"
          />
        )
      }
    </>
  )
}

export default MePage;