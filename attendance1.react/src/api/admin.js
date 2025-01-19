import api from './axios';

export const adminApi = {
  // dashboard
  getAllTotalCount: () => api.post('Admin/getAllTotalCount'),

  // programmes
  getProgrammeSelection: () => api.post('Admin/getProgrammeSelection'),
  getAllProgrammes: (data) => api.post('Admin/getAllProgramme', data),
  createProgramme: (data) => api.post('Admin/createNewProgramme', data),
  updateProgramme: (data) => api.post('Admin/editProgramme', data),
  deleteProgramme: (data) => api.post('Admin/deleteProgramme', data),

  // Users
  getLecturerSelection: () => api.post('Admin/getLecturerSelection'),
  getAllLecturers: (data) => api.post('Admin/getAllLecturer', data),
  getAllStudents: (data) => api.post('Admin/getAllStudent', data),
  createUser: (data) => api.post('Admin/createNewUser', data),
  updateUser: (data) => api.post('Admin/editUser', data),
  deleteUser: (data) => api.post('Admin/deleteUser', data),
  MultipleDeleteUser: (data) => api.post('Admin/multipleDeleteUser', data),
  resetPassword: (data) => api.post('Admin/resetPassword', data),

  // Courses
  getAllCourses: (data) => api.post('Admin/getAllCourse', data),
  createCourse: (data) => api.post('Admin/createNewCourse', data),
  updateCourse: (data) => api.post('Admin/editCourse', data),
  deleteCourse: (data) => api.post('Admin/deleteCourse', data),
  MultipleDeleteCourse: (data) => api.post('Admin/multipleDeleteCourse', data),

  // Course Students
  getEnrolledStudents: (data) => api.post('Lecturer/getEnrolledStudents', data),
  getAvailableStudents: (data) => api.post('Lecturer/getAvailableStudents', data),
  addStudentToCourse: (data) => api.post('Admin/addStudentsToCourse', data),
  removeStudentFromCourse: (data) => api.post('Lecturer/removeStudentFromClass', data),

  // Course Attendance
  getAttendanceRecordsByCourseId: (data) => api.post('Admin/getAttendanceRecordByCourseId', data),
}; 