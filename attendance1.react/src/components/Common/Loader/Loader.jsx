import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styles } from './styles';

const Loader = ({ 
  message = 'Loading...', 
  color = 'white',
  sx = {} 
}) => {
  return (
    <Box sx={{ ...styles.container, ...sx }}>
      <Box sx={styles.loaderBox}>
        <CircularProgress 
          sx={styles.spinner}
          size={48}
          thickness={4}
        />
        {message && (
          <Typography
            variant="body1"
            sx={styles.message}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

Loader.propTypes = {
  message: PropTypes.string,
  color: PropTypes.string,
  sx: PropTypes.object
};

export default Loader; 