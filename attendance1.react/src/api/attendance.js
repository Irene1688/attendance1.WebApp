import api from './axios';

export const attendanceApi = {
  getAttendanceRecordsByCourseId: (data) => api.post('Attendance/getAttendanceRecordByCourseId', data),

}