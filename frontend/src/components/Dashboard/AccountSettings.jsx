// src/components/Dashboard/AccountSettings.jsx

import { useEffect, useState } from 'react';
import { getAccountMeta, deleteAccount, updatePassword } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BiShow, BiHide } from 'react-icons/bi';
import { PiPasswordDuotone, PiPasswordFill } from "react-icons/pi";

const AccountSettings = () => {
  const [meta, setMeta] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [passwords, setPasswords] = useState({ password: '', confirm_password: '' });
  const { showToast } = useToast();

  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    getAccountMeta().then(res => setMeta(res.data));
  }, []);

  const handlePasswordChange = () => {
    if (passwords.password !== passwords.confirm_password) {
      showToast("Passwords do not match.", "danger");
      return;
    }
    if (passwords.password.length < 6) {
        showToast("Password must be at least 6 characters long.", "warning");
        return;
    }
    updatePassword(passwords.password, passwords.confirm_password).then(() => {
      showToast("Password updated successfully!", "success");
      setShowPasswordPopup(false);
      setPasswords({ password: '', confirm_password: '' });
    }).catch(() => showToast("Failed to update password. Please try again.", "danger"));
  };

  const handleDelete = () => {
    deleteAccount().then(() => {
      showToast("Account deleted successfully.", "info");
      localStorage.clear();
      window.location.href = '/login';
    }).catch(() => showToast("Failed to delete account.", "danger"));
  };

  if (!meta) return <p>Loading account settings...</p>;
  
  return (
    <>
      <motion.div
        className="card p-4 shadow-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      >
        <h4 className="fw-bold mb-4">Account Settings</h4>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="form-control bg-light">{meta.email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <div className="input-group">
            <span className="input-group-text bg-light"><PiPasswordDuotone /></span>
            {/* SECURITY: We only show a dummy value. Never the real password. */}
            <input
              type={showMainPassword ? "text" : "password"}
              className="form-control bg-light"
              value="************"
              readOnly
            />
            <span
              className="input-group-text bg-light"
              role="button"
              onClick={() => setShowMainPassword(!showMainPassword)}
              style={{ cursor: "pointer" }}
            >
              {showMainPassword ? <BiHide /> : <BiShow />}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Joined</label>
          <div className="form-control bg-light">{new Date(meta.date_joined).toLocaleDateString()}</div>
        </div>
        <hr className="my-4" />
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-info text-white" onClick={() => setShowPasswordPopup(true)}>
            Change Password
          </button>
          <button className="btn btn-danger" onClick={() => setShowDeletePopup(true)}>
            <i className="bi bi-trash-fill me-1"></i> Delete Account
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPasswordPopup && (
          <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="popup-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h5 className="mb-4 fw-bold text-center">Change Password</h5>
              
              {/* --- UPDATED: New Password with Label --- */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">{showNewPassword ? <PiPasswordFill /> : <PiPasswordDuotone />}</span>
                  <input type={showNewPassword ? "text" : "password"} className="form-control" placeholder="Enter new password" value={passwords.password}
                    onChange={(e) => setPasswords((p) => ({ ...p, password: e.target.value }))} />
                  <span className="input-group-text bg-light" role="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: "pointer" }}>
                    {showNewPassword ? <BiHide /> : <BiShow />}
                  </span>
                </div>
              </div>
              
              {/* --- UPDATED: Confirm Password with Label --- */}
              <div className="mb-4">
                <label className="form-label fw-semibold small">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">{showConfirmPassword ? <PiPasswordFill /> : <PiPasswordDuotone />}</span>
                  <input type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirm new password" value={passwords.confirm_password}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm_password: e.target.value }))} />
                  <span className="input-group-text bg-light" role="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                    {showConfirmPassword ? <BiHide /> : <BiShow />}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setShowPasswordPopup(false)}>Cancel</button>
                <button className="btn btn-info text-white" onClick={handlePasswordChange}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {showDeletePopup && (
           <motion.div className="popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <motion.div className="popup-card text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
               <h5 className="mb-3 fw-bold">⚠ Confirm Deletion</h5>
               <p className="text-muted">This action is irreversible. All your questions and answers will be permanently deleted.</p>
               <div className="d-flex justify-content-center gap-2 mt-4">
                 <button className="btn btn-secondary" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                 <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete My Account</button>
               </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccountSettings;