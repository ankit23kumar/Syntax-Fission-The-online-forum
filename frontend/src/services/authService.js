import axiosInstance from './api';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/users/';

export const registerUser = (userData) => {
  return axios.post(`${BASE_URL}create/`, userData);
};

export const loginUser = (email, password) => {
  return axios.post(`${BASE_URL}login/`, { email, password });
};

export const loginWithGoogle = (id_token) => {
  return axios.post(`${BASE_URL}google-auth/`, { id_token });
};

export const refreshToken = (refresh) => {
  return axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  window.location.href = '/login'; // redirect
};
