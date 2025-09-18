// src/components/Dashboard/DashboardHeader.jsx
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/userService';
import defaultAvatar from '../../assets/mention_rafiki.svg';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data));
  }, []);

  if (!profile) return null;

  return (
    <motion.div
      className="card p-4 shadow-sm mb-4 dashboard-header-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold">Hello, {profile.name}</h3>
          <h5 className="fw-semibold">Enjoy on journey of Q&A</h5>
        </div>
        <motion.img
          src={defaultAvatar}
          alt="Dashboard Illustration"
          style={{ width: '200px', height: 'auto' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default DashboardHeader;