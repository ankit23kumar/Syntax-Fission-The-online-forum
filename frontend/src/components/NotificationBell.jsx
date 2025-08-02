// src/components/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../services/notificationService";
import "../styles/Notifications.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = async () => {
    const newState = !dropdownOpen;
    setDropdownOpen(newState);
    if (newState) {
      try {
        await markAllNotificationsAsRead();
        loadNotifications(); // sync count to 0
      } catch (err) {
        console.error("Error marking notifications read", err);
      }
    }
  };

  const parseMessageToLink = (message) => {
    const qMatch = message.match(/question.*ID[:#]?\s?(\d+)/i);
    const aMatch = message.match(/answer.*ID[:#]?\s?(\d+)/i);
    if (qMatch) return `/questions/${qMatch[1]}`;
    if (aMatch) return `/questions/${aMatch[1]}`;
    return "/questions";
  };

  return (
    <div className="dropdown position-relative">
      <button className="notification-btn" onClick={toggleDropdown}>
        <IoNotificationsOutline size={26} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {dropdownOpen && (
        <div
          className="shadow-sm p-2 bg-white border rounded"
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            minWidth: "320px",
            zIndex: 1000,
          }}
        >
          <div className="fw-bold px-2 mb-2">Notifications</div>
          {notifications.length === 0 ? (
            <p className="px-2 text-muted">No notifications.</p>
          ) : (
            <>
              {notifications.slice(0, 5).map((note) => (
                <Link
                  key={note.notification_id}
                  to={parseMessageToLink(note.message)}
                  className={`dropdown-item small ${
                    note.is_read ? "text-muted" : "fw-bold"
                  }`}
                >
                  {note.message}
                </Link>
              ))}
            </>
          )}
          <hr className="my-2" />
          <Link
            to="/notifications"
            className="dropdown-item text-center text-info"
          >
            Show all notifications →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
