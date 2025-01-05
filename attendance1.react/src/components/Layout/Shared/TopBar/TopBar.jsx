import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { styles } from './TopBar.styles';

const TopBar = ({ open, onToggle, title }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={styles.appBar(open)}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={onToggle}
          edge="start"
          sx={styles.menuButton}
        >
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={styles.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar; 