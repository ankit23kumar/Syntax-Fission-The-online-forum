// src/services/notificationService.js
import axiosInstance from "./api";

// Fetch all notifications for the current user
export const fetchNotifications = async () => {
  const response = await axiosInstance.get("/notifications/");
  return response.data;
};

// Mark all unread notifications as read
export const markAllNotificationsAsRead = async () => {
  await axiosInstance.post("/notifications/mark-all-read/");
};

// Optional: mark a single notification as read
export const markNotificationAsRead = async (notificationId) => {
  await axiosInstance.patch(`/notifications/${notificationId}/`, {
    is_read: true,
  });
};
