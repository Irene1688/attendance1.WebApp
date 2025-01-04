import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7187', // WebApi的URL
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      // 清除所有认证信息
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    const enhancedError = new Error(error.response?.data?.message || error.message);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default api; 