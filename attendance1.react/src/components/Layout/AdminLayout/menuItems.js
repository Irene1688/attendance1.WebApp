import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

export const adminMenuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: DashboardIcon
    },
    {
      title: 'Programmes',
      path: '/admin/programmes',
      icon: SchoolIcon
    },
    {
      title: 'Lecturers',
      path: '/admin/lecturers',
      icon: PersonIcon
    },
    {
      title: 'Student Management',
      path: '/admin/students',
      icon: PeopleAltIcon,
    },
    {
      title: 'Course Management',
      path: '/admin/courses',
      icon: AutoStoriesIcon,
      children: [
        {
          title: 'All Courses',
          path: '/admin/courses/list',
        },
        {
          title: 'Add Course',
          path: '/admin/courses/add',
        },
        {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
          {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
          {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
          {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
          {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
      ]
    },
    {
        title: 'Course Management',
        path: '/admin/courses',
        icon: AutoStoriesIcon,
        children: [
          {
            title: 'All Courses',
            path: '/admin/courses/list',
          },
          {
            title: 'Add Course',
            path: '/admin/courses/add',
          },
          {
              title: 'All Courses',
              path: '/admin/courses/list',
            },
            {
              title: 'All Courses',
              path: '/admin/courses/list',
            },
            {
              title: 'All Courses',
              path: '/admin/courses/list',
            },
            {
              title: 'All Courses',
              path: '/admin/courses/list',
            },
            {
              title: 'All Courses',
              path: '/admin/courses/list',
            },
        ]
      }
  ];