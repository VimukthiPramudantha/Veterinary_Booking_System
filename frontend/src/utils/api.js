// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || // Prefer env variable
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/api' // ✅ Correct port
      : '/api'),
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
