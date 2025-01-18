import * as Yup from 'yup';
import { nameRules, studentEmailRules, studentIdRules } from '../rules';

export const studentValidationSchema = (isCreating) => Yup.object({
  name: nameRules,
  email: studentEmailRules,
  campusId: studentIdRules,
  programmeId: isCreating ? Yup.string()
    .required('Programme is required')
    : Yup.string()
});