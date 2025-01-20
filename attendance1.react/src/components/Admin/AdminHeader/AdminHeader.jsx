import { Box, Typography, useTheme } from '@mui/material';
import { styles } from './AdminHeader.styles';

const AdminHeader = ({ title, children, isTitleBold = false, sx }) => {
  const theme = useTheme();
  const themedStyles = styles(theme, isTitleBold);
  return (
    <Box sx={{ ...themedStyles.container, ...sx }}>
      <Typography variant="h5" sx={themedStyles.title}>{title}</Typography>
      {children}
    </Box>
  );
};

export default AdminHeader;