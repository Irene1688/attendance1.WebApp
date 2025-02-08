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
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } 
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // 如果是设备指纹验证失败
      if (error.response.data?.message?.includes('device')) {
        store.dispatch(logout());
        window.location.href = '/login?error=invalid_device';
        return Promise.reject(new Error('Invalid device'));
      }
      
      const config = error.config;

      // 如果是刷新token的请求失败，直接返回错误
      if (config.url === 'Auth/refreshToken') {
        return Promise.reject(error);
      }

      // token expired
      if (error.response?.status === 401 &&
          error.response?.headers['token-expired'] && 
          !config._retry) {
        config._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            navigate('/login');
            showErrorMessage('Your session has expired, please login again');
          }

          const response = await refreshTokenApi.post('Auth/refreshToken', { refreshToken });
          
          if (response.data?.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
            //delete config.signal;
            if (!config.signal) {
              config.signal = new AbortController().signal;
            }
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
    }
    return Promise.reject(error);
  }
);

export default api; 