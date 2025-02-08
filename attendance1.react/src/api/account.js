import api from './axios';

export const accountApi = {
    // admin only can access
    getLecturerSelection: () => api.post('Account/getLecturerSelection'),
    getAllLecturers: (data) => api.post('Account/getAllLecturer', data),
    getAllStudents: (data) => api.post('Account/getAllStudent', data),
    createUser: (data) => api.post('Account/createNewUser', data),
    updateUser: (data) => api.post('Account/editUser', data),
    deleteUser: (data) => api.post('Account/deleteUser', data),
    MultipleDeleteUser: (data) => api.post('Account/multipleDeleteUser', data),
    resetPassword: (data) => api.post('Account/resetPassword', data),
    rebindStudentDevice: (data) => api.post('Account/rebindStudentDevice', data),
};