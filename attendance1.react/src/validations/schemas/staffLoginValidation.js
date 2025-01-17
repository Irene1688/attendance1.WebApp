import * as Yup from 'yup';
import { nameRules, passwordRules } from '../rules';

export const staffLoginValidationSchema = Yup.object({
    username: nameRules,
    password: passwordRules,
    role: Yup.string()
      .required('Role is required')
      .oneOf(['Admin', 'Lecturer'], 'Invalid role')
  }); 