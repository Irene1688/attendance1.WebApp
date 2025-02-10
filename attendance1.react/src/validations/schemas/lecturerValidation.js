import * as Yup from 'yup';
import { nameRules } from '../rules';

export const lecturerValidationSchema = (isCreating = true) => Yup.object({
    name: nameRules,
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    campusId: Yup.string()
        .required('Lecturer ID is required')
        .min(6, 'Lecturer ID must be at least 6 characters as it will be used as defaultpassword'),
    programmeId: isCreating 
        ? Yup.number()
            .required('Programme is required')
            .positive('Invalid programme ID')
            .integer('Invalid programme ID')
        : Yup.number().nullable(),
  });