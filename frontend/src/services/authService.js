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

// +++ NEW: Function to verify the OTP +++
export const verifyOTP = async (email, otp) => {
  return axios.post(`${BASE_URL}verify-otp/`, { email, otp });
};

// +++ NEW: Function to resend the OTP +++
export const resendOTP = async (email) => {
  return axios.post(`${BASE_URL}resend-otp/`, { email });
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
