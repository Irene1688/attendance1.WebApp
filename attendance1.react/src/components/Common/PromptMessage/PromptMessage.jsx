import PropTypes from 'prop-types';
import { Collapse } from '@mui/material';
import { StyledAlert } from './PromptMessage.styles';

const PromptMessage = ({ 
  open = false, 
  message = '', 
  severity = 'info', 
  fullWidth = false,
  onClose,
  sx = {}
}) => {
  return (
    <Collapse in={open}>
      <StyledAlert
        severity={severity}
        onClose={onClose}
        className={fullWidth ? 'fullWidth' : ''}
        sx={sx}
      >
        {message}
      </StyledAlert>
    </Collapse>
  );
};

PromptMessage.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  fullWidth: PropTypes.bool,
  onClose: PropTypes.func,
  sx: PropTypes.object
};

export default PromptMessage; 