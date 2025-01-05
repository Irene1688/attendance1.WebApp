import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export const adminMenuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: DashboardIcon
    },
    {
      title: 'Programme Management',
      path: '/admin/programmes',
      icon: ClassIcon,
    },
    {
      title: 'Lecturer Management',
      path: '/admin/lecturers',
      icon: PeopleAltIcon,
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