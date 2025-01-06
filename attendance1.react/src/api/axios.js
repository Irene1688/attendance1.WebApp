import axios from 'axios';
import { authApi } from './auth';
import { navigate } from '../utils/navigate';

// 创建一个新的 axios 实例专门用于刷新 token
const refreshTokenApi = axios.create({
  baseURL: '/api',
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

const api = axios.create({
  baseURL: '/api',
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  retry: 3,
  retryDelay: 1000,
});

// 标记是否正在刷新token
let isRefreshing = false;
// 存储等待token刷新的请求
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    console.log('Axios Error:', err);
    const config = err.config;

    // 检查是否是刷新 token 的请求
    if (config.url === 'Auth/refreshToken') {
      return Promise.reject(err);
    }
  
    // retry when timeout and not 401
    if (err.code === 'ECONNABORTED' && 
        err.message.includes('timeout') && 
        (!err.response || err.response.status !== 401)) {
      
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < config.retry) {
        config.__retryCount += 1;
        console.log(`Retrying request (${config.__retryCount}/${config.retry})`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return api(config);
      }
    }

    if (err.response) {
      console.log('Axios Error Response:', {
        status: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers,
        data: err.response.data
      });

      // 处理 token 过期
      if (err.response.status === 401 && 
          err.response.headers['token-expired'] === 'true') {
        
        const originalRequest = err.config;
        if (originalRequest._retry) {
          return Promise.reject(err);
        }

        if (isRefreshing) {
          try {
            const token = await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          } catch (error) {
            return Promise.reject(error);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // 使用独立的 axios 实例发送刷新请求
          const response = await refreshTokenApi.post('Auth/refreshToken', { refreshToken });
          const responseData = response.data;

          if (responseData.success) {
            const { accessToken, refreshToken: newRefreshToken } = responseData.data;
            
            // 更新存储的 token
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // 更新 axios 默认 headers
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // 更新当前请求的 header
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            
            // 处理队列中的请求
            processQueue(null, accessToken);
            
            // 重试原始请求
            return api(originalRequest);
          } else {
            throw new Error('Failed to refresh token');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // 清除认证信息
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // 使用 navigate 工具重定向到登录页面并携带消息
          navigate('/login', { 
            message: 'Your session has expired. Please log in again.',
            severity: 'warning'
          });
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api; 