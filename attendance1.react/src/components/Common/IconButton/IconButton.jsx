import { IconButton as MuiIconButton } from '@mui/material';
import { styles } from './IconButton.styles';

const IconButton = ({ 
  Icon,
  color = 'primary',
  onClick,
  ...props 
}) => {
  // Get button color style
  const getColorStyle = (color) => {
    switch(color) {
      case 'delete':
        return styles.delete;
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      default:
        return styles.primary;
    }
  };

  return (
    <MuiIconButton
      onClick={onClick}
      sx={{
        ...styles.base,
        ...styles.iconButton,
        ...getColorStyle(color)
      }}
      {...props}
    >
      {Icon}
    </MuiIconButton>
  );
};

export default IconButton; 