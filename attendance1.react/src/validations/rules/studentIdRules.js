import * as Yup from 'yup';

const STUDENT_ID_REGEX = /^[a-z]{3}[0-9]{8}$/; 

export const studentIdRules = Yup.string()
    .required('Student ID is required')
    .matches(
    STUDENT_ID_REGEX,
    'Student ID must be in format: abc12345678'
    )
