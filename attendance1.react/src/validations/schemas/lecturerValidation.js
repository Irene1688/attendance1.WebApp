import * as Yup from 'yup';
import { nameRules } from '../rules';

export const lecturerValidationSchema = Yup.object({
    name: nameRules,
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    campusId: Yup.string()
        .required('Lecturer ID is required')
        .min(3, 'Lecturer ID must be at least 3 characters'),
  });