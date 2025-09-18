// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import ProfileView from "../components/Dashboard/ProfileView";
import EditProfile from "../components/Dashboard/EditProfile";
import Activity from "../components/Dashboard/Activity";
import AccountSettings from "../components/Dashboard/AccountSettings";
import "../styles/UserDashboard.css";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname) => {
    if (pathname.includes("/edit")) return "edit";
    if (pathname.includes("/activity")) return "activity";
    if (pathname.includes("/account")) return "account";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    navigate(`/dashboard/${tab === "profile" ? "" : tab}`);
  };

  const renderContent = () => {
    const key = location.pathname; // Unique key for AnimatePresence
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route index element={<ProfileView onEditClick={() => handleTabChange("edit")} />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="activity" element={<Activity />} />
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
        <button className={`tab-button ${activeTab === "profile" ? "active" : ""}`} onClick={() => handleTabChange("profile")}>
          Profile
        </button>
        <button className={`tab-button ${activeTab === "activity" ? "active" : ""}`} onClick={() => handleTabChange("activity")}>
          Activity
        </button>
        <button className={`tab-button ${activeTab === "account" ? "active" : ""}`} onClick={() => handleTabChange("account")}>
          Account
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default Dashboard;