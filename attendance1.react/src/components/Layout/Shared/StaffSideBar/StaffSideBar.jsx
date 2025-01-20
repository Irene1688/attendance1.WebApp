import { Drawer, Box, List, Typography, useTheme } from '@mui/material';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { SideBarItem } from '../..';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../../../hooks/auth/useAuth';
import { styles } from './StaffSideBar.styles';

const StaffSideBar = ({ menuItems = [], open = true, onExpand }) => {
  const theme = useTheme();
  const { user } = useAuth();
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      sx={styles(theme).drawer(open)}
    >
      <Box sx={styles(theme).logoContainer(open)}>
        <img 
          src="/UTSlogoBanner.png"  
          alt="Logo" 
          style={styles(theme).logo(open)}
        />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SimpleBar style={{ height: '100%' }}>
          <Box sx={styles(theme).menuContainer}>
            <Typography variant="overline" sx={styles(theme).menuTitle(open)}>
              Navigation
            </Typography>
            <List>
              {menuItems.map((item) => (
                <SideBarItem
                  key={item.path}
                  icon={item.icon}
                  title={item.title}
                  path={item.path}
                  children={item.children}
                  collapsed={!open}
                  onExpandSidebar={onExpand}
                />
              ))}
            </List>
          </Box>
        </SimpleBar>
      </Box>
      <Box sx={styles(theme).fixedBottomMenuContainer}>
        <Typography variant="overline" sx={{...styles(theme).menuTitle(open), marginLeft: "3px"}}>
          Other
        </Typography>
        <List>
          <SideBarItem
            icon={PersonIcon}
            title="Profile"
            path={`/${user.role.toLowerCase()}/profile`}
            collapsed={!open}
            onExpandSidebar={onExpand}
          />
          <SideBarItem
            icon={LogoutIcon}
            title="Logout"
            path="/logout"
            collapsed={!open}
            onExpandSidebar={onExpand}
          />
        </List>
      </Box>
    </Drawer>
  );
};

export default StaffSideBar; 