import { useState } from 'react';
import { 
    Box, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    TextField,
    MenuItem,
    Typography,
    useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parse, set } from 'date-fns';
import { Formik, Form } from 'formik';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { attendanceSessionValidationSchema } from '../../../validations/schemas';
import { styles } from './GenerateNewAttendanceSessionForm.styles';

const GenerateNewAttendanceSessionForm = ({
  courseId,
  tutorials = [],
  onSubmit,
  onClose,
  loading = false
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);
  const { message, hideMessage } = useMessageContext();

  // Initial form values
  const initialValues = {
    AttendanceDate: new Date(),
    StartTime: new Date(),
    IsLecture: true,
    TutorialId: 0
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedDate = format(values.AttendanceDate, 'yyyy-MM-dd');
      const formattedTime = format(values.StartTime, 'HH:mm');
      await onSubmit({
        courseId: Number(courseId),
        ...values,
        AttendanceDate: formattedDate,
        StartTime: formattedTime,
        TutorialId: values.IsLecture ? 0 : values.TutorialId
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={attendanceSessionValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, resetForm }) => (
        <Form>
          <DialogTitle id="generate-attendance-dialog-title">
            Generate New Attendance Session
          </DialogTitle>
          <DialogContent sx={themedStyles.dialogContent}>
            {message.show && (
              <Box sx={{ mb: 2 }}>
                <PromptMessage
                  open={message.show}
                  message={message.text}
                  severity={message.severity}
                  onClose={hideMessage}
                />
              </Box>
            )}

            <Typography variant="body1" sx={themedStyles.promptMessage}>
              * This action will generate new attendance records for all students, default attendance is "Present".
            </Typography>
            
            {/* Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={values.AttendanceDate}
                onChange={(newDate) => {
                  if (newDate) {
                    setFieldValue('AttendanceDate', newDate);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: touched.AttendanceDate && Boolean(errors.AttendanceDate),
                    helperText: touched.AttendanceDate && errors.AttendanceDate,
                    margin: "normal",
                    onBlur: handleBlur
                  }
                }}
              />

              {/* Time Picker */}
              <TimePicker
                label="Attendance Time"
                value={values.StartTime}
                onChange={(newTime) => {
                  if (newTime) {
                    setFieldValue('StartTime', newTime);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(errors.StartTime),
                    helperText: errors.StartTime,
                    margin: "normal",
                    onBlur: handleBlur
                  }
                }}
                ampm={false}
                minutesStep={5}
              />
            </LocalizationProvider>

            {/* Session Type Radio Group */}
            <FormControl 
              component="fieldset" 
              error={touched.IsLecture && Boolean(errors.IsLecture)}
              margin="normal"
              fullWidth
            >
              <RadioGroup
                name="IsLecture"
                value={values.IsLecture}
                onChange={(e) => {
                  const value = e.target.value === 'true';
                  handleChange({
                    target: {
                      name: 'IsLecture',
                      value: value
                    }
                  });
                }}
              >
                <FormControlLabel 
                  value="true"
                  control={<Radio />} 
                  label="Lecture" 
                />
                <FormControlLabel 
                  value="false"
                  control={<Radio />} 
                  label="Tutorial" 
                />
              </RadioGroup>
              {touched.IsLecture && errors.IsLecture && (
                <FormHelperText>{errors.IsLecture}</FormHelperText>
              )}
            </FormControl>

            {/* Tutorial Select (only shown when Tutorial is selected) */}
            {!values.IsLecture && (
              <TextField
                select
                fullWidth
                name="TutorialId"
                label="Tutorial"
                value={values.TutorialId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.TutorialId && Boolean(errors.TutorialId)}
                helperText={touched.TutorialId && errors.TutorialId}
                margin="normal"
              >
                <MenuItem value={0}>Select Tutorial</MenuItem>
                {tutorials.map((tutorial) => (
                  <MenuItem key={tutorial.tutorialId} value={tutorial.tutorialId}>
                    {tutorial.tutorialName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </DialogContent>
          <DialogActions sx={themedStyles.dialogActions}>
            <TextButton
              onClick={() => {
                resetForm(); 
                onClose();
              }}
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
              {loading ? 'Generating...' : 'Generate'}
            </TextButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default GenerateNewAttendanceSessionForm;


