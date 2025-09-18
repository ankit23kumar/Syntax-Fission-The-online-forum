// src/pages/AdminDashboard.jsx

import React from "react";
import { FaUsers, FaQuestionCircle, FaTags, FaComment, FaThumbsUp, FaBell, FaUserCircle } from "react-icons/fa"; // Added FaUserCircle
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sections = [
    { title: "Manage Users", text: "Promote, deactivate or remove users.", icon: <FaUsers />, color: "cyan", route: "/admin/users" },
    { title: "Manage Questions", text: "Moderate or delete spam questions.", icon: <FaQuestionCircle />, color: "green", route: "/admin/questions" },
    { title: "Manage Tags", text: "Create or remove tags to organize content.", icon: <FaTags />, color: "yellow", route: "/admin/tags" },
    { title: "Manage Answers", text: "Review and delete inappropriate answers.", icon: <FaComment />, color: "grey", route: "/admin/answers" },
    { title: "Manage Votes", text: "Monitor voting activity on posts.", icon: <FaThumbsUp />, color: "blue", route: "/admin/votes" },
    { title: "Manage Notifications", text: "Audit all system notifications.", icon: <FaBell />, color: "red", route: "/admin/notifications" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="admin-dashboard-container">
      {/* --- UPDATED HEADER SECTION --- */}
      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        
        {/* --- NEW PROFILE BUTTON --- */}
        <motion.button
          className="btn-profile"
          onClick={() => navigate('/admin/profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUserCircle className="me-2" /> View Profile
        </motion.button>
      </motion.div>

      <motion.div
        className="row mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sections.map((section) => (
          <motion.div className="col-lg-4 col-md-6 mb-4" key={section.title} variants={cardVariants}>
            <div className={`admin-card color-${section.color}`}>
              <div className="card-content">
                <h5 className="card-title">{section.title}</h5>
                <p className="card-text">{section.text}</p>
                <button
                  className="btn-view"
                  onClick={() => navigate(section.route)}
                >
                  View
                </button>
              </div>
              <div className="card-icon">
                {section.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;