import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';

export const lecturerBaseMenuItems = [
  {
    title: 'Take Attendance',
    path: '/lecturer/take-attendance',
    icon: DashboardIcon
  },
  {
    title: 'Add Class',
    path: '/lecturer/classes/add',
    icon: AddIcon
  },
  {
    title: 'Active Classes',
    path: '/lecturer/classes',
    icon: ClassIcon,
    children: [] 
  }
];

export const generateLecturerClassMenuItems = (courses = []) => {
  const baseItems = [...lecturerBaseMenuItems];
  
  // find 'active classes' menu item
  const activeClassesItem = baseItems.find(item => item.title === 'Active Classes');
  if (activeClassesItem && courses?.length > 0) {
    activeClassesItem.children = courses.map(course => ({
      title: `${course.name}`,
      path: `/lecturer/classes/${course.id}`,
    }));
  }

  return baseItems;
};

