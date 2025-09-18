// src/components/Dashboard/EditProfile.jsx
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const [form, setForm] = useState({ name: "", bio: "", email: "" });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile().then((res) => {
      const { name, bio, profile_picture, email } = res.data;
      setForm({ name: name || "", bio: bio || "", email: email || "" });
      setPreviewURL(profile_picture);
    });
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }
    try {
      await updateProfile(formData);
      showToast("Profile updated successfully!", "success");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      showToast("Profile update failed. Please try again.", "danger");
    }
  };

  return (
    <motion.div
      className="card p-4 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="fw-bold mb-4">Edit Your Profile</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input className="form-control" value={form.email} readOnly disabled />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Bio</label>
          <textarea className="form-control" name="bio" rows={4} value={form.bio} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Profile Picture</label>
          <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} />
          {previewURL && (
            <div className="mt-3">
              <img src={previewURL} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }} />
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-info text-white">
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProfile;