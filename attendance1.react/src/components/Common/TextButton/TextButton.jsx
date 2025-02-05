import { Button as MuiButton, useTheme } from '@mui/material';
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
        return themedStyles.cancel;
      default:
        return themedStyles.primary;
    }
  };
  
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <MuiButton
      variant={variant}
      onClick={onClick}
      startIcon={Icon}
      sx={{
        ...themedStyles.base,
        ...getColorStyle(color),
        ...(Icon && themedStyles.withIcon)
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default TextButton; 