import { useState, useEffect, useCallback } from 'react';
import { Grid, Box } from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { StatCard, PromptMessage, Loader } from '../../components/Common';
import { adminApi } from '../../api/admin';

const AdminDashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState({
    counts: {
      totalProgrammes: 0,
      totalLecturers: 0,
      totalStudents: 0,
      totalCourses: 0
    },
    loading: true,
    error: ''
  });

  // Destructure state for easier access
  const { counts, loading, error } = dashboardData;

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await adminApi.getAllTotalCount();
      if (!response.success) {
        throw new Error(response.errorMessage || 'Failed to fetch dashboard data');
      }
      setDashboardData(prev => ({
        ...prev,
        counts: response.data,
        error: ''
      }));
    } catch (err) {
      setDashboardData(prev => ({
        ...prev,
        error: err.message || 'An error occurred while fetching dashboard data'
      }));
    } finally {
      setDashboardData(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
      {/* Error Message */}
      {error && (
        <PromptMessage
          open={Boolean(error)}
          message={error}
          severity="error"
          fullWidth
          onClose={() => setDashboardData(prev => ({ ...prev, error: '' }))}
          sx={{ mb: 2 }}
        />
      )}

      {loading && (
        <Loader 
          message="Loading dashboard data..."
        />
      )}

      {/* Stats Grid */}
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