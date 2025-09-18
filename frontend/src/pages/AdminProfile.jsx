// src/pages/AdminProfile.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import ProfileView from '../components/Dashboard/ProfileView';
import EditProfile from '../components/Dashboard/EditProfile';
import AccountSettings from '../components/Dashboard/AccountSettings';
import '../styles/UserDashboard.css'; // We can reuse the same beautiful styles
import { AnimatePresence, motion } from 'framer-motion';

const AdminProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logic to determine the active tab from the URL
  const getTabFromPath = (pathname) => {
    if (pathname.includes("/edit")) return "edit";
    if (pathname.includes("/account")) return "account";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    // Navigate to the correct admin profile sub-route
    navigate(`/admin/profile/${tab === "profile" ? "" : tab}`);
  };

  const renderContent = () => {
    const key = location.pathname;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* We use a nested Routes component to render the correct tab content */}
          <Routes location={location}>
            <Route index element={<ProfileView onEditClick={() => handleTabChange("edit")} />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="account" element={<AccountSettings />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="dashboard-container container mt-4">
      <DashboardHeader />
      <div className="tab-switch">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => handleTabChange("profile")}
        >
          Profile
        </button>
        {/* We exclude the "Activity" tab for the admin's own profile for simplicity */}
        <button
          className={`tab-button ${activeTab === "account" ? "active" : ""}`}
          onClick={() => handleTabChange("account")}
        >
          Account
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminProfile;