import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
