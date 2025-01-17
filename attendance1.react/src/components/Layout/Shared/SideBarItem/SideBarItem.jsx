import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Collapse,
  List,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styles } from './SideBarItem.styles';
import { useAuth } from '../../../../hooks/auth';

const SideBarItem = ({ 
  icon: Icon,
  title, 
  path, 
  children,
  collapsed = false,
  onExpandSidebar
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const isActive = location.pathname.startsWith(path);
  const hasChildren = Boolean(children?.length);

  const isChildActive = hasChildren && 
    children.some(child => location.pathname.startsWith(child.path));

  // when the route changes, check if the parent menu should be open
  useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [location.pathname, isChildActive]);

  const handleClick = () => {
    if (hasChildren) {
      if (collapsed) {
        onExpandSidebar?.();
        setOpen(true);
      } else {
        setOpen(!open);
      }
      return;
    }
    
    if (path === '/logout') {
      handleLogout();
     } else {
      navigate(path);
    }
  };

  const themedStyles = styles(theme);

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={themedStyles.menuItem(isActive || isChildActive, collapsed)}  
      >
        {Icon && (
          <ListItemIcon sx={themedStyles.icon(collapsed)}>
            <Icon />
          </ListItemIcon>
        )}
        {!collapsed && <ListItemText primary={title} />}
        {hasChildren && !collapsed && (
          open ? <ExpandLessIcon sx={themedStyles.expandIcon} /> : <ExpandMoreIcon sx={themedStyles.expandIcon} />
        )}
      </ListItemButton>
      {hasChildren && !collapsed && (
        <Collapse in={open} timeout={500} unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => (
              <ListItemButton
                key={child.path}
                onClick={() => navigate(child.path)}
                sx={themedStyles.subMenuItem(location.pathname.startsWith(child.path))}  
              >
                <ListItemText primary={child.title} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SideBarItem; 