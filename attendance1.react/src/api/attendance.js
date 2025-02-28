import api from './axios';

export const attendanceApi = {
  getAttendanceRecordsByCourseId: (data) => api.post('Attendance/getAttendanceRecordByCourseId', data),
  generateAttendanceCode: (data) => api.post('Attendance/generateAttendanceCode', data),
  getCourseStudentAttendanceRecords: (data) => api.post('Attendance/getCourseStudentAttendanceRecords', data),
  markAbsentForUnattended: (data) => api.post('Attendance/markAbsentForUnattended', data),
  generateNewAttendanceSession: (data) => api.post('Attendance/generateAttendanceRecords', data),
  updateStudentAttendanceStatus: (data) => api.post('Attendance/updateStudentAttendanceStatus', data),
  getAttendanceOfStudent: (data, isCurrentWeek) => api.post('Attendance/getAttendanceOfStudent', data, { params: { isCurrentWeek } }),
  submitAttendance: (data) => api.post('Attendance/submitAttendance', data),
  deleteAttendanceRecord: (data) => api.post('Attendance/deleteAttendanceRecord', data)
}