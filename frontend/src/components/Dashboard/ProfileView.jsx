// src/components/Dashboard/ProfileView.jsx
import { useEffect, useState } from "react";
import { getProfile } from "../../services/userService";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { motion } from 'framer-motion';

const ProfileView = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  const BASE_URL = "http://localhost:8000";
  if (!profile) return <p>Loading...</p>;

  return (
    <motion.div
      className="card p-4 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="d-flex justify-content-center mb-4">
        <img
          src={
            profile.profile_picture?.startsWith("http")
              ? profile.profile_picture
              : `${BASE_URL}${profile.profile_picture}`
          }
          alt="Profile"
          className="rounded-circle profile-avatar"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Name</label>
        <div className="form-control">{profile.name}</div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Email Address</label>
        <div className="form-control d-flex justify-content-between align-items-center">
          <span>{profile.email}</span>
          {profile.is_active && (
            <span className="badge bg-success d-flex align-items-center">
              <RiVerifiedBadgeFill className="me-1" /> Verified
            </span>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Bio</label>
        <div className="form-control" style={{ minHeight: '100px' }}>
          {profile.bio || "No bio added."}
        </div>
      </div>
      <button className="btn btn-info text-white mt-3" onClick={onEditClick}>
        Edit Profile
      </button>
    </motion.div>
  );
};

export default ProfileView;