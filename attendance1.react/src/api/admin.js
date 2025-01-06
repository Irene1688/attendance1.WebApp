import api from './axios';

export const adminApi = {
  getAllTotalCount: () => api.post('Admin/getAllTotalCount'),
  // ... 其他 admin API
}; 