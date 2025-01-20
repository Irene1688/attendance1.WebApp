import api from './axios';

export const programmeApi = {
    getProgrammeSelection: () => api.post('Programme/getProgrammeSelection'),
    getAllProgrammes: (data) => api.post('Programme/getAllProgramme', data),
    createProgramme: (data) => api.post('Programme/createNewProgramme', data),
    updateProgramme: (data) => api.post('Programme/editProgramme', data),
    deleteProgramme: (data) => api.post('Programme/deleteProgramme', data),
}; 