import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { useEnrolledStudentManagement } from '../../../hooks/features';
import { styles } from './AddStudentForm.styles';

const AddStudentForm = ({
  open,
  programmeId,
  courseId,
  tutorials = [],
  onSubmit,
  onClose,
  loading = false
}) => {
  const { message, hideMessage, showErrorMessage } = useMessageContext();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);
  const theme = useTheme();
  const themedStyles = styles(theme);

  const {
    availableStudents,
    fetchAvailableStudents,
  } = useEnrolledStudentManagement();

  // load available students selection
  const loadAvailableStudents = useCallback(async () => {
    if (!courseId) return;
    
    setLoadingStudents(true);
    await fetchAvailableStudents(programmeId, courseId);
    setLoadingStudents(false);
  }, [courseId, programmeId, searchTerm]);

  useEffect(() => {
    if (open) loadAvailableStudents();
  }, [open, loadAvailableStudents]);

  // handle submit
  const handleSubmit = () => {
    if (!selectedTutorial) {
      showErrorMessage('Please select a tutorial session');
      return;
    }
    if (selectedStudents.length === 0) {
      showErrorMessage('Please select at least one student');
      return;
    }
    onSubmit({
      tutorialId: Number(selectedTutorial),
      students: selectedStudents.map(student => ({
        studentUserId: student.id,
        studentId: student.name.split(' - ')[0]
      }))
    });
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSelectedTutorial('');
    setSearchTerm('');
    onClose();
  };

  // 处理搜索输入
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // 可以添加防抖
    setTimeout(() => {
      loadAvailableStudents();
    }, 500);
  };

  // 根据搜索词过滤学生
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return availableStudents;
    
    const searchTermLower = searchTerm.toLowerCase();
    return availableStudents.filter(student => student.name.toLowerCase().includes(searchTermLower));
  }, [availableStudents, searchTerm]);

  // 处理学生选择
  const handleStudentSelect = (student) => {
    const isSelected = selectedStudents.some(s => s.studentId === student.studentId);
    
    if (isSelected) {
      setSelectedStudents(prev => prev.filter(s => s.studentId !== student.studentId));
    } else {
      setSelectedStudents(prev => [...prev, student]);
    }
  };

  return (
    <>
      <DialogTitle>Add Students to Class</DialogTitle>
      <DialogContent sx={themedStyles.dialogContent}>
        {message.show && message.severity === 'error' && (
          <PromptMessage
            open={true}
            message={message.text}
            severity={message.severity}
            onClose={hideMessage}
            sx={{ mb: 2 }}
            scrollToTop={false}
          />
        )}
            
        <TextField
          select
          fullWidth
          label="Tutorial Session"
          value={selectedTutorial}
          onChange={(e) => setSelectedTutorial(e.target.value)}
          sx={themedStyles.tutorialSelect}
        >
          {tutorials.map((tutorial) => (
            <MenuItem key={tutorial.tutorialId} value={tutorial.tutorialId}>
              {tutorial.tutorialName}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={2}>
          {/* Search and Available Students List */}
          <Grid item xs={12}>
            <Box sx={themedStyles.searchContainer}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: loadingStudents && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Paper variant="outlined" sx={themedStyles.studentListContainer}>
              <List dense>
                {filteredStudents.map((student) => (
                  <ListItem key={student.id}>
                    <Checkbox
                      checked={selectedStudents.some(s => s.id === student.id)}
                      onChange={() => handleStudentSelect(student)}
                    />
                    <ListItemText primary={student.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Selected Students List */}
          {selectedStudents.length > 0 && (
            <Grid item xs={12} sx={themedStyles.selectedStudentsContainer}>
              <Typography variant="subtitle1" gutterBottom>
                Selected Students ({selectedStudents.length})
              </Typography>
              <Paper variant="outlined" sx={themedStyles.selectedStudentsList}>
                <List dense>
                  {selectedStudents.map((student) => (
                    <ListItem key={student.id}>
                      <ListItemText primary={student.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleStudentSelect(student)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
          </DialogContent>
      <DialogActions sx={themedStyles.dialogActions}>
            <TextButton 
          onClick={handleClose}
              variant="text"
              color="cancel"
            >
              Cancel
            </TextButton>
            <TextButton 
          onClick={handleSubmit}
              variant="contained"
              color="primary"
          disabled={loading || loadingStudents || !selectedTutorial || selectedStudents.length === 0}
            >
              {loading ? 'Adding...' : 'Add Students'}
            </TextButton>
          </DialogActions>
    </>
  );
};

export default AddStudentForm; 