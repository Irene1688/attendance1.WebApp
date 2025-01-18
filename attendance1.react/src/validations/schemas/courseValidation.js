import * as Yup from 'yup';

export const courseValidationSchema = Yup.object().shape({
  programmeId: Yup.number()
    .required('Programme is required'),
  
  lecturerId: Yup.string()
    .required('Lecturer is required'),
  
  courseCode: Yup.string()
    .required('Course code is required')
    .matches(
      /^[A-Z]{3}[0-9]{4}$/,
      'Course code must be in format: ABC1234'
    ),
  
  courseName: Yup.string()
    .required('Course name is required')
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name must not exceed 100 characters'),
  
  courseSession: Yup.string()
    .required('Course session is required')
    .matches(
      /^(202[0-9])(0[1-9]|1[0-2])$/,
      'Course session must be in format: YYYYMM (e.g., 202401)'
    ),
  
  classDay: Yup.string()
    .required('Class day is required')
    .matches(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
      'Please select a valid day of the week'
    ),
  
  startDate: Yup.date()
    .required('Start date is required')
    .min(
      new Date(), 
      'Start date cannot be in the past'
    ),
  
  endDate: Yup.date()
    .required('End date is required')
    .min(
      Yup.ref('startDate'),
      'End date must be after start date'
    ),
  
  tutorials: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required('Tutorial name is required')
        .matches(
          /^T[0-9]{2}$/,
          'Tutorial name must be in format: T01'
        ),
      
      classDay: Yup.string()
        .required('Tutorial day is required')
        .matches(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
          'Please select a valid day of the week'
        )
    })
  ).min(1, 'At least one tutorial is required')
});

// 常量定义
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

export const COURSE_STATUS = {
  [STATUS.ACTIVE]: 'Active',
  [STATUS.ARCHIVED]: 'Archived'
};

// 辅助函数
export const generateCourseSession = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}${month}`;
};

export const formatTutorialName = (index) => {
  return `T${(index + 1).toString().padStart(2, '0')}`;
};

export const validateTutorialName = (name) => {
  return /^T[0-9]{2}$/.test(name);
};

export const validateCourseCode = (code) => {
  return /^[A-Z]{3}[0-9]{4}$/.test(code);
};

export const validateCourseSession = (session) => {
  return /^(202[0-9])(0[1-9]|1[0-2])$/.test(session);
};

export const getCourseStatus = (endWeek) => {
  const today = new Date();
  const endDate = new Date(endWeek);
  return endDate > today ? STATUS.ACTIVE : STATUS.ARCHIVED;
}; 