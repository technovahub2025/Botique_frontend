import axios from 'axios';

const api = axios.create({
  baseURL: (() => {
    const raw = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  })(),
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
