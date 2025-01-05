import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { StaffSideBar, TopBar } from '../Shared';
import { formatPageTitle } from '../../../utils/helpers';
import { adminMenuItems } from './menuItems';

const AdminLayout = () => {
  const location = useLocation();
  const [sideBarOpen, setSideBarOpen] = useState(true);

  const getCurrentTitle = () => {
    const currentPath = location.pathname;
    
    const findTitle = (items) => {
      for (const item of items) {
        if (item.path === currentPath) {
          return item.title;
        }
        if (item.children) {
          const childTitle = item.children.find(child => child.path === currentPath)?.title;
          if (childTitle) return childTitle;
        }
      }
      return ''; 
    };

    return findTitle(adminMenuItems);
  };

  const handleSideBarToggle = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const handleExpandSidebar = () => {
    setSideBarOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{formatPageTitle(getCurrentTitle())}</title>
        <meta name="description" content="Admin dashboard for UTS attendance system" />
      </Helmet>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <TopBar 
          open={sideBarOpen} 
          onToggle={handleSideBarToggle}
          title={getCurrentTitle()}
        />
        <StaffSideBar 
          menuItems={adminMenuItems} 
          open={sideBarOpen}
          onExpand={handleExpandSidebar}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: `calc(100% - ${sideBarOpen ? 320 : 80}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            ml: `${sideBarOpen ? 320 : 80}px`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Outlet /> {/* sub routes components will be rendered here */}
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout; 