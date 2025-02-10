import * as Yup from 'yup';
import { studentIdRules } from '../rules';

export const singleStudentSchema = Yup.object().shape({
    studentId: studentIdRules,
    studentName: Yup.string()
      .required('Student name is required')
      .min(3, 'Student name must be at least 3 characters'),
    tutorialId: Yup.number()
      .required('Tutorial session is required'),
    defaultAttendance: Yup.boolean()
      .required('Default attendance is required')
  });