import * as Yup from 'yup';
import { nameRules, studentEmailRules, studentIdRules } from '../rules';

export const studentValidationSchema = Yup.object({
  name: nameRules,
  email: studentEmailRules,
  studentId: studentIdRules,
});