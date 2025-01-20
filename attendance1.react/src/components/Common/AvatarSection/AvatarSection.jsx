import { Box, Avatar, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { styles } from './AvatarSection.styles';

const AvatarSection = ({ name, campusId, sx }) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  return (
    <Box sx={{ ...themedStyles.avatarSection, ...sx }}>
      <Avatar sx={themedStyles.avatar}>
        {name?.charAt(0)?.toUpperCase()}
      </Avatar>
      <Typography variant="h6" sx={themedStyles.userName}>
        {name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {campusId}
      </Typography>
    </Box>
  )
}

export default AvatarSection;