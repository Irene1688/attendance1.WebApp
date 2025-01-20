import api from './axios';

export const userApi = {
  getUserProfile: (data) => api.post('User/viewProfile', data),
  updateProfileWithPassword: (data) => api.post('User/editProfileWithPassword', data),
}; 