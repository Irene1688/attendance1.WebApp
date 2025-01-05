import * as Yup from 'yup';

export const passwordRules = Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters');
