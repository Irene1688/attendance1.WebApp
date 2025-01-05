import * as Yup from 'yup';

const STUDENT_EMAIL_REGEX = /^[a-z]{3}[0-9]{8}@student\.uts\.edu\.my$/; 

export const studentEmailRules = Yup.string()
    .required('Email is required')
    .matches(
    STUDENT_EMAIL_REGEX,
    'Email must be in format: abc12345678@student.uts.edu.my'
    )
