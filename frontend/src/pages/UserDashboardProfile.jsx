import React, { useState } from "react";
import "../styles/Profile.css";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit profile update
    console.log("Profile updated:", formData);
  };

  return (
    <div className="profile-container d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <aside className="sidebar p-3">
        <h4 className="logo text-info">Syntax Fission</h4>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">🏠 Home</li>
          <li className="nav-item">📊 Dashboard</li>
          <li className="nav-item">❓ Q&A</li>
          <li className="nav-item">✨ Features</li>
          <li className="nav-item">ℹ️ About</li>
        </ul>
      </aside>

      {/* Main Profile Section */}
      <main className="flex-grow-1 p-4">
        {/* Topbar */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
          <div>
            <h4>Hello, {formData.name || "Guest"}</h4>
            <p className="text-info fw-bold">Enjoy on journey of Q&A</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span>{formData.name || "User"}</span>
            <FaUserCircle size={32} />
          </div>
        </div>

        {/* Profile Form */}
        <div className="card shadow-sm p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Bio */}
                <div className="mb-3">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    placeholder="Write a short bio"
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                </div>

                <button type="submit" className="btn btn-info text-white px-4">
                  Edit Profile
                </button>
              </div>

              {/* Profile Picture */}
              <div className="col-md-4 d-flex flex-column align-items-center mt-4 mt-md-0">
                <h6>Profile Picture</h6>
                <FaUserCircle size={100} className="text-secondary" />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
