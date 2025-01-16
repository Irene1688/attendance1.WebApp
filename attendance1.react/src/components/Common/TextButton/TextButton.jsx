import { Button as MuiButton } from '@mui/material';
import { styles } from './TextButton.styles';

const TextButton = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  Icon,
  onClick,
  ...props 
}) => {
  // Get button color style
  const getColorStyle = (color) => {
    switch(color) {
      case 'delete':
        return styles.delete;
      case 'cancel':
        return styles.cancel;
      default:
        return styles.primary;
    }
  };

  return (
    <MuiButton
      variant={variant}
      onClick={onClick}
      startIcon={Icon}
      sx={{
        ...styles.base,
        ...getColorStyle(color),
        ...(Icon && styles.withIcon)
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default TextButton; 