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
  useTheme
} from '@mui/material';
import { TextButton } from '../../Common';
import { styles } from './CourseCard.styles';
import { DURATION_OPTIONS } from '../../../constants/attendanceCodeDuration';

const CourseCard = ({ course, onTakeAttendance }) => {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState('');
  const [selectedTutorialId, setSelectedTutorialId] = useState('');
  const theme = useTheme();
  const themedStyles = styles(theme);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDuration('');
    setSelectedTutorialId('');
  };

  const handleConfirm = () => {
    onTakeAttendance(parseInt(duration), selectedTutorialId, course);
    handleClose();
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

      <Dialog open={open} onClose={handleClose}>
        <Box sx={themedStyles.dialogHeader}>
          <Typography variant="body1" sx={themedStyles.dialogHeaderText}>
            {course.courseCode} - {course.courseName}
          </Typography>
        </Box>
        <DialogTitle sx={{ textAlign: 'center' }}>Generate Attendance Code</DialogTitle>
        <DialogContent>
            {/* <Box>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                Code valid time:
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                row
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                >
                {DURATION_OPTIONS.map((option) => (
                    <FormControlLabel
                    key={option.value}
                    value={option.value.toString()}
                    control={<Radio />}
                    label={option.label}
                    sx={themedStyles.radioLabel}
                    />
                ))}
                </RadioGroup>
            </FormControl>
            </Box> */}
  <Box>
    {/* Code valid time selection */}
    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
      Code valid time:
    </Typography>
    <FormControl component="fieldset">
      <RadioGroup
        row
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      >
        
        {DURATION_OPTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value.toString()}
            control={<Radio />}
            label={option.label}
            sx={themedStyles.radioLabel}
          />
        ))}
      </RadioGroup>
    </FormControl>

    {/* Lecture or Tutorial Selection */}
    <Typography variant="body1" color="textSecondary" sx={{ mt: 4, mb: 2 }}>
      For which class: 
    </Typography>
    <FormControl component="fieldset">
      <RadioGroup
        row
        value={selectedTutorialId} // State to manage selection (lecture or tutorial)
        onChange={(e) => setSelectedTutorialId(e.target.value)} // Update state on change
      >
        <FormControlLabel
            key="lecture"
            value="0"
            control={<Radio />}
            label="Lecture"
            sx={themedStyles.radioLabel}
          />
        {course.tutorials.map((tutorial) => (
          <FormControlLabel
            key={tutorial.id}
            value={tutorial.id.toString()}
            control={<Radio />}
            label={tutorial.name}
            sx={themedStyles.radioLabel}
          />
        ))}
      </RadioGroup>
    </FormControl>
  </Box>

        </DialogContent>
        <DialogActions>
          <TextButton
            onClick={handleClose}
            variant="text"
            color="cancel"
          >
            Cancel
          </TextButton>
          <TextButton
            onClick={handleConfirm}
            variant="contained"
            disabled={!duration || !selectedTutorialId}
          >
            Generate
          </TextButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseCard; 