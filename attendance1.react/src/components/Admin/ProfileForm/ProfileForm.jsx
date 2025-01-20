import { Formik, Form } from 'formik';
import { 
  Box, 
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { TextButton } from '../../Common';
import { profileValidationSchema } from '../../../validations/schemas';
import { USER_ROLES, isStudent } from '../../../constants/userRoles';
import { styles } from './ProfileForm.styles';

const ProfileForm = ({
  initialValues,
  isEditing,
  role,
  onSubmit,
  onCancel
}) => {
  const theme = useTheme();
  const themedStyles = styles(theme);

  if (!isEditing) {
    return (
      <Box>
        <Box sx={themedStyles.section}>
          <Typography variant="subtitle1" sx={themedStyles.sectionTitle}>
            Basic Information
          </Typography>
          <Box sx={themedStyles.fieldGroup}>
            <Typography variant="body2" color="textSecondary">
              Name
            </Typography>
            <Typography variant="body1">
              {initialValues.name}
            </Typography>
          </Box>
          <Box sx={themedStyles.fieldGroup}>
            <Typography variant="body2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">
              {initialValues.email}
            </Typography>
          </Box>
          <Box sx={themedStyles.fieldGroup}>
            <Typography variant="body2" color="textSecondary">
              Programme
            </Typography>
            <Typography variant="body1">
              {initialValues.programmeName || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={profileValidationSchema(role)}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box sx={themedStyles.section}>
            <Typography variant="subtitle1" sx={themedStyles.sectionTitle}>
              Basic Information
            </Typography>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              sx={themedStyles.field}
            />
            <TextField
              fullWidth
              name="campusId"
              label={`${USER_ROLES[role.toUpperCase()]} ID`}
              value={initialValues.campusId}
              sx={themedStyles.field}
              disabled
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
              disabled={isStudent(role)}
              sx={themedStyles.field}
            />
            <TextField
              fullWidth
              name="programmeName"
              label="Programme"
              value={initialValues.programmeName || '-'}
              sx={themedStyles.field}
              disabled
            />
          </Box>

          <Box sx={themedStyles.section}>
            <Typography variant="subtitle1" sx={themedStyles.sectionTitle}>
              Change Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              name="currentPassword"
              label="Current Password"
              value={values.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentPassword && Boolean(errors.currentPassword)}
              helperText={touched.currentPassword && errors.currentPassword}
              sx={themedStyles.field}
            />
            <TextField
              fullWidth
              type="password"
              name="newPassword"
              label="New Password"
              value={values.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newPassword && Boolean(errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
              sx={themedStyles.field}
            />
            <TextField
              fullWidth
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={themedStyles.field}
            />
          </Box>

          <Box sx={themedStyles.actions}>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </TextButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm; 