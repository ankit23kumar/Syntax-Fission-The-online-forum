import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import ProfileView from "../components/Dashboard/ProfileView";
import EditProfile from "../components/Dashboard/EditProfile";
import Activity from "../components/Dashboard/Activity";
import AccountSettings from "../components/Dashboard/AccountSettings";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/UserDashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname) => {
    if (pathname.includes("/edit")) return "edit";
    if (pathname.includes("/activity")) return "activity";
    if (pathname.includes("/account")) return "account";
    return "profile"; // default
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    navigate(`/dashboard/${tab === "profile" ? "" : tab}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileView onEditClick={() => handleTabChange("edit")} />;
      case "edit":
        return <EditProfile />;
      case "activity":
        return <Activity />;
      case "account":
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container-fluid p-0 d-flex">

        {/* Main Content */}
        <div className="dashboard-container container mt-4">
          {/* Header */}
          <DashboardHeader />

          {/* Custom Tab Switch */}
          <div className="tab-switch mb-4">
            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => handleTabChange("profile")}
            >
              Profile
            </button>
            <button
              className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => handleTabChange("activity")}
            >
              Activity
            </button>
            <button
              className={`tab-button ${activeTab === "account" ? "active" : ""}`}
              onClick={() => handleTabChange("account")}
            >
              Account
            </button>
          </div>

          {/* Tab Content */}
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
