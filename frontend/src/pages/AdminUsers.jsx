import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    is_active: true,
    is_admin: false,
    profile_picture: null,
  });

  const [passwordReset, setPasswordReset] = useState({
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/`, { is_active: !isActive });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    }
  };

  const toggleAdmin = async (id, isAdmin) => {
    try {
      await api.patch(`/admin/users/${id}/`, { is_admin: !isAdmin });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}/delete/`);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleInputChange = (e) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.checked });
  };

  const handleFileChange = (e) => {
    setFormUser({ ...formUser, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in formUser) {
        if (formUser[key] !== null && formUser[key] !== undefined) {
          formData.append(key, formUser[key]);
        }
      }
      formData.append("is_staff", formUser.is_admin);

      if (editingUserId) {
        await api.patch(`/admin/users/${editingUserId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/users/register/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Failed to submit user form", err);
    }
  };

  const openAddModal = () => {
    setEditingUserId(null);
    setFormUser({
      name: "",
      email: "",
      password: "",
      bio: "",
      is_active: true,
      is_admin: false,
      profile_picture: null,
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUserId(user.user_id);
    setFormUser({
      name: user.name || "",
      email: user.email,
      password: "",
      bio: user.bio || "",
      is_active: user.is_active,
      is_admin: user.is_admin,
      profile_picture: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUserId(null);
  };

  const openPasswordModal = (userId) => {
    setEditingUserId(userId);
    setPasswordReset({ password: "", confirm_password: "" });
    setShowPasswordModal(true);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/users/${editingUserId}/reset-password/`, passwordReset);
      setShowPasswordModal(false);
      alert("Password updated successfully.");
    } catch (err) {
      console.error("Failed to reset password", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          ➕ Add User
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className={`btn btn-sm ${user.is_admin ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={() => toggleAdmin(user.user_id, user.is_admin)}
                >
                  {user.is_admin ? "Revoke Admin" : "Make Admin"}
                </button>
              </td>
              <td>
                <button
                  className={`btn btn-sm ${user.is_active ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => toggleActive(user.user_id, user.is_active)}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => openEditModal(user)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openPasswordModal(user.user_id)}
                >
                  🔐 Reset Password
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteUser(user.user_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingUserId ? "Edit User" : "Add User"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    name="name"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={formUser.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={formUser.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingUserId}
                  />
                  {!editingUserId && (
                    <input
                      type="password"
                      name="password"
                      className="form-control mb-2"
                      placeholder="Password"
                      value={formUser.password}
                      onChange={handleInputChange}
                      required
                    />
                  )}
                  <textarea
                    name="bio"
                    className="form-control mb-2"
                    placeholder="Bio"
                    value={formUser.bio}
                    onChange={handleInputChange}
                  />
                  <input
                    type="file"
                    name="profile_picture"
                    className="form-control mb-2"
                    onChange={handleFileChange}
                  />
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="is_admin"
                      className="form-check-input"
                      checked={formUser.is_admin}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">Is Admin?</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_active"
                      className="form-check-input"
                      checked={formUser.is_active}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">Is Active?</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {editingUserId ? "Update User" : "Add User"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handlePasswordReset}>
                <div className="modal-header">
                  <h5 className="modal-title">Reset Password</h5>
                  <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="password"
                    name="password"
                    className="form-control mb-2"
                    placeholder="New Password"
                    value={passwordReset.password}
                    onChange={(e) => setPasswordReset({ ...passwordReset, password: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    name="confirm_password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={passwordReset.confirm_password}
                    onChange={(e) => setPasswordReset({ ...passwordReset, confirm_password: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Update</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
