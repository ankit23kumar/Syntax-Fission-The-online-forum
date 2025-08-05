import React from "react";
import { FaUsers, FaQuestion, FaTags, FaComment, FaThumbsUp, FaBell } from "react-icons/fa";
import { useNavigate, Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user?.is_admin) return <Navigate to="/403" />;

  const sections = [
    {
      title: "Manage Users",
      text: "Promote, deactivate or remove users.",
      icon: <FaUsers size={40} className="text-info" />,
      border: "border-info",
      btn: "btn-info",
      route: "/admin/users",
    },
    {
      title: "Manage Questions",
      text: "Moderate or delete spam questions.",
      icon: <FaQuestion size={40} className="text-success" />,
      border: "border-success",
      btn: "btn-success",
      route: "/admin/questions",
    },
    {
      title: "Manage Tags",
      text: "Create or remove tags to organize content.",
      icon: <FaTags size={40} className="text-warning" />,
      border: "border-warning",
      btn: "btn-warning",
      route: "/admin/tags",
    },
    {
      title: "Manage Answers",
      text: "Review and delete inappropriate answers.",
      icon: <FaComment size={40} className="text-secondary" />,
      border: "border-secondary",
      btn: "btn-secondary",
      route: "/admin/answers",
    },
    {
      title: "Manage Votes",
      text: "Monitor voting activity on posts.",
      icon: <FaThumbsUp size={40} className="text-primary" />,
      border: "border-primary",
      btn: "btn-primary",
      route: "/admin/votes",
    },
    {
      title: "Manage Notifications",
      text: "Audit all system notifications.",
      icon: <FaBell size={40} className="text-danger" />,
      border: "border-danger",
      btn: "btn-danger",
      route: "/admin/notifications",
    },
  ];

  return (
    <div className="container-fluid">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>
      <p className="text-muted">Welcome back, {user.name}</p>

      <div className="row mt-4">
        {sections.map((section, i) => (
          <div className="col-md-4 mb-4" key={i}>
            <div className={`card border-start ${section.border} shadow-sm`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{section.title}</h5>
                  <p className="card-text">{section.text}</p>
                  <button
                    className={`btn btn-sm ${section.btn} text-white`}
                    onClick={() => navigate(section.route)}
                  >
                    View
                  </button>
                </div>
                {section.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
