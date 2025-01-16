import api from './axios';

export const adminApi = {
  // dashboard
  getAllTotalCount: () => api.post('Admin/getAllTotalCount'),

  // programmes
  getAllProgrammes: (data) => api.post('Admin/getAllProgramme', data),
  createProgramme: (data) => api.post('Admin/createNewProgramme', data),
  updateProgramme: (data) => api.post('Admin/editProgramme', data),
  deleteProgramme: (data) => api.post('Admin/deleteProgramme', data),
  getProgrammeById: (id) => api.get(`Admin/programme/${id}`)
}; 