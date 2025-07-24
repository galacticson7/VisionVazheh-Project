// src/api/axiosInstance.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', accept: 'application/json' },
});

// --- START: پیاده‌سازی راه‌حل Grok ---
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // اگر در حال رفرش بودیم، درخواست فعلی را در صف انتظار قرار بده
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}users/token/refresh/`, { refresh: refreshToken });
          const newAccessToken = response.data.access;
          
          localStorage.setItem('access_token', newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          
          // به تمام درخواست‌های منتظر، توکن جدید را اطلاع بده
          onRefreshed(newAccessToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token is invalid or expired", refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        window.location.href = '/login/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
// --- END: پیاده‌سازی راه‌حل Grok ---

export default axiosInstance;