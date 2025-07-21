import { useEffect, useState } from "react";
import { getProfile } from "../../services/userService";
import "../../styles/UserDashboard.css";

const ProfileView = ({ onEditClick }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  const BASE_URL = "http://localhost:8000";
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="card p-4 shadow-sm border-0">
      <div className="d-flex justify-content-center">
        <img
          src={
            profile.profile_picture?.startsWith("http")
              ? profile.profile_picture
              : `${BASE_URL}${profile.profile_picture}`
          }
          alt="Profile"
          className="rounded-circle border"
          style={{ width: "180px", height: "180px", objectFit: "cover" }}
        />
      </div>

      <div className="mt-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Name</label>
          <div className="form-control">{profile.name}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <div className="form-control">{profile.email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Bio</label>
          <div className="form-control" >
            {profile.bio || "No bio added."}
          </div>
        </div>

        <div className="mb-3 ">
          <label className="form-label fw-semibold">Password</label>
          <div className="form-control">
            {profile.password || "*********"}</div>
        </div>

        <button className="btn btn-info text-white mt-3" onClick={onEditClick}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
