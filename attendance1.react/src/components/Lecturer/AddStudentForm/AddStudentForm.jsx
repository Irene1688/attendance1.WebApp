import { useState } from 'react';
import {
  Box,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material';
import { Formik, Form } from 'formik';
import { singleStudentSchema } from '../../../validations/schemas';
import { Loader, TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { styles } from './AddStudentForm.styles';

const AddStudentForm = ({ 
  courseId,
  tutorials = [],
  hasAttendanceRecordExisted,
  onSubmit,
  onClose,
  loading
}) => {
  const [tabValue, setTabValue] = useState(0); // 0: Single, 1: Batch
  const [defaultAttendance, setDefaultAttendance] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const { message, hideMessage } = useMessageContext();
  const theme = useTheme();
  const themedStyles = styles(theme);

  // handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) { 
      // check file type
      if (file.type !== 'text/csv') {
        setFileError('Please upload a CSV file');
        setFile(null);
        return;
      }

      // read and validate file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          const rows = content.split('\n').filter(row => row.trim());
          
          // check title row
          const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
          const requiredColumns = ['studentid', 'studentname', 'tutorialname'];
          
          if (!requiredColumns.every(col => headers.includes(col))) {
            throw new Error('CSV file must contain columns: studentId, studentName, tutorialName');
          }
          
          // validate each row data
          const dataRows = rows.slice(1);
          for (let i = 0; i < dataRows.length; i++) {
            const cols = dataRows[i].split(',').map(col => col.trim());
            if (cols.length !== headers.length) {
              throw new Error(`Invalid data format at row ${i + 2}`);
            }
            
            // get data
            const data = {};
            headers.forEach((header, index) => {
              data[header] = cols[index];
            });
            
            // validate student ID format
            if (!/^[A-Z]{3}[0-9]{8}$/.test(data.studentid)) {
              throw new Error(`Invalid student ID format at row ${i + 2}: ${data.studentid}`);
            }
            
            // validate tutorial name
            const tutorialExists = tutorials.some(
              tutorial => tutorial.tutorialName.toLowerCase() === data.tutorialname.toLowerCase()
            );
            if (!tutorialExists) {
              throw new Error(`Found un-existing tutorial name at row ${i + 2}: ${data.tutorialname}`);
            }
          }
          
          setFileError('');
          setFile(file);
        } catch (error) {
          setFileError(error.message);
          setFile(null);
        }
      };
      
      reader.onerror = () => {
        setFileError('Error reading file');
        setFile(null);
      };
      
      reader.readAsText(file);
    }
  };

  // handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    const formattedValues = {
      type: 'single',
      data: {
        studentId: values.studentId,
        studentName: values.studentName,
        tutorialId: values.tutorialId,
        defaultAttendance: values.defaultAttendance
      }
    };
    onSubmit(formattedValues);
    setSubmitting(false);
  };

  // handle file upload
  const handleFileUpload = () => {
    if (!file) return;
    const formattedValues = {
      type: 'batch',
      data: file,
      defaultAttendance: defaultAttendance
    };
    onSubmit(formattedValues);
  };

  return (
    <Box role="dialog" aria-modal="true">
      <DialogTitle id="add-student-dialog-title">Add Students</DialogTitle>
      <DialogContent>
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
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Single Student" />
          <Tab label="Batch Upload" />
        </Tabs>

        <Divider sx={themedStyles.divider} />

        {tabValue === 0 ? (
          // single student form
          <Formik
            initialValues={{
              studentId: '',
              studentName: '',
              tutorialId: '',
              defaultAttendance: false
            }}
            validationSchema={singleStudentSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit: formikSubmit,
              isSubmitting
            }) => (
              <form onSubmit={formikSubmit}>
                <Box sx={themedStyles.form}>
                  <TextField
                    fullWidth
                    name="studentId"
                    label="Student ID"
                    value={values.studentId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.studentId && Boolean(errors.studentId)}
                    helperText={touched.studentId && errors.studentId}
                  />
                  <TextField
                    fullWidth
                    name="studentName"
                    label="Student Name"
                    value={values.studentName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.studentName && Boolean(errors.studentName)}
                    helperText={touched.studentName && errors.studentName}
                  />
                  <FormControl 
                    fullWidth
                    error={touched.tutorialId && Boolean(errors.tutorialId)}
                  >
                    <InputLabel>Tutorial Session</InputLabel>
                    <Select
                      name="tutorialId"
                      value={values.tutorialId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Tutorial Session"
                    >
                      {tutorials.map(tutorial => (
                        <MenuItem 
                          key={tutorial.tutorialId} 
                          value={tutorial.tutorialId}
                        >
                          {tutorial.tutorialName}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.tutorialId && errors.tutorialId && (
                      <FormHelperText>{errors.tutorialId}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        name="defaultAttendance"
                        checked={values.defaultAttendance}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label="Set Past Attendance (if have) as Present"
                  />
                </Box>
                <DialogActions sx={themedStyles.actions}>
                  <TextButton 
                    onClick={onClose}
                    variant="text"
                    color="cancel"
                  >
                    Cancel
                  </TextButton>
                  <TextButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add'}
                  </TextButton>
                </DialogActions>
              </form>
            )}
          </Formik>
        ) : (
          // batch upload form
          <Box sx={themedStyles.uploadSection}>
            <FormControlLabel
              control={
                <Switch
                  checked={defaultAttendance}
                  onChange={(e) => setDefaultAttendance(e.target.checked)}
                  color="primary"
                />
              }
              label="Set Past Attendance (if have) as Present"
              sx={themedStyles.defaultAttendanceSwitch}
            />
            <Typography variant="body2" color="textSecondary" sx={themedStyles.uploadHint}>
              Upload a CSV file with the following columns:
              <br />
              <strong>studentId</strong>, <strong>studentName</strong>, <strong>tutorialName</strong>
            </Typography>
            <TextButton
              variant="outlined"
              component="label"
              sx={themedStyles.uploadButton}
            >
              Choose File
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </TextButton>
            {file && (
              <Typography variant="body2" sx={themedStyles.fileName}>
                Selected file: {file.name}
              </Typography>
            )}
            {fileError && (
              <Typography variant="body2" color="error" sx={themedStyles.error}>
                {fileError}
              </Typography>
            )}
            <TextButton
              variant="outlined"
              color="primary"
              href="/templates/students_template.csv"
              download
              sx={themedStyles.downloadButton}
            >
              Download Template
            </TextButton>
            <DialogActions sx={themedStyles.actions}>
              <TextButton 
                onClick={onClose}
                variant="text"
                color="cancel"
              >
                Cancel
              </TextButton>
              <TextButton
                onClick={handleFileUpload}
                variant="contained"
                color="primary"
                disabled={loading || !file}
              >
                {loading ? <Loader size={24} /> : 'Add'}
              </TextButton>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Box>
  );
};

export default AddStudentForm; 