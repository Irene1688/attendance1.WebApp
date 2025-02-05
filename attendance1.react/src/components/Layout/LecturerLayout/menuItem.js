import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import AddIcon from '@mui/icons-material/Add';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

export const lecturerBaseMenuItems = [
  {
    title: 'Take Attendance',
    path: '/lecturer/take-attendance',
    icon: DashboardIcon
  },
  {
    title: 'Add Class',
    path: '/lecturer/add-class',
    icon: AddIcon
  },
  {
    title: 'Active Classes',
    path: '/lecturer/classes',
    icon: ClassIcon,
    children: [] 
  },
  {
    title: 'All Classes',
    path: '/lecturer/all-classes',
    icon: CollectionsBookmarkIcon,
  }
];

export const generateLecturerClassMenuItems = (courses = []) => {
  const baseItems = [...lecturerBaseMenuItems];
  
  // find 'active classes' menu item
  const activeClassesItem = baseItems.find(item => item.title === 'Active Classes');
  if (activeClassesItem && courses?.length > 0) {
    activeClassesItem.title = `Active Classes (${courses.length})`;
    activeClassesItem.children = courses.map(course => ({
      title: `${course.name}`,
      path: `/lecturer/classes/${course.id}`,
    }));
  }

  return baseItems;
};

