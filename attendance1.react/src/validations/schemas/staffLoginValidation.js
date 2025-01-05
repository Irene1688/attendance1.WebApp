import * as Yup from 'yup';
import { passwordRules } from '../rules';

export const staffLoginValidationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: passwordRules,
    role: Yup.string()
      .required('Role is required')
      .oneOf(['Admin', 'Lecturer'], 'Invalid role')
  }); 