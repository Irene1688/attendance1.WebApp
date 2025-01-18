import api from './axios';

export const adminApi = {
  // dashboard
  getAllTotalCount: () => api.post('Admin/getAllTotalCount'),

  // programmes
  getAllProgrammes: (data) => api.post('Admin/getAllProgramme', data),
  createProgramme: (data) => api.post('Admin/createNewProgramme', data),
  updateProgramme: (data) => api.post('Admin/editProgramme', data),
  deleteProgramme: (data) => api.post('Admin/deleteProgramme', data),

  // Users
  getAllLecturers: (data) => api.post('Admin/getAllLecturer', data),
  getAllStudents: (data) => api.post('Admin/getAllStudent', data),
  createUser: (data) => api.post('Admin/createNewUser', data),
  updateUser: (data) => api.post('Admin/editUser', data),
  deleteUser: (data) => api.post('Admin/deleteUser', data),
  resetPassword: (data) => api.post('Admin/resetPassword', data),

  // Courses
  getAllCourses: (data) => api.post('Admin/getAllCourse', data),
  createCourse: (data) => api.post('Admin/createNewCourse', data),
  updateCourse: (data) => api.post('Admin/editCourse', data),
  deleteCourse: (data) => api.post('Admin/deleteCourse', data),
  getCourseById: (id) => api.post('Admin/getCourseById', { id }),

  // Course Students
  getEnrolledStudents: (data) => api.post('Admin/getEnrolledStudents', data),
  getAvailableStudents: (data) => api.post('Admin/getAvailableStudents', data),
  addStudentToCourse: (data) => api.post('Admin/addStudentToCourse', data),
  removeStudentFromCourse: (data) => api.post('Admin/removeStudentFromCourse', data),

  // Course Attendance
  getCourseAttendanceRecords: (data) => api.post('Admin/getCourseAttendanceRecords', data),
}; 