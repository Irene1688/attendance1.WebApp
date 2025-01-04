import { Formik } from 'formik';
import { StyledForm, StyledTextField, LoginButton } from '../styles/LoginStyles';
import { studentValidationSchema } from '../validations/loginValidation';

const StudentLoginForm = ({ isStaff, onSubmit, onHelperTextChange }) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={studentValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, touched, errors, handleChange, handleBlur }) => {
        const HelperTextCount = (touched.email && errors.email ? 1 : 0) + 
        (touched.password && errors.password ? 1 : 0);

        return (
          <StyledForm noValidate>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              id="email"
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
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
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
            <LoginButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              isStaff={isStaff}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </LoginButton>
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default StudentLoginForm; 