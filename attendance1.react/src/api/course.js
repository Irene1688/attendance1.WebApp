import api from './axios';

export const courseApi = {
  // Courses
  getAllCourses: (data) => api.post('Course/getAllCourse', data),
  getCourseDetailsById: (data) => api.post('Course/getCourseDetailsById', data),
  createCourse: (data) => api.post('Course/createNewCourse', data),
  updateCourse: (data) => api.post('Course/editCourse', data),
  deleteCourse: (data) => api.post('Course/deleteCourse', data),
  MultipleDeleteCourse: (data) => api.post('Course/multipleDeleteCourse', data),

  // Course Students
  getEnrolledStudents: (data) => api.post('Course/getEnrolledStudents', data),
  getAvailableStudents: (data) => api.post('Course/getAvailableStudents', data),
  addStudentToCourseAndTutorial: (data) => api.post('Course/addStudentsToCourseAndTutorial', data),
  addSingleStudentToCourse: (data) => api.post('Course/addSingleStudentToCourse', data),
  addStudentsByCsvToCourse: (formData) => api.post('Course/addStudentsByCsvToCourse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  removeStudentFromCourse: (data) => api.post('Course/removeStudentFromCourse', data),

  // lecturer module
  getActiveCourseSelectionByLecturerId: (data) => api.post('Course/getActiveCourseSelectionByLecturerId', data),
  getActiveCoursesByLecturerId: (data) => api.post('Course/getActiveCoursesByLecturerId', data),

  // student module
  getEnrolledCoursesSelectionByStudentId: (data) => api.post('Course/getEnrolledCoursesSelectionByStudentId', data),
  getEnrolledCourseDetailsWithEnrolledTutorial: (data) => api.post('Course/getEnrolledCourseDetailsWithEnrolledTutorial', data),

}; 