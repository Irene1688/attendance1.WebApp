import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Typography, Box } from '@mui/material';
import { formatPageTitle } from '../../utils/helpers';


const AdminDashboard = () => {
  const location = useLocation();
  // get user info from Redux store
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const isFromLogin = location.state?.from?.pathname === '/login' || 
                       document.referrer.includes('/login');

    if (isFromLogin) {
      // disable browser back button
      window.history.pushState(null, '', window.location.pathname);
      const handlePopState = (event) => {
        event.preventDefault();
        window.history.pushState(null, '', window.location.pathname);
      };

      window.addEventListener('popstate', handlePopState);

      // disable back button
      const handleBackButton = (e) => {
        if (e.keyCode === 8) { // back button key code is 8
          const element = e.target;
          if (element.tagName.toLowerCase() !== 'input' && 
              element.tagName.toLowerCase() !== 'textarea') {
            e.preventDefault();
          }
        }
      };

      document.addEventListener('keydown', handleBackButton);

      // clean up function
      return () => {
        window.removeEventListener('popstate', handlePopState);
        document.removeEventListener('keydown', handleBackButton);
      };
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>{formatPageTitle('Admin Dashboard')}</title>
        <meta name="description" content="Admin dashboard for UTS attendance system" />
      </Helmet>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hello, {user?.name || 'Admin'}.
        </Typography>
      </Box>
    </>
  );
};

export default AdminDashboard; 