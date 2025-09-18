// src/pages/AdminNotifications.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
// Reuse the same styles for consistency
import "../styles/AdminQuestions.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      showToast("Failed to fetch notifications.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (notification) => {
    setNotificationToDelete(notification);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setNotificationToDelete(null);
    setShowConfirmModal(false);
  };

  const deleteNotification = async () => {
    if (!notificationToDelete) return;
    try {
      // Use the correct primary key 'notification_id'
      await api.delete(`/admin/notifications/${notificationToDelete.notification_id}/delete/`);
      setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationToDelete.notification_id));
      showToast("Notification deleted successfully.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete notification.", "danger");
    } finally {
      closeConfirmModal();
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">Manage Notifications</h2>
            <p className="page-subtitle">Audit all system notifications sent to users.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="admin-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Message</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading notifications...</td></tr>
            ) : notifications.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-4">No notifications found.</td></tr>
            ) : (
              notifications.map((n) => (
                <tr key={n.notification_id}>
                  <td>
                    <div className="author-info-cell">
                      <img src={n.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={n.user?.name} />
                      <span>{n.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>{n.message}</td>
                  <td>
                    <span className={`status-badge ${n.is_read ? 'active' : 'inactive'}`}>
                      {n.is_read ? <FaCheckCircle /> : <FaTimesCircle />}
                      {n.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => openConfirmModal(n)}
                      className="action-btn delete"
                      title="Delete Notification"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div className="modal-backdrop-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content-dark confirm-modal" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
              <div className="modal-body-dark text-center">
                <div className="confirm-icon"><FaTrash /></div>
                <h5>Delete Notification</h5>
                <p>Are you sure you want to delete this notification? This action is irreversible.</p>
              </div>
              <div className="modal-footer-dark confirm-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteNotification}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotifications;