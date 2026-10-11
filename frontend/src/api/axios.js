import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('savebite_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config ? error.config.url : '';
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response && error.response.status === 401 && !isAuthRequest) {
      localStorage.removeItem('savebite_token');
      localStorage.removeItem('savebite_user');
      window.location.href = '/login?expired=1';
    }

    return Promise.reject(error);
  }
);

export default api;
