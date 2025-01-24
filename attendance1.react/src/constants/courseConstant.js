import { STATUS } from './status';

export const SESSION_MONTH = [
  { value: 'Sep', label: 'September' },
  { value: 'Jul', label: 'July' },
  { value: 'Feb', label: 'February' }
];

export const ON_CLASS_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const DAY_TO_NUMBER = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5
};

export const NUMBER_TO_DAY = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday'
};

export const convertDaysToNumbers = (days) => {
  return days.map(day => DAY_TO_NUMBER[day]).sort((a, b) => a - b);
};

export const convertNumbersToDays = (numbers) => {
  return numbers.map(num => NUMBER_TO_DAY[num]).sort();
}; 

export const generateSessionYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return [
    { value: `${currentYear-1}/${currentYear}`, label: `${currentYear-1}/${currentYear}` },
    { value: `${currentYear}/${currentYear+1}`, label: `${currentYear}/${currentYear+1}` }
  ];
};

export const generateCourseSession = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  let sessionMonth;
  if (month >= 9) sessionMonth = 'Sep';
  else if (month >= 7) sessionMonth = 'Jul';
  else if (month >= 2) sessionMonth = 'Feb';
  else sessionMonth = 'Sep';
  
  return `${sessionMonth} ${year}/${year + 1}`;
};

export const generateDefaultTutorialName = (index) => {
  return `T${(index + 1).toString().padStart(2, '0')}`;
};

export const getCourseStatus = (endWeek) => {
  const today = new Date();
  const endDate = new Date(endWeek);
  return endDate > today ? STATUS.ACTIVE : STATUS.ARCHIVED;
};

export const isTodayOnClass = (classDay) => {
  if (!classDay) return false;
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const classDays = classDay.split(',').map(Number);
  // change Sunday to 7 to avoid 0
  const adjustedToday = today === 0 ? 7 : today;
  return classDays.includes(adjustedToday);
}; 