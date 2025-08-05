import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="admin-page">
      <h2>All Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recipient</th>
                <th>Message</th>
                <th>Read</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.recipient?.name || "Unknown"}</td>
                  <td>{n.message}</td>
                  <td>{n.is_read ? "Yes" : "No"}</td>
                  <td>{new Date(n.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
