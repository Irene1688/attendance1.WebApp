import axios from 'axios';

// 创建一个新的 axios 实例专门用于刷新 token
const refreshTokenApi = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

const api = axios.create({
  baseURL: '/api',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  retry: 3,
  retryDelay: 1000,
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
  response => response.data,
  async (err) => {
    const config = err.config;

    // 如果是刷新token的请求失败，直接返回错误
    if (config.url === 'Auth/refreshToken') {
      return Promise.reject(err);
    }

    // token expired
    if (err.response?.status === 401 && 
        err.response?.headers['token-expired'] && 
        !config._retry) {
      config._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await refreshTokenApi.post('Auth/refreshToken', { refreshToken });
        
        if (response.data?.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          config.headers.Authorization = `Bearer ${accessToken}`;
          return api(config);  // retry original request
        }
      } catch (refreshError) {
        // 确保错误消息被正确传递
        if (refreshError.response?.data?.errorMessage) {
          return Promise.reject({
            ...refreshError,
            response: {
              ...refreshError.response,
              data: {
                ...refreshError.response.data,
                errorMessage: refreshError.response.data.errorMessage
              }
            }
          });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api; 