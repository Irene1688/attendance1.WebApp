import * as Yup from 'yup';

const STUDENT_EMAIL_REGEX = /^[a-z]{3}[0-9]{8}@student\.uts\.edu\.my$/;

export const studentValidationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .matches(
      STUDENT_EMAIL_REGEX,
      'Email must be in format: abc12345678@student.uts.edu.my'
    ),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const staffValidationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: Yup.string()
    .required('Role is required')
    .oneOf(['Admin', 'Lecturer'], 'Invalid role')
}); 