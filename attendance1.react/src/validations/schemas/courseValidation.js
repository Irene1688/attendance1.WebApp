import * as Yup from 'yup';

// export const MONTHS = [
//   { value: 'Sep', label: 'September' },
//   { value: 'Jul', label: 'July' },
//   { value: 'Feb', label: 'February' }
// ];

// export const generateYearOptions = () => {
//   const currentYear = new Date().getFullYear();
//   return [
//     { value: `${currentYear-1}/${currentYear}`, label: `${currentYear-1}/${currentYear}` },
//     { value: `${currentYear}/${currentYear+1}`, label: `${currentYear}/${currentYear+1}` }
//   ];
// };

export const courseValidationSchema = Yup.object().shape({
  programmeId: Yup.number()
    .required('Programme is required')
    .positive('Invalid programme ID')
    .integer('Invalid programme ID'),
  
  userId: Yup.number()
    .required('Lecturer is required')
    .positive('Invalid lecturer ID')
    .integer('Invalid lecturer ID'),
  
  courseCode: Yup.string()
    .required('Course code is required')
    .matches(
      /^[A-Z]{3}\s?[0-9]{4}$/,
      'Course code must be in format: ABC1234 or ABC 1234'
    ),
  
  courseName: Yup.string()
    .required('Course name is required')
    .min(3, 'Course name must be at least 3 characters')
    .max(100, 'Course name must not exceed 100 characters'),
  
  sessionMonth: Yup.string()
    .required('Session month is required'),
  
  sessionYear: Yup.string()
    .required('Course session is required'),
  
  classDays: Yup.array()
    .of(
      Yup.string().oneOf(
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'Invalid class day selected'
      )
    )
    .min(1, 'At least one class day must be selected')
    .required('Class days are required')
    .nullable(false)
    .default([]),
  
  startDate: Yup.date()
    .required('Start date is required'),
  
  endDate: Yup.date()
    .required('End date is required')
    .min(
      Yup.ref('startDate'),
      'End date must be after start date'
    ),
  
  tutorials: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      name: Yup.string()
        .required('Tutorial name is required')
        .matches(
          /^T[0-9]{2}$/,
          'Tutorial name must be in format: T01'
        ),
      
      classDay: Yup.string()
        .required('Tutorial day is required')
        .matches(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday)$/,
          'Please select a valid day of the week'
        )
    })
  ).min(1, 'At least one tutorial is required')
});

// 常量定义
// export const TUTORIAL_DAYS = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday'
// ];

// export const STATUS = {
//   ACTIVE: 'ACTIVE',
//   ARCHIVED: 'ARCHIVED'
// };

// export const COURSE_STATUS = {
//   [STATUS.ACTIVE]: 'Active',
//   [STATUS.ARCHIVED]: 'Archived'
// };

// 辅助函数
// export const generateCourseSession = () => {
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth() + 1;
  
//   let sessionMonth;
//   if (month >= 9) sessionMonth = 'Sep';
//   else if (month >= 7) sessionMonth = 'Jul';
//   else if (month >= 2) sessionMonth = 'Feb';
//   else sessionMonth = 'Sep';
  
//   return `${sessionMonth} ${year}/${year + 1}`;
// };

// export const formatTutorialName = (index) => {
//   return `T${(index + 1).toString().padStart(2, '0')}`;
// };

export const validateTutorialName = (name) => {
  return /^T[0-9]{2}$/.test(name);
};

export const validateCourseCode = (code) => {
  return /^[A-Z]{3}[0-9]{4}$/.test(code);
};

export const validateCourseSession = (session) => {
  return /^(202[0-9])(0[1-9]|1[0-2])$/.test(session);
};

// export const getCourseStatus = (endWeek) => {
//   const today = new Date();
//   const endDate = new Date(endWeek);
//   return endDate > today ? STATUS.ACTIVE : STATUS.ARCHIVED;
// };

// // 星期几到数字的映射
// export const DAY_TO_NUMBER = {
//   'Monday': 1,
//   'Tuesday': 2,
//   'Wednesday': 3,
//   'Thursday': 4,
//   'Friday': 5
// };

// // 数字到星期几的映射
// export const NUMBER_TO_DAY = {
//   1: 'Monday',
//   2: 'Tuesday',
//   3: 'Wednesday',
//   4: 'Thursday',
//   5: 'Friday'
// };

// 转换星期几数组到数字数组
// export const convertDaysToNumbers = (days) => {
//   return days.map(day => DAY_TO_NUMBER[day]).sort((a, b) => a - b);
// };

// // 转换数字数组到星期几数组
// export const convertNumbersToDays = (numbers) => {
//   return numbers.map(num => NUMBER_TO_DAY[num]).sort();
// }; 