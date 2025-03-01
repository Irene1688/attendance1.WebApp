import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  useTheme,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GenerateCodeForm, ExistedAttendanceCodeList } from '../';
import { styles } from './CourseCard.styles';

const CourseCard = ({ course, onTakeAttendance, onSelectExistedCode }) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [anchorEl, setAnchorEl] = useState(null);
  const [generateCodeDialogOpen, setGenerateCodeDialogOpen] = useState(false);
  const [existedCodeDialogOpen, setExistedCodeDialogOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleTakeAttendance = () => {
    setAnchorEl(null);
    setGenerateCodeDialogOpen(true);
  };

  const handleSelectExistedCode = () => {
    setAnchorEl(null);
    setExistedCodeDialogOpen(true);
  };

  return (
    <>
      <Card sx={themedStyles.card} onClick={handleClick}>
        <CardContent>
          <Typography variant="body2" sx={themedStyles.courseCode}>
            {course.courseCode}
          </Typography>
          <Typography variant="h6" sx={themedStyles.courseName}>
            {course.courseName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {course.courseSession}
          </Typography>
        </CardContent>
        <Box className="actionWrapper" sx={themedStyles.actionWrapper}>
        <Typography variant="caption" sx={themedStyles.actionText}>
          Select
        </Typography>
        <IconButton 
          onClick={handleClick}
          sx={themedStyles.actionButton}
          aria-label={`Take attendance for ${course.courseName}`}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
      </Card>

      

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleTakeAttendance}>
          Generate New Code
        </MenuItem>
        <MenuItem onClick={handleSelectExistedCode}>
          Use Existing Code
        </MenuItem>
      </Menu>

      {generateCodeDialogOpen && (
        <GenerateCodeForm
          course={course}
          open={generateCodeDialogOpen}
          onClose={() => setGenerateCodeDialogOpen(false)}
          onTakeAttendance={onTakeAttendance}
        />
      )}

      {existedCodeDialogOpen && (
        <ExistedAttendanceCodeList
          course={course}
          open={existedCodeDialogOpen}
          onClose={() => setExistedCodeDialogOpen(false)}
          onSelectExistedCode={onSelectExistedCode}
        />
      )}

    </>
  );
};

export default CourseCard; 