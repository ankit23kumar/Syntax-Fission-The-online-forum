// src/components/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Sidebar.css";
// Import all necessary icons
import {
  FaHome, FaTachometerAlt, FaQuestionCircle, FaStar, FaInfoCircle,
  FaSignOutAlt, FaUsers, FaTags, FaComment, FaThumbsUp, FaBell
} from 'react-icons/fa';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // --- THIS IS THE KEY LOGIC ---
  const isAdminPage = location.pathname.startsWith("/admin");
  const isDashboard = location.pathname.startsWith("/dashboard");
  const currentTag = searchParams.get("tags")?.toLowerCase() || "";

  const tagList = ["C", "C++", "Python", "Java", "HTML", "CSS", "JavaScript", "React", "Django", "Others"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTagFilter = (tag) => {
    const updatedParams = new URLSearchParams(location.search);
    const normalizedTag = tag.toLowerCase();

    if (currentTag === normalizedTag) {
      updatedParams.delete("tags");
    } else {
      updatedParams.set("tags", normalizedTag);
    }
    navigate(`/new-questions?${updatedParams.toString()}`);
  };

  // --- RENDER ADMIN SIDEBAR ---
  if (isAdminPage) {
    return (
      <aside className="sidebar admin-sidebar">
        <h4 className="admin-title">Admin Panel</h4>
        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item"><FaHome /><span>Home</span></NavLink>
          <NavLink to="/admin/dashboard" className="nav-item"><FaTachometerAlt /><span>Dashboard</span></NavLink>
          <NavLink to="/admin/users" className="nav-item"><FaUsers /><span>Users</span></NavLink>
          <NavLink to="/admin/questions" className="nav-item"><FaQuestionCircle /><span>Questions</span></NavLink>
          <NavLink to="/admin/tags" className="nav-item"><FaTags /><span>Tags</span></NavLink>
          <NavLink to="/admin/answers" className="nav-item"><FaComment /><span>Answers</span></NavLink>
          <NavLink to="/admin/votes" className="nav-item"><FaThumbsUp /><span>Votes</span></NavLink>
          <NavLink to="/admin/notifications" className="nav-item"><FaBell /><span>Notifications</span></NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>
    );
  }

  // --- RENDER USER SIDEBAR (DEFAULT) ---
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <p className="nav-heading">Menu</p>
        <NavLink to="/" className="nav-item"><FaHome /><span>Home</span></NavLink>
        {user && <NavLink to="/dashboard" className="nav-item"><FaTachometerAlt /><span>Dashboard</span></NavLink>}
        <NavLink to="/new-questions" className="nav-item"><FaQuestionCircle /><span>Questions</span></NavLink>
        <NavLink to="/features" className="nav-item"><FaStar /><span>Features</span></NavLink>
        <NavLink to="/about" className="nav-item"><FaInfoCircle /><span>About</span></NavLink>
      </nav>

      {!isDashboard && (
        <div className="sidebar-topics">
          <p className="nav-heading">Topics</p>
          {tagList.map((tag) => (
            <button key={tag} onClick={() => handleTagFilter(tag)}
              className={`sidebar-tag ${currentTag === tag.toLowerCase() ? "active" : ""}`}
            >{tag}</button>
          ))}
        </div>
      )}

      {user && (
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;