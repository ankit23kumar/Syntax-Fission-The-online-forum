// src/pages/AdminUsers.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserPlus, FaEdit, FaTrash, FaKey, FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa";
import { useToast } from "../contexts/ToastContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { showToast } = useToast();

  const [formUser, setFormUser] = useState({
    name: "", email: "", password: "", bio: "",
    is_active: true, is_admin: false, profile_picture: null,
  });
  const [passwordReset, setPasswordReset] = useState({ password: "", confirm_password: "" });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users/");
      setUsers(res.data);
    } catch (err) {
      showToast("Failed to fetch users.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user, field) => {
    try {
      await api.patch(`/admin/users/${user.user_id}/`, { [field]: !user[field] });
      fetchUsers();
      showToast(`User ${field.replace('is_', '')} status updated.`, "success");
    } catch (err) {
      showToast("Failed to update user status.", "danger");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/admin/users/${selectedUser.user_id}/delete/`);
      fetchUsers();
      showToast("User deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete user.", "danger");
    } finally {
      closeConfirmModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in formUser) {
      if (formUser[key] !== null) formData.append(key, formUser[key]);
    }
    formData.append("is_staff", formUser.is_admin);

    try {
      if (selectedUser) {
        await api.patch(`/admin/users/${selectedUser.user_id}/`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("User updated successfully!", "success");
      } else {
        await api.post("/users/create/", formData, { headers: { "Content-Type": "multipart/form-data" } });
        showToast("User added successfully!", "success");
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      showToast("Failed to submit form.", "danger");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordReset.password !== passwordReset.confirm_password) {
      showToast("Passwords do not match.", "danger");
      return;
    }
    try {
      await api.patch(`/admin/users/${selectedUser.user_id}/reset-password/`, passwordReset);
      showToast("Password updated successfully.", "success");
      closePasswordModal();
    } catch (err) {
      showToast("Failed to reset password.", "danger");
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setFormUser({ name: "", email: "", password: "", bio: "", is_active: true, is_admin: false, profile_picture: null });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormUser({
      name: user.name || "", email: user.email, password: "", bio: user.bio || "",
      is_active: user.is_active, is_admin: user.is_admin, profile_picture: null,
    });
    setShowModal(true);
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordReset({ password: "", confirm_password: "" });
    setShowPasswordModal(true);
  };

  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setShowConfirmModal(true);
  };

  const closeModal = () => setShowModal(false);
  const closePasswordModal = () => setShowPasswordModal(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">User Management</h2>
            <p className="page-subtitle">Add, edit, or remove users from the platform.</p>
          </div>
          <motion.button className="btn-add-user" onClick={openAddModal} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaUserPlus className="me-2" /> Add User
          </motion.button>
        </div>
      </motion.div>

      <motion.div className="admin-table-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center p-4">Loading users...</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <div className="user-info">
                      <img src={user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={user.name} />
                      <div>
                        <strong>{user.name || "N/A"}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => toggleStatus(user, 'is_active')} className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      {user.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleStatus(user, 'is_admin')} className={`role-badge ${user.is_admin ? 'admin' : 'user'}`}>
                      {user.is_admin ? "Admin" : "User"}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => openEditModal(user)} title="Edit User"><FaEdit /></button>
                      <button className="action-btn password" onClick={() => openPasswordModal(user)} title="Reset Password"><FaKey /></button>
                      <button className="action-btn delete" onClick={() => openConfirmModal(user)} title="Delete User"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {(showModal || showPasswordModal || showConfirmModal) && (
          <motion.div className="modal-backdrop-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            {/* Add/Edit Modal (Dark Theme) */}
            {showModal && (
              <motion.div className="modal-content-dark" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                <form onSubmit={handleSubmit}>
                  <div className="modal-header-dark">
                    <h5>{selectedUser ? "Edit User" : "Add New User"}</h5>
                    <button type="button" className="btn-close-dark" onClick={closeModal}><FaTimes /></button>
                  </div>
                  <div className="modal-body-dark">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formUser.name} onChange={(e) => setFormUser({...formUser, name: e.target.value})} required />
                    <label>Email Address</label>
                    <input type="email" name="email" value={formUser.email} onChange={(e) => setFormUser({...formUser, email: e.target.value})} required disabled={!!selectedUser} />
                    {!selectedUser && <>
                      <label>Password</label>
                      <input type="password" name="password" value={formUser.password} onChange={(e) => setFormUser({...formUser, password: e.target.value})} required />
                    </>}
                    <label>Bio</label>
                    <textarea name="bio" value={formUser.bio} onChange={(e) => setFormUser({...formUser, bio: e.target.value})} />
                    <label>Profile Picture</label>
                    <input className="form-control-dark" type="file" name="profile_picture" onChange={(e) => setFormUser({...formUser, profile_picture: e.target.files[0]})} />
                    <div className="checkbox-group-dark">
                      <div className="form-check-dark"><input type="checkbox" name="is_admin" checked={formUser.is_admin} onChange={(e) => setFormUser({...formUser, is_admin: e.target.checked})} /><label>Is Admin?</label></div>
                      <div className="form-check-dark"><input type="checkbox" name="is_active" checked={formUser.is_active} onChange={(e) => setFormUser({...formUser, is_active: e.target.checked})} /><label>Is Active?</label></div>
                    </div>
                  </div>
                  <div className="modal-footer-dark">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{selectedUser ? "Update User" : "Add User"}</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* --- ADDED: Password Reset Modal --- */}
            {showPasswordModal && (
              <motion.div className="modal-content-dark" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                 <form onSubmit={handlePasswordReset}>
                  <div className="modal-header-dark"><h5>Reset Password</h5><button type="button" className="btn-close-dark" onClick={closePasswordModal}><FaTimes /></button></div>
                  <div className="modal-body-dark">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" value={passwordReset.password} onChange={(e) => setPasswordReset({ ...passwordReset, password: e.target.value })} required />
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm new password" value={passwordReset.confirm_password} onChange={(e) => setPasswordReset({ ...passwordReset, confirm_password: e.target.value })} required />
                  </div>
                  <div className="modal-footer-dark"><button type="button" className="btn btn-secondary" onClick={closePasswordModal}>Cancel</button><button type="submit" className="btn btn-primary">Update Password</button></div>
                </form>
              </motion.div>
            )}
             
            {/* --- ADDED: Delete Confirmation Modal --- */}
            {showConfirmModal && (
              <motion.div className="modal-content-dark confirm-modal" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
                <div className="modal-body-dark text-center">
                  <div className="confirm-icon"><FaTrash/></div>
                  <h5>Delete User</h5>
                  <p>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.</p>
                </div>
                <div className="modal-footer-dark confirm-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Yes, Delete</button>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;