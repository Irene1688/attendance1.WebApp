import { Formik } from 'formik';
import { StyledLoginForm, StyledLoginTextField, StyledLoginButton } from '../../../styles';
import { studentLoginValidationSchema } from '../../../validations/schemas';

const StudentLoginForm = ({ isStaff, onSubmit, onHelperTextChange }) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={studentLoginValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, touched, errors, handleChange, handleBlur }) => {
        const HelperTextCount = (touched.email && errors.email ? 1 : 0) + 
        (touched.password && errors.password ? 1 : 0);

        return (
          <StyledLoginForm noValidate>
            <StyledLoginTextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              onChange={handleChange}
              onBlur={(e) => {
                handleBlur(e);
                onHelperTextChange(HelperTextCount);
              }}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              placeholder="e.g. abc12345678@student.uts.edu.my"
              isStaff={isStaff}
            />
            <StyledLoginTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              onChange={handleChange}
              onBlur={(e) => {
                handleBlur(e);
                onHelperTextChange(HelperTextCount);
              }}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              isStaff={isStaff}
            />
            <StyledLoginButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              isStaff={isStaff}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </StyledLoginButton>
          </StyledLoginForm>
        );
      }}
    </Formik>
  );
};

export default StudentLoginForm; 