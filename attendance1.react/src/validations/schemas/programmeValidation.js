import * as Yup from 'yup';

export const programmeValidationSchema = Yup.object({
    name: Yup.string()
      .required('Programme name is required')
      .min(10, 'Programme name must be at least 10 characters')
      .max(100, 'Programme name must be at most 100 characters')
  });