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
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { courseValidationSchema } from '../../../validations/schemas';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { ON_CLASS_DAYS } from '../../../constants/courseConstant';
import { styles } from './CourseForm.styles';

const CourseForm = ({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  const { message, hideMessage } = useMessageContext();
  const theme = useTheme();
  const themedStyles = styles(theme);

  // 用于多选菜单的样式
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Formik
      initialValues={initialValues || {
        courseCode: '',
        courseName: '',
        startDate: '',
        endDate: '',
        classDays: [],
        tutorials: []
      }}
      validationSchema={courseValidationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box sx={themedStyles.formContainer}>
            <Grid container spacing={3}>
              {/* Course Code */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="courseCode"
                  label="Course Code"
                  value={values.courseCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.courseCode && !!errors.courseCode}
                  helperText={touched.courseCode && errors.courseCode}
                  disabled={isEditing}
                />
              </Grid>

              {/* Course Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="courseName"
                  label="Course Name"
                  value={values.courseName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.courseName && !!errors.courseName}
                  helperText={touched.courseName && errors.courseName}
                />
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.startDate && !!errors.startDate}
                  helperText={touched.startDate && errors.startDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* End Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  label="End Date"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.endDate && !!errors.endDate}
                  helperText={touched.endDate && errors.endDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

            {/* Lecture Days */}
            <Grid item xs={12}>
                <TextField
                fullWidth
                select
                SelectProps={{
                    multiple: true,
                    renderValue: (selected) => selected.join(', '),
                    MenuProps: MenuProps,
                }}
                name="classDays"
                label="Lecture Days"
                value={values.classDays}
                onChange={(event) => {
                    const value = event.target.value;
                    if (value.length > 0) { 
                    setFieldValue('classDays', value);
                    }
                }}
                onBlur={handleBlur}
                error={touched.classDays && Boolean(errors.classDays)}
                helperText={touched.classDays && errors.classDays}
                margin="normal"
                input={<OutlinedInput label="Class Day" />}
                >
                {ON_CLASS_DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                    <Checkbox checked={values.classDays.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                    </MenuItem>
                ))}
                </TextField>
            </Grid>

              {/* Tutorial Sessions */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={themedStyles.sectionTitle}>
                  Tutorial Sessions
                </Typography>
                <FieldArray name="tutorials">
                  {({ push, remove }) => (
                    <Box>
                      {values.tutorials.map((tutorial, index) => (
                        <Grid container spacing={2} key={index} sx={themedStyles.tutorialRow}>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              name={`tutorials.${index}.name`}
                              label="Tutorial Name"
                              value={tutorial.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.tutorials?.[index]?.name && !!errors.tutorials?.[index]?.name}
                              helperText={touched.tutorials?.[index]?.name && errors.tutorials?.[index]?.name}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth
                              select
                              name={`tutorials.${index}.classDay`}
                              label="Class Day"
                              value={tutorial.classDay || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.tutorials?.[index]?.classDay && !!errors.tutorials?.[index]?.classDay}
                              helperText={touched.tutorials?.[index]?.classDay && errors.tutorials?.[index]?.classDay}
                            >
                              {ON_CLASS_DAYS.map((day) => (
                                <MenuItem key={day.value} value={day.value}>
                                  {day.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={2} sx={themedStyles.deleteButton}>
                            <MuiIconButton onClick={() => remove(index)}>
                              <DeleteIcon />
                            </MuiIconButton>
                          </Grid>
                        </Grid>
                      ))}
                      <TextButton
                        onClick={() => push({ name: '', classDay: '' })}
                        startIcon={<AddIcon />}
                        variant="text"
                        sx={{ mt: 1 }}
                      >
                        Add Tutorial
                      </TextButton>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={themedStyles.actions}>
              <TextButton
                onClick={onCancel}
                variant="outlined"
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
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm; 