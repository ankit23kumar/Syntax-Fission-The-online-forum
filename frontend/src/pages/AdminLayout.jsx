import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaQuestion,
  FaTags,
  FaComment,
  FaThumbsUp,
  FaBell,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside className="bg-dark text-white p-3" style={{ width: "240px" }}>
        <h4 className="text-center mb-4">Admin Panel</h4>
        <nav className="nav flex-column">
          <NavLink to="/" className="nav-link text-white mb-2">
            <FaHome className="me-2" /> Home
          </NavLink>
          <NavLink to="/admin/dashboard" className="nav-link text-white mb-2">
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className="nav-link text-white mb-2">
            <FaUsers className="me-2" /> Users
          </NavLink>
          <NavLink to="/admin/questions" className="nav-link text-white mb-2">
            <FaQuestion className="me-2" /> Questions
          </NavLink>
          <NavLink to="/admin/tags" className="nav-link text-white mb-2">
            <FaTags className="me-2" /> Tags
          </NavLink>
          <NavLink to="/admin/answers" className="nav-link text-white mb-2">
            <FaComment className="me-2" /> Answers
          </NavLink>
          <NavLink to="/admin/votes" className="nav-link text-white mb-2">
            <FaThumbsUp className="me-2" /> Votes
          </NavLink>
          <NavLink to="/admin/notifications" className="nav-link text-white mb-2">
            <FaBell className="me-2" /> Notifications
          </NavLink>
        </nav>

        <div className="mt-5 text-center">
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
