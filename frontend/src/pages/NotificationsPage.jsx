// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import { fetchNotifications, markAllNotificationsAsRead } from "../services/notificationService";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../styles/Notifications.css"; // optional

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const parseLink = (msg) => {
    const qMatch = msg.match(/question.*ID[:#]?\s?(\d+)/i);
    const aMatch = msg.match(/answer.*ID[:#]?\s?(\d+)/i);
    if (qMatch) return `/questions/${qMatch[1]}`;
    if (aMatch) return `/questions/${aMatch[1]}`;
    return "/questions";
  };

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <main className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Notifications</h4>
            <button className="btn btn-sm btn-outline-info" onClick={handleMarkAllAsRead}>
              Mark All As Read
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-muted">You're all caught up! 🎉</p>
          ) : (
            <ul className="list-group">
              {notifications.map((note) => (
                <li
                  key={note.notification_id}
                  className={`list-group-item d-flex justify-content-between align-items-start ${
                    note.is_read ? "text-muted" : "fw-semibold"
                  }`}
                >
                  <Link to={parseLink(note.message)} className="text-decoration-none flex-grow-1">
                    {note.message}
                  </Link>
                  <small className="text-secondary ms-3">
                    {new Date(note.created_at).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
};

export default NotificationsPage;
