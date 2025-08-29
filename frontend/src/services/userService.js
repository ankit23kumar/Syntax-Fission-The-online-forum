// src/services/userService.js
import axiosInstance from './api';

export const getProfile = () => axiosInstance.get('/users/profile/');
export const updateProfile = (formData) =>
  axiosInstance.put('/users/profile/edit/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const getActivity = () => axiosInstance.get('/users/activity/');
export const getAccountMeta = () => axiosInstance.get('/users/account/');
export const deleteAccount = () => axiosInstance.delete('/users/delete/');
export const updatePassword = (password, confirm_password) =>
  axiosInstance.put('/users/update-password/', { password, confirm_password });
