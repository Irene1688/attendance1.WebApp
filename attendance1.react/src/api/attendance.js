import api from './axios';

export const attendanceApi = {
  getAttendanceRecordsByCourseId: (data) => api.post('Attendance/getAttendanceRecordByCourseId', data),
  generateAttendanceCode: (data) => api.post('Attendance/generateAttendanceCode', data),
  getCourseStudentAttendanceRecords: (data) => api.post('Attendance/getCourseStudentAttendanceRecords', data),
  markAbsentForUnattended: (data) => api.post('Attendance/markAbsentForUnattended', data),
}