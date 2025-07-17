import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // update if deployed

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
axiosInstance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosInstance;
