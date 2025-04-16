import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "https://chatspacez.onrender.com";

export const AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`, // /api prefix here
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
AxiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.hash = '#/signin';
    }
    return Promise.reject(error);
  }
);