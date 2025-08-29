// src/pages/Register2.jsx
import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import registerIllustration from "../assets/authentication_rafiki.svg";
import { useToast } from "../contexts/ToastContext";
import { FaUserCircle, FaPen } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { completeProfile } from "../services/authService";

const Register2 = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (bio.trim()) formData.append("bio", bio.trim());

    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append("profile_picture", file);
    }

    try {
      setLoading(true);
      await completeProfile(formData);
      showToast("Profile setup complete — welcome!", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error("Profile completion failed:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to complete profile. Please try again.";
      showToast(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    showToast("Profile setup skipped. You can complete it later.", "info");
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid register-page d-flex flex-column flex-md-row p-0">
      {/* Left Panel */}
      <div className="register-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img
          src={registerIllustration}
          alt="Illustration of completing profile"
          className="img-fluid mb-4 animate-fade-in"
          style={{ maxHeight: 450 }}
        />
        <h2 className="fw-bold text-center animate-slide-up">
          Complete Your Profile
        </h2>
        <p className="text-center mt-2 animate-slide-up">
          Make it personal with{" "}
          <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Right Panel */}
      <div className="register-right d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div
          className="register-form-wrapper w-100"
          style={{ maxWidth: "550px" }}
        >
          <Link
            to="/register"
            className="text-decoration-none text-muted mb-3 d-inline-block back-icon"
          >
            <BiArrowBack size={24} className="me-2" /> Back to previous
          </Link>

          <h3 className="fw-bold mb-2">Profile Setup</h3>
          <p className="mb-4">Add a profile picture and short bio (optional)</p>

          <form onSubmit={handleSubmit}>
            {/* Profile Upload */}
            <div className="profile-upload mb-4 text-center">
              <div className="avatar-wrapper position-relative d-inline-block">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="avatar-img"
                  />
                ) : (
                  <FaUserCircle className="avatar-icon" />
                )}

                <label
                  htmlFor="profilePic"
                  className="edit-icon-label"
                  aria-label="Upload profile picture"
                >
                  <FaPen className="me-2" /> Add Picture
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className="d-none"
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-3 hover-input">
              <textarea
                rows="4"
                placeholder="Write a short bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-control bio-box"
                aria-label="Bio"
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-info text-white btn-lg w-100 mb-3"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
            <button
              type="button"
              disabled={loading}
              className="btn btn-warning text-dark btn-lg w-100"
              onClick={handleSkip}
            >
              Skip for Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register2;
