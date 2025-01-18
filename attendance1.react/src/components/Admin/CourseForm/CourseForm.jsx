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
  Checkbox,
  ListItemText,
  OutlinedInput,
  InputAdornment,
  Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
  courseValidationSchema, 
  formatTutorialName, 
  TUTORIAL_DAYS,
  MONTHS,
  generateYearOptions,
  convertDaysToNumbers,
  DAY_TO_NUMBER
} from '../../../validations/schemas/courseValidation';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

// 只包含周一到周五
const CLASS_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

const CourseForm = ({ 
  initialValues, 
  programmes = [],
  lecturers = [],
  onSubmit, 
  onCancel, 
  isEditing 
}) => {
  const { message, hideMessage } = useMessageContext();
  
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
      initialValues={{
        courseCode: '',
        courseName: '',
        sessionMonth: '',
        sessionYear: '',
        programmeId: '',
        userId: '',
        classDays: [],
        startDate: '',
        endDate: '',
        tutorials: [{ name: formatTutorialName(0), classDay: '' }],
        ...(initialValues || {})
      }}
      validationSchema={courseValidationSchema}
      onSubmit={(values, actions) => {
        try {
          // 组合 session
          const monthLabel = MONTHS.find(m => m.value === values.sessionMonth)?.label.substring(0, 3);
          
          // 转换 classDays 到数字数组
          const classNumbers = values.classDays ? convertDaysToNumbers(values.classDays) : [];
          
          // 转换 tutorials 中的 classDay
          const tutorials = values.tutorials.map(tutorial => ({
            ...tutorial,
            classDay: DAY_TO_NUMBER[tutorial.classDay]
          }));
          
          const session = {
            ...values,
            courseSession: `${monthLabel} ${values.sessionYear}`,
            classDays: classNumbers,
            tutorials
          };
          
          onSubmit(session, actions);
        } catch (error) {
          actions.setSubmitting(false);
        }
      }}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => {
        //console.log('Form errors:', errors);
        
        return (
          <Form>
            <DialogTitle>
              {isEditing ? 'Edit Class' : 'Add New Class'}
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
              <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 0 }}>
                    Class Information
                  </Typography>
                </Grid>
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
                      <MenuItem key={programme.id} value={programme.id}>
                        {programme.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="userId"
                    label="Lecturer"
                    value={values.userId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.userId && Boolean(errors.userId)}
                    helperText={touched.userId && errors.userId}
                    margin="normal"
                  >
                    {lecturers.map((lecturer) => (
                      <MenuItem key={lecturer.id} value={lecturer.id}>
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
                    label="Class Name"
                    value={values.courseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.courseName && Boolean(errors.courseName)}
                    helperText={touched.courseName && errors.courseName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 0 }}>
                    Session Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="sessionMonth"
                    label="Session Month"
                    value={values.sessionMonth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sessionMonth && Boolean(errors.sessionMonth)}
                    helperText={touched.sessionMonth && errors.sessionMonth}
                    margin="normal"
                  >
                    {MONTHS.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    name="sessionYear"
                    label="Session Year"
                    value={values.sessionYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sessionYear && Boolean(errors.sessionYear)}
                    helperText={touched.sessionYear && errors.sessionYear}
                    margin="normal"
                  >
                    {generateYearOptions().map((year) => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 0 }}>
                    Class Schedule
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={values.startDate ? new Date(values.startDate) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          setFieldValue('startDate', formattedDate);
                        } else {
                          setFieldValue('startDate', null);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          name: "startDate",
                          error: touched.startDate && Boolean(errors.startDate),
                          helperText: touched.startDate && errors.startDate,
                          margin: "normal",
                          onBlur: handleBlur
                        }
                      }}
                      disablePast
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={values.endDate ? new Date(values.endDate) : null}
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          setFieldValue('endDate', formattedDate);
                        } else {
                          setFieldValue('endDate', null);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          name: "endDate",
                          error: touched.endDate && Boolean(errors.endDate),
                          helperText: touched.endDate && errors.endDate,
                          margin: "normal",
                          onBlur: handleBlur
                        }
                      }}
                      minDate={values.startDate ? new Date(values.startDate) : null}
                      disablePast
                    />
                  </LocalizationProvider>
                </Grid>
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
                      if (value.length > 0) { // 确保至少选择一天
                        setFieldValue('classDays', value);
                      }
                    }}
                    onBlur={handleBlur}
                    error={touched.classDays && Boolean(errors.classDays)}
                    helperText={touched.classDays && errors.classDays}
                    margin="normal"
                    input={<OutlinedInput label="Class Day" />}
                  >
                    {CLASS_DAYS.map((day) => (
                      <MenuItem key={day} value={day}>
                        <Checkbox checked={values.classDays.indexOf(day) > -1} />
                        <ListItemText primary={day} />
                      </MenuItem>
                    ))}
                  </TextField>
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
                          <Grid item xs={6}>
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
                              {TUTORIAL_DAYS.map((day) => (
                                <MenuItem key={day} value={day}>
                                  {day}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        );
      }}
    </Formik>
  );
};

export default CourseForm; 