import * as Yup from 'yup';
import { studentEmailRules, passwordRules } from '../rules';

export const studentLoginValidationSchema = Yup.object({
    email: studentEmailRules,
    password: passwordRules
  });