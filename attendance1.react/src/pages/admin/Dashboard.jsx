import { useState, useEffect, useCallback } from 'react';
import { Grid, Box } from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { StatCard, PromptMessage, Loader } from '../../components/Common';
import { adminApi } from '../../api/admin';
import { useApiExecutor } from '../../hooks/useApiExecutor';
import { useMessage } from '../../hooks/useMessage';
const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    totalProgrammes: 0,
    totalLecturers: 0,
    totalStudents: 0,
    totalCourses: 0
  });

  const { message, hideMessage } = useMessage();
  const { loading, handleApiCall } = useApiExecutor();

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    await handleApiCall(
      () => adminApi.getAllTotalCount(),
      (data) => setCounts(data)
    );
  }, [handleApiCall]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Dashboard stats configuration
  const dashboardStats = [
    {
      title: "Total Programmes",
      count: counts.totalProgrammes,
      icon: ClassIcon,
      path: "/admin/programmes",
      color: "secondary"
    },
    {
      title: "Total Courses",
      count: counts.totalCourses,
      icon: AutoStoriesIcon,
      path: "/admin/courses",
      color: "success"
    },
    {
      title: "Total Lecturers",
      count: counts.totalLecturers,
      icon: PeopleAltIcon,
      path: "/admin/lecturers",
      color: "info"
    },
    {
      title: "Total Students",
      count: counts.totalStudents,
      icon: PeopleAltIcon,
      path: "/admin/students",
      color: "primary"
    },
  ];

  return (
    <Box>
      {/* {error && (
        <PromptMessage
          open={Boolean(error)}
          message={error}
          severity="error"
          fullWidth
          onClose={clearError}
          sx={{ mb: 2 }}
        />
      )} */}

      {loading && (
        <Loader message="Loading dashboard data..." />
      )}

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

      <Grid container spacing={3}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              path={stat.path}
              color={stat.color}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 