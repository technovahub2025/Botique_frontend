import axios from 'axios';

const adminApi = axios.create({
  baseURL: (() => {
    const raw = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  })(),
  withCredentials: true,
});

   adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const MAX_RETRIES = 3;

const isRetryable = (error) => {
  if (!error.response) {
    const code = error.code;
    return Boolean(code) && ['ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN'].includes(code);
  }
  if (error.response?.data?.isRetryable === true) {
    return true;
  }
  const status = error.response.status;
  return status >= 500 && status < 600;
};

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    if (config) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= MAX_RETRIES && isRetryable(error)) {
        const delay = Math.min(1000 * Math.pow(2, config._retryCount - 1), 5000);
        return new Promise((resolve) => setTimeout(resolve, delay)).then(() => adminApi(config));
      }
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default adminApi;
