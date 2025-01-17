import * as Yup from 'yup';
import { nameRules } from '../rules';

export const programmeValidationSchema = Yup.object({
  name: nameRules,
});