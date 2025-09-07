// src/services/authService.js

import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/users/';

export const registerUser = (userData) => {
  const isFormData = userData instanceof FormData;
  return axios.post(`${BASE_URL}create/`, userData, {
    headers: isFormData
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
  });
};


export const loginUser = (email, password) => {
  return axios.post(`${BASE_URL}login/`, { email, password });
};

export const loginWithGoogle = (id_token) => {
  return axios.post(`${BASE_URL}google-auth/`, { id_token });
};


export const refreshToken = (refresh) => {
  return axios.post(`${BASE_URL}token/refresh/`, { refresh });
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  window.location.href = '/login';
};


export const checkEmailVerified = async (email) => {
  try {
    const res = await axios.get(`${BASE_URL}check-verification/`, {
      params: { email }
    });
    return res.data?.verified === true;
  } catch {
    return false;
  }
};
export const verifyEmail = async (uidb64, token) => {
  try {
    const res = await axios.get(`${BASE_URL}verify-email/${uidb64}/${token}/`);
    const { access, refresh, user_id, name, email } = res.data;

    if (access && refresh) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify({ user_id, name, email }));
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Email verification failed" };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email) => {
  try {
    const res = await axios.post(`${BASE_URL}resend-verification/`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Failed to resend verification email" };
  }
};
