import { Formik, Form } from 'formik';
import { 
  Box, 
  Typography,
  TextField, 
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import { lecturerValidationSchema, studentValidationSchema } from '../../../validations/schemas';
import { TextButton, PromptMessage } from '../../Common';
import { useMessageContext } from '../../../contexts/MessageContext';
import { USER_ROLES } from '../../../constants/userRoles';

const UserForm = ({ initialValues, userRole, onSubmit, onCancel, isEditing, programmeSelection }) => {
  const { message, hideMessage } = useMessageContext();

  return (
    <Formik
      initialValues={{
        campusId: '',
        name: '',
        email: '',
        programmeId: '',
        role: userRole,
        ...initialValues
      }}
      validationSchema={userRole === USER_ROLES.LECTURER
        ? lecturerValidationSchema(!isEditing) 
        : studentValidationSchema(!isEditing)}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <DialogTitle>
            {isEditing 
              ? `Edit ${userRole}` 
              : `Add New ${userRole}`
            }
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
                  scrollToTop={false}
                />
              </Box>
            )}
            <Box>
              { !isEditing && (
                <Typography variant="body1" color="text.info">
                  *The default password is the same as the {userRole} ID (lowercase).
                </Typography>
              )}
              <TextField
                fullWidth
                name="campusId"
                label={`${userRole} ID`}
                value={values.campusId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.campusId && Boolean(errors.campusId)}
                helperText={touched.campusId && errors.campusId}
                margin="normal"
                disabled={isEditing && userRole === USER_ROLES.LECTURER}
              />
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
              />
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
              />
              { !isEditing && (
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
                  {programmeSelection.map((programme) => (
                    <MenuItem key={programme.id} value={programme.id}>
                      {programme.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
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

export default UserForm; 