// src/api/axiosInstance.js
import axios from 'axios';
import { history } from '../utils/history'; // <-- تغییر ۱: ایمپورت history

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}users/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);

        } catch (refreshError) {
          console.error("Refresh token is invalid or expired", refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          history.push('/login'); // <-- تغییر ۲: استفاده از history به جای window.location
          return Promise.reject(refreshError);
        }
      } else {
        console.log("No refresh token available.");
        history.push('/login'); // <-- تغییر ۳: استفاده از history به جای window.location
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;