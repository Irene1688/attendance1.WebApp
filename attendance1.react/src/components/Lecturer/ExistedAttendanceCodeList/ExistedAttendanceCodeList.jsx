import { useState, useEffect } from 'react';
import { 
  Dialog,
  Box, 
  Typography, 
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { TextButton, EmptyState, Loader } from '../../Common';
import { DURATION_OPTIONS } from '../../../constants/attendanceCodeDuration';
import { useAttendanceManagement } from '../../../hooks/features';
import { styles } from './ExistedAttendanceCodeList.styles';

const ExistedAttendanceCodeList = ({ course, open, onClose, onSelectExistedCode }) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const [duration, setDuration] = useState('');
  
  const { 
    loading, 
    existedAttendanceCodes,
    fetchExistedAttendanceCodes 
  } = useAttendanceManagement();

  const [message, setMessage] = useState(null);

  // useEffect(() => {
  //   if (course?.courseId) {
  //     fetchExistedAttendanceCodes(course?.courseId);
  //   }
  // }, [course]);

  useEffect(() => {
    if (open && course?.courseId) {
      fetchExistedAttendanceCodes(course.courseId);
    }
  }, [open, course?.courseId]);

  useEffect(() => {
    if (duration) {
      setMessage(null);
    }
  }, [duration]);

  // 使用已有考勤码
  const handleUseCode = (recordId) => {
    if (!duration) {
      setMessage('Duration is required.');
      return;
    }
    onSelectExistedCode(recordId, parseInt(duration), course);
    onClose();
  };

  const handleClose = () => {
    setDuration('');
    setMessage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Box sx={themedStyles.dialogHeader}>
            <Typography variant="body1" sx={themedStyles.dialogHeaderText}>
            {course.courseCode} - {course.courseName}
            </Typography>
        </Box>
        <DialogTitle sx={{ textAlign: 'center' }}>Re-valid Attendance Code</DialogTitle>

        <DialogContent sx={themedStyles.durationContainer}>
          <Box sx={themedStyles.durationSection}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                Select valid duration for the code:
            </Typography>
            {message && (
              <Typography variant="body1" color="error">
                {message}
              </Typography>
            )}
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
          </Box>
        </DialogContent>
  
        <DialogContent sx={themedStyles.content}>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            Select attendance code to re-use:
          </Typography>
          {loading ? (
            <Loader message="Fetching existed attendance codes..."/>
          ) : existedAttendanceCodes?.length > 0 ? (
            <List>
              {existedAttendanceCodes
              .sort((a, b) => {
                const dateComparison = new Date(b.lastUsedDate) - new Date(a.lastUsedDate);
                if (dateComparison !== 0) return dateComparison;
                return b.startTime.localeCompare(a.startTime);
              })
              .map((record) => (
                <ListItem 
                key={record.recordId}
                sx={themedStyles.listItem}
              >
                {/* 修改这部分结构来避免嵌套问题 */}
                <Box sx={themedStyles.codeContent}>
                  <Box sx={themedStyles.codeHeader}>
                    <Chip 
                      label={record.isLecture ? 'Lecture' : record.tutorialName}
                      size="small"
                      sx={themedStyles.typeChip(record.isLecture)}
                    />
                    <Typography variant="h6">
                      {record.attendanceCode}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={themedStyles.codeInfo}>
                    Last used: {format(new Date(record.lastUsedDate), 'dd MMM yyyy')}, {format(new Date(`1970-01-01T${record.startTime}`), 'hh:mm:ss a')} - {format(new Date(`1970-01-01T${record.endTime}`), 'hh:mm:ss a')}
                  </Typography>
                </Box>
                <TextButton
                  onClick={() => handleUseCode(record.recordId)}
                  variant="contained"
                  size="small"
                >
                  Use Code
                </TextButton>
              </ListItem>
              ))}
            </List>
          ) : (
            <EmptyState 
              title="No Existing Codes"
              message="No attendance codes have been generated for this course yet."
            />
          )}
        </DialogContent>
  
        <DialogActions sx={themedStyles.actions}>
          <TextButton
            onClick={handleClose}
            variant="text"
            color="cancel"
          >
            Close
          </TextButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExistedAttendanceCodeList; 