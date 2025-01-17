import * as Yup from 'yup';

const STUDENT_ID_REGEX = /^[A-Z]{3}[0-9]{8}$/; 

export const studentIdRules = Yup.string()
    .required('Student ID is required')
    .matches(
    STUDENT_ID_REGEX,
    'Student ID must be in format: ABC12345678'
    )
