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
}; 