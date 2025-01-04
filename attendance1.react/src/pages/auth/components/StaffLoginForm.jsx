import { Formik } from 'formik';
import { Box, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import { StyledForm, StyledTextField, LoginButton } from '../styles/LoginStyles';
import { staffValidationSchema } from '../validations/loginValidation';

const StaffLoginForm = ({ isStaff, onSubmit }) => {
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        role: ''
      }}
      validationSchema={staffValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, touched, errors, handleChange, handleBlur }) => (
        <StyledForm noValidate>
          <StyledTextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
            placeholder="Enter your username"
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
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            placeholder="Enter your password"
            isStaff={isStaff}
          />
          <Box sx={{ mt: 2 }}>
            <RadioGroup
              row
              name="role"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <FormControlLabel 
                value="Admin" 
                control={<Radio />} 
                label="Admin" 
              />
              <FormControlLabel 
                value="Lecturer" 
                control={<Radio />} 
                label="Lecturer" 
              />
            </RadioGroup>
            {touched.role && errors.role && (
              <Typography color="error" variant="caption">
                {errors.role}
              </Typography>
            )}
          </Box>
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
      )}
    </Formik>
  );
};

export default StaffLoginForm; 