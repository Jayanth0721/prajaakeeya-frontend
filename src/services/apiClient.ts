import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const apiHost = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const normalizedHost = apiHost ? String(apiHost).replace(/\/+$/g, '') : '';
const baseURL = normalizedHost ? `${normalizedHost}/api` : '/api';

const apiClient = axios.create({
  baseURL,
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
