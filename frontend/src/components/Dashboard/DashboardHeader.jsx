// src/components/Dashboard/DashboardHeader.jsx
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/userService';
import defaultAvatar from '../../assets/mention_rafiki.svg';

const DashboardHeader = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data));
  }, []);

  if (!profile) return null;

  return (
    <div className="card p-4 shadow-sm border-0 mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h3 className="fw-bold fs-2">Hello, {profile.name}</h3>
          <h5 className="text-info fw-semibold fs-4 ">Enjoy on journey of Q&A</h5>
        </div>
        <img
          src= {defaultAvatar}
          alt="defaultAvtar"
          className="rectangle non-border"
          style={{ width: '240px', height: '180px' }}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
