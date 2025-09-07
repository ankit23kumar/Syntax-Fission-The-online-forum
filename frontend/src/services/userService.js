// src/services/userService.js
import axiosInstance from './api';

// Complete profile after Step 1 registration & email verification
export const completeProfile = async (formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error("completeProfile expects FormData");
  }

  try {
    const res = await axiosInstance.post(`/users/complete-profile/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Failed to complete profile" };
  }
};

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
