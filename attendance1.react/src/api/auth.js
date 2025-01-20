import api from './axios';

export const authApi = {
  studentLogin: (data) => api.post('Auth/studentLogin', data),
  staffLogin: (data) => api.post('Auth/staffLogin', data),
  logout: (data) => api.post('Auth/logout', data),
  refreshToken: (data) => api.post('Auth/refreshToken', data),
}; 