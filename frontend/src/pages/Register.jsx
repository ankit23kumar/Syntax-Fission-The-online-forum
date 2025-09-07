// src/pages/Register.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import registerIllustration from "../assets/authentication_rafiki.svg";
import { registerUser, loginWithGoogle } from "../services/authService"; // `resendVerificationEmail` is no longer needed here
import { useToast } from "../contexts/ToastContext";
import VerifyEmailModal from "../components/VerifyEmailModal"; // The rewritten, simpler modal

// Icons
import { BiRename, BiArrowBack, BiShow, BiHide } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { PiPasswordDuotone, PiPasswordFill } from "react-icons/pi";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This function call remains the same
      await registerUser(form);

      // CHANGE 1: Remove insecure localStorage usage.
      // The user's password or temp data should not be stored in the browser.
      // DELETE a line like: localStorage.setItem("userTempData", ...);
      // DELETE a line like: localStorage.setItem("registerCreds", ...);

      // Show the verification modal and a success toast
      setShowVerifyModal(true);
      showToast("Registration successful! Please check your email.", "info");

    } catch (err) {
      console.error("Registration failed:", err);
      // Provide a more specific error if possible from the backend response
      const errorMessage = err.response?.data?.email?.[0] || "Registration failed. The email may already be in use.";
      showToast(errorMessage, "danger");
    }
  };

  // CHANGE 2: The `handleResendEmail` function is no longer needed in this component.
  // The rewritten `VerifyEmailModal` handles its own resend logic.

  // Google Signup (No changes needed here, this flow is separate and correct)
  const handleGoogleSignup = async (response) => {
    const idToken = response.credential;
    if (!idToken) {
      showToast("Google signup failed", "danger");
      return;
    }
    try {
      const res = await loginWithGoogle(idToken);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data));
      showToast("Google sign-up successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("Google signup failed", "danger");
    }
  };

  // Init Google signup (No changes needed)
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSignup,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-button"),
        { theme: "outline", size: "large", width: 400 }
      );
    }
  }, []);

  return (
    <div className="container-fluid register-page d-flex flex-column flex-md-row p-0">
      {/* Left Panel (No changes needed) */}
      <div className="register-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={registerIllustration} alt="Register Illustration" className="img-fluid mb-4 animate-fade-in" style={{ maxHeight: 450 }} />
        <h2 className="fw-bold text-center animate-slide-up">Sign up to join us</h2>
        <p className="text-center mt-2 animate-slide-up">Think, ask, and learn from <span className="text-warning">Syntax Fission</span></p>
      </div>

      {/* Right Panel (No changes needed in the form itself) */}
      <div className="register-right d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="register-form-wrapper w-100" style={{ maxWidth: "550px" }}>
          <Link to="/" className="text-decoration-none text-muted mb-3 d-inline-block back-icon">
            <BiArrowBack size={24} className="me-2" /> Back to Home
          </Link>

          <h3 className="fw-bold mb-2">Sign Up</h3>
          <p className="mb-4">Please enter your details below</p>

          <form onSubmit={handleSubmit}>
            {/* Form inputs are all correct, no changes needed */}
            <div className="input-group input-group-lg mb-3 hover-input">
              <span className="input-group-text bg-light"><BiRename /></span>
              <input type="text" placeholder="Name" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group input-group-lg mb-3 hover-input">
              <span className="input-group-text bg-light"><MdOutlineEmail /></span>
              <input type="email" placeholder="Email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group input-group-lg mb-3 hover-input">
              <span className="input-group-text bg-light">{showPassword ? <PiPasswordFill /> : <PiPasswordDuotone />}</span>
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <span className="input-group-text bg-light" style={{ cursor: "pointer" }} onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <BiHide /> : <BiShow />}
              </span>
            </div>
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="adminCheck" checked={form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} />
              <label className="form-check-label" htmlFor="adminCheck">Are you Admin?</label>
            </div>
            <button type="submit" className="btn btn-info text-white btn-lg w-100 mb-3">Register</button>
          </form>

          <div className="text-center my-3 text-muted">──────── or continue ────────</div>
          <div className="d-flex justify-content-center" id="google-signup-button"></div>
          <p className="mt-4 text-center text-muted">Already have an account? <Link to="/login" className="text-primary">Login here</Link></p>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <VerifyEmailModal
          email={form.email}
          // CHANGE 3: Update onClose logic.
          // This guides the user to the login page if they close the modal,
          // which is the correct next step for them.
          onClose={() => {
            setShowVerifyModal(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
};

export default Register;