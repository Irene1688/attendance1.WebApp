import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { StaffSideBar, TopBar } from '../Shared';
import { formatPageTitle } from '../../../utils/helpers';
import { generateLecturerClassMenuItems, lecturerBaseMenuItems } from './menuItem';
import { useCourseById } from '../../../hooks/features';

const LecturerLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState('');
  const { courseMenuItems, loading, fetchActiveCoursesMenuItems } = useCourseById();
  const [menuItems, setMenuItems] = useState(lecturerBaseMenuItems);

  useEffect(() => {
    let isMounted = true;
    fetchActiveCoursesMenuItems();
    return () => {
      isMounted = false;
    };
  }, []);


  // 只在 courses 变化时更新菜单项
  useEffect(() => {
    if (courseMenuItems) {
      const newMenuItems = generateLecturerClassMenuItems(courseMenuItems);
      setMenuItems(newMenuItems);
    }
  }, [courseMenuItems]);

  const handleSideBarToggle = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const handleExpandSidebar = () => {
    setSideBarOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{formatPageTitle(pageTitle)}</title>
        <meta name="description" content="Lecturer dashboard for UTS attendance system" />
      </Helmet>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <TopBar 
          open={sideBarOpen} 
          onToggle={handleSideBarToggle}
          title={pageTitle}
        />
        <StaffSideBar 
          menuItems={menuItems} 
          open={sideBarOpen}
          onExpand={handleExpandSidebar}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: `calc(100% - ${sideBarOpen ? 250 : 60}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }), 
            position: 'relative',
            overflow: 'hidden'
          }}
          // ml: `${sideBarOpen ? 320 : 80}px`,
        >
          <Outlet context={{ setPageTitle }} />
        </Box>
      </Box>
    </>
  );
};

export default LecturerLayout; 