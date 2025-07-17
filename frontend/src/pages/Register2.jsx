import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import registerIllustration from "../assets/mention_rafiki.svg"; // Reuse or update the path
import { FaUserCircle, FaPen } from "react-icons/fa";
// import {registerUser, loginWithGoogle } from "../services/authService"; 
import axios from "axios";

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userTemp = JSON.parse(localStorage.getItem("userTempData"));

    formData.append("name", userTemp.name);
    formData.append("email", userTemp.email);
    formData.append("password", userTemp.password);
    formData.append("is_admin", userTemp.isAdmin);
    formData.append("bio", bio);
    formData.append("profile_picture", document.getElementById("profilePic").files[0]);


    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/create/",
        formData
      );
      localStorage.removeItem("userTempData");
      alert("Registered successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("userTempData");
    navigate("/dashboard");
  };

  return (
    <div className="container-fluid register-page d-flex flex-column flex-md-row p-0">
      {/* Left Section */}
      <div className="register-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img
          src={registerIllustration}
          alt="Register Visual"
          className="img-fluid mb-4"
          style={{ maxHeight: 300 }}
        />
        <h2 className="fw-bold text-center">Sign up for join with us</h2>
        <p className="text-center mt-2">
          Think, ask, and learn from{" "}
          <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Right Form Section */}
      <div className="register-right bg-white d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h3 className="fw-bold mb-2">Sign Up</h3>
          <p className="mb-4">Please add profile picture and bio</p>

          <form onSubmit={handleSubmit}>
            {/* Profile Upload */}
            <div className="profile-upload mb-4">
              <div className="avatar-wrapper position-relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Avatar" className="avatar-img" />
                ) : (
                  <FaUserCircle className="avatar-icon" />
                )}
                <label htmlFor="profilePic" className="edit-icon-label">
                  <FaPen /> <span className="ms-1">Add Picture</span>
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-3">
              <textarea
                rows="4"
                placeholder="Add your bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-control bio-box"
              />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="btn btn-info text-white btn-lg w-100 mb-3"
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-warning text-dark btn-lg w-100"
              onClick={handleSkip}
            >
              Skip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2;
