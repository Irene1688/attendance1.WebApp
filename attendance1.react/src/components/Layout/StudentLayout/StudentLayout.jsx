import { useState } from 'react';
import { 
  Box, 
  BottomNavigation, 
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { menuItems } from './menuItems';
import { styles } from './StudentLayout.styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Helmet } from 'react-helmet-async';
import { formatPageTitle } from '../../../utils/helpers';


const StudentLayout = () => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [pageTitle, setPageTitle] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 获取当前路由对应的菜单项索引
  const getCurrentPageIndex = () => {
    const currentPath = location.pathname;
    return menuItems.findIndex(item => currentPath.startsWith(`/student${item.path}`));
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleProfileMenuClose();
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>{formatPageTitle(pageTitle)}</title>
        <meta name="description" content="Student portal for UTS attendance system" />
      </Helmet>
      <Box sx={themedStyles.root}>
        {/* Top Bar */}
        <AppBar position="fixed" sx={themedStyles.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={themedStyles.title}>
            {menuItems[getCurrentPageIndex()]?.title || 'Student Portal'}
          </Typography>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={themedStyles.profileButton}
          >
            {userProfile?.profilePicture ? (
              <Avatar 
                src={userProfile.profilePicture} 
                sx={themedStyles.avatar}
              />
            ) : (
              <AccountCircleIcon sx={themedStyles.avatarIcon} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleNavigate('/student/profile')}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/student/settings')}>
          Settings
        </MenuItem>
      </Menu>

      {/* Main Content Area */}
      <Box sx={themedStyles.content}>
        <Outlet context={{ setPageTitle }}/>
      </Box>

        {/* Bottom Navigation Bar */}
        <BottomNavigation
            value={getCurrentPageIndex()}
            onChange={(event, newValue) => {
            navigate(`/student${menuItems[newValue].path}`);
            }}
            sx={themedStyles.bottomNav}
        >
            {menuItems.map((item) => (
              <BottomNavigationAction
                  key={item.path}
                  label={item.title}
                  icon={<item.icon />}
              />
            ))}
        </BottomNavigation>
      </Box>
    </>
  );
};

export default StudentLayout; 