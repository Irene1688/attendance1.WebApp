import * as Yup from 'yup';

export const attendanceSessionValidationSchema = Yup.object().shape({
  // Date validation
  AttendanceDate: Yup.date()
    .required('Date is required'),
  
  // Time validation
  StartTime: Yup.date()
    .required('Attendance time is required'),
  
  // Session type validation
  IsLecture: Yup.boolean()
    .required('Session type is required'),
  
  // Tutorial validation (required if IsLecture is false)
  TutorialId: Yup.number()
    .when('IsLecture', {
      is: false,
      then: () => Yup.number()
        .required('Tutorial is required')
        .min(1, 'Tutorial is required'),
      otherwise: () => Yup.number().nullable()
    })
});