import api from './axios';

export const courseApi = {
  // Courses
  getAllCourses: (data) => api.post('Course/getAllCourse', data),
  createCourse: (data) => api.post('Course/createNewCourse', data),
  updateCourse: (data) => api.post('Course/editCourse', data),
  deleteCourse: (data) => api.post('Course/deleteCourse', data),
  MultipleDeleteCourse: (data) => api.post('Course/multipleDeleteCourse', data),

  // Course Students
  getEnrolledStudents: (data) => api.post('Course/getEnrolledStudents', data),
  getAvailableStudents: (data) => api.post('Course/getAvailableStudents', data),
  addStudentToCourseAndTutorial: (data) => api.post('Course/addStudentsToCourseAndTutorial', data),
  removeStudentFromCourse: (data) => api.post('Course/removeStudentFromCourse', data),
}; 