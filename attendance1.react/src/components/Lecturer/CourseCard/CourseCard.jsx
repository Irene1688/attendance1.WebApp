import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import { TextButton } from '../../Common';
import { GenerateCodeForm, ExistedAttendanceCodeList } from '../';
import { styles } from './CourseCard.styles';
import { DURATION_OPTIONS } from '../../../constants/attendanceCodeDuration';

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
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
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