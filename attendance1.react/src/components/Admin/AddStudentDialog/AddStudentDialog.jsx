import { useState, useEffect, useCallback } from 'react';
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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { adminApi } from '../../../api/admin';
import { useApiExecutor } from '../../../hooks/common';

const AddStudentDialog = ({
  open,
  onClose,
  onSubmit,
  tutorials = [],
  courseId,
  loading = false
}) => {
  const { message, hideMessage, showErrorMessage } = useMessageContext();
  const { handleApiCall } = useApiExecutor();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // 加载可添加的学生列表
  const loadAvailableStudents = useCallback(async () => {
    if (!courseId) return;
    
    setLoadingStudents(true);
    await handleApiCall(
      () => adminApi.getAvailableStudents({
        courseId,
        searchTerm
      }),
      (data) => {
        setAvailableStudents(data || []);
      }
    );
    setLoadingStudents(false);
  }, [courseId, searchTerm, handleApiCall]);

  // 当对话框打开或搜索词变化时加载学生列表
  useEffect(() => {
    if (open) {
      loadAvailableStudents();
    }
  }, [open, loadAvailableStudents]);

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
      tutorialId: selectedTutorial,
      studentIds: selectedStudents
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

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add Students to Course</DialogTitle>
      <DialogContent>
        {message.show && message.severity === 'error' && (
          <Box sx={{ mt: 2, mb: 0 }}>
            <PromptMessage
              open={true}
              message={message.text}
              severity={message.severity}
              fullWidth
              onClose={hideMessage}
            />
          </Box>
        )}
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            select
            label="Tutorial Session"
            value={selectedTutorial}
            onChange={(e) => setSelectedTutorial(e.target.value)}
            margin="normal"
          >
            {tutorials.map((tutorial) => (
              <MenuItem key={tutorial.tutorialId} value={tutorial.tutorialId}>
                {tutorial.tutorialName} ({tutorial.classDay})
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Select Students
          </Typography>
          <TextField
            fullWidth
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearchChange}
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
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            SelectProps={{
              multiple: true,
              value: selectedStudents,
              onChange: (e) => setSelectedStudents(e.target.value)
            }}
            helperText={`${availableStudents.length} students available`}
          >
            {availableStudents.map((student) => (
              <MenuItem key={student.studentId} value={student.studentId}>
                {student.studentId} - {student.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
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
          disabled={loading || loadingStudents}
        >
          {loading ? 'Adding...' : 'Add Students'}
        </TextButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentDialog; 