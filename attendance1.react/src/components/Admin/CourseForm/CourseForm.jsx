import { Formik, Form, FieldArray } from 'formik';
import { 
  Box, 
  Typography,
  TextField, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton as MuiIconButton,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { courseValidationSchema, DAYS_OF_WEEK, formatTutorialName } from '../../../validations/schemas/courseValidation';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';

const CourseForm = ({ 
  initialValues, 
  programmes = [],
  lecturers = [],
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  const { message, hideMessage } = useMessageContext();
  
  return (
    <Formik
      initialValues={{
        courseCode: '',
        courseName: '',
        courseSession: '',
        programmeId: '',
        lecturerId: '',
        classDay: '',
        startDate: '',
        endDate: '',
        tutorials: [{ name: formatTutorialName(0), classDay: '' }],
        ...initialValues
      }}
      validationSchema={courseValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <DialogTitle>
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <DialogContent>
            {message.show && message.severity === 'error' && (
              <Box sx={{ mt: 2, mb: 0 }}>
                <PromptMessage
                  open={true}
                  message={message.text}
                  duration={10000}
                  severity={message.severity}
                  fullWidth
                  onClose={hideMessage}
                />
              </Box>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="programmeId"
                  label="Programme"
                  value={values.programmeId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.programmeId && Boolean(errors.programmeId)}
                  helperText={touched.programmeId && errors.programmeId}
                  margin="normal"
                >
                  {programmes.map((programme) => (
                    <MenuItem key={programme.programmeId} value={programme.programmeId}>
                      {programme.programmeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="lecturerId"
                  label="Lecturer"
                  value={values.lecturerId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lecturerId && Boolean(errors.lecturerId)}
                  helperText={touched.lecturerId && errors.lecturerId}
                  margin="normal"
                >
                  {lecturers.map((lecturer) => (
                    <MenuItem key={lecturer.lecturerId} value={lecturer.lecturerId}>
                      {lecturer.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="courseCode"
                  label="Course Code"
                  value={values.courseCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.courseCode && Boolean(errors.courseCode)}
                  helperText={touched.courseCode && errors.courseCode}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="courseName"
                  label="Course Name"
                  value={values.courseName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.courseName && Boolean(errors.courseName)}
                  helperText={touched.courseName && errors.courseName}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="courseSession"
                  label="Course Session"
                  value={values.courseSession}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.courseSession && Boolean(errors.courseSession)}
                  helperText={touched.courseSession && errors.courseSession}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="classDay"
                  label="Class Day"
                  value={values.classDay}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.classDay && Boolean(errors.classDay)}
                  helperText={touched.classDay && errors.classDay}
                  margin="normal"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.startDate && Boolean(errors.startDate)}
                  helperText={touched.startDate && errors.startDate}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  label="End Date"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.endDate && Boolean(errors.endDate)}
                  helperText={touched.endDate && errors.endDate}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tutorial Sessions
              </Typography>
              <FieldArray name="tutorials">
                {({ push, remove }) => (
                  <Box>
                    {values.tutorials.map((tutorial, index) => (
                      <Grid container spacing={2} key={index}>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            name={`tutorials.${index}.name`}
                            label="Tutorial Name"
                            value={tutorial.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.tutorials?.[index]?.name && 
                              Boolean(errors.tutorials?.[index]?.name)
                            }
                            helperText={
                              touched.tutorials?.[index]?.name && 
                              errors.tutorials?.[index]?.name
                            }
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            fullWidth
                            select
                            name={`tutorials.${index}.classDay`}
                            label="Tutorial Day"
                            value={tutorial.classDay}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.tutorials?.[index]?.classDay && 
                              Boolean(errors.tutorials?.[index]?.classDay)
                            }
                            helperText={
                              touched.tutorials?.[index]?.classDay && 
                              errors.tutorials?.[index]?.classDay
                            }
                            margin="normal"
                          >
                            {DAYS_OF_WEEK.map((day) => (
                              <MenuItem key={day} value={day}>
                                {day}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                          <MuiIconButton 
                            onClick={() => remove(index)}
                            disabled={values.tutorials.length === 1}
                          >
                            <DeleteIcon />
                          </MuiIconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <TextButton
                      onClick={() => push({ 
                        name: formatTutorialName(values.tutorials.length), 
                        classDay: '' 
                      })}
                      startIcon={<AddIcon />}
                      variant="text"
                      sx={{ mt: 1 }}
                    >
                      Add Tutorial
                    </TextButton>
                  </Box>
                )}
              </FieldArray>
            </Box>
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <TextButton 
              onClick={onCancel}
              variant="text"
              color="cancel"
            >
              Cancel
            </TextButton>
            <TextButton 
              type="submit" 
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </TextButton>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm; 