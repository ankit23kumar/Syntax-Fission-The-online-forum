import { useEffect, useState } from 'react';
import {
  getAccountMeta,
  deleteAccount,
  updatePassword,
} from '../../services/userService';
import '../../styles/UserDashboard.css';

const AccountSettings = () => {
  const [meta, setMeta] = useState(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [passwords, setPasswords] = useState({ password: '', confirm_password: '' });

  useEffect(() => {
    getAccountMeta().then(res => setMeta(res.data));
  }, []);

  const handlePasswordChange = () => {
    if (passwords.password !== passwords.confirm_password) {
      alert("Passwords don't match");
      return;
    }
    updatePassword(passwords.password, passwords.confirm_password)
      .then(() => {
        alert("Password updated");
        setShowPasswordPopup(false);
        setPasswords({ password: '', confirm_password: '' });
      });
  };

  const handleDelete = () => {
    deleteAccount().then(() => {
      alert("Account deleted");
      localStorage.clear();
      window.location.href = '/login';
    });
  };

  return meta ? (
    <div className="card p-4 shadow-sm border-0">
      <h4 className="fw-bold mb-3">Account Settings</h4>

      <div className="mb-3">
        <label className="form-label fw-semibold">Email</label>
        <div className="form-control">{meta.email}</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Password</label>
        <div className="form-control">********</div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Joined</label>
        <div className="form-control">{new Date(meta.date_joined).toLocaleDateString()}</div>
      </div>

      <hr />
      <div className="d-flex gap-3">
        <button className="btn btn-info text-white btn-fixed-width" onClick={() => setShowPasswordPopup(true)}>
          Change Password
        </button>
        <button className="btn btn-danger btn-fixed-width" onClick={() => setShowDeletePopup(true)}>
          <i className="bi bi-trash-fill me-2"></i> Delete Account
        </button>
      </div>

      {/* Password Popup */}
      {showPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h5 className="mb-3">Change Password</h5>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="New Password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, password: e.target.value }))
              }
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm Password"
              value={passwords.confirm_password}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm_password: e.target.value }))
              }
            />
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setShowPasswordPopup(false)}>
                Cancel
              </button>
              <button className="btn btn-info text-white" onClick={handlePasswordChange}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-card text-center">
            <h5 className="mb-3">⚠ Confirm Deletion</h5>
            <p>This action is irreversible. Do you really want to delete your account?</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-secondary" onClick={() => setShowDeletePopup(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <p>Loading account settings...</p>
  );
};

export default AccountSettings;
