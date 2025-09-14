// src/components/Sidebar.jsx

import React from "react";
import { NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Sidebar.css";
// Import professional icons
import { FaHome, FaTachometerAlt, FaQuestionCircle, FaStar, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo_sf.png'; // Assuming you have your logo here

const Sidebar = () => {
  const { logout, user } = useAuth(); // Use the logout function from your context
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isDashboard = location.pathname.startsWith("/dashboard");
  const currentTag = searchParams.get("tags")?.toLowerCase() || "";

  const tagList = [
    "C", "C++", "Python", "Java", "HTML",
    "CSS", "JavaScript", "React", "Django", "Others"
  ];

  const handleLogout = () => {
    logout(); // This will clear localStorage and update the auth state
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
    // Always navigate to the questions page when a tag is clicked
    navigate(`/new-questions?${updatedParams.toString()}`);
  };

  return (
    <aside className="sidebar">
      {/* <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <h4 className="sidebar-title">
          <span className="text-info">SYNTAX</span> FISSION
        </h4>
      </div> */}

      <nav className="sidebar-nav">
        <p className="nav-heading">Menu</p>
        <NavLink to="/" className="nav-item">
          <FaHome /><span>Home</span>
        </NavLink>
        {user && ( // Only show Dashboard if user is logged in
          <NavLink to="/dashboard" className="nav-item">
            <FaTachometerAlt /><span>Dashboard</span>
          </NavLink>
        )}
        <NavLink to="/new-questions" className="nav-item">
          <FaQuestionCircle /><span>Questions</span>
        </NavLink>
        <NavLink to="/features" className="nav-item">
          <FaStar /><span>Features</span>
        </NavLink>
        <NavLink to="/about" className="nav-item">
          <FaInfoCircle /><span>About</span>
        </NavLink>
      </nav>

      {!isDashboard && (
        <div className="sidebar-topics">
          <p className="nav-heading">Topics</p>
          {tagList.map((tag) => {
            const isActive = currentTag === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`sidebar-tag ${isActive ? "active" : ""}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {user && ( // Only show Logout button if user is logged in
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