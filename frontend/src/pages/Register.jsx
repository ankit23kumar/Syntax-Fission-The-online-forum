// src/pages/Register.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import registerIllustration from "../assets/authentication_rafiki.svg";
// Import the new OTP service functions
import { registerUser, loginWithGoogle } from "../services/authService";
import { useToast } from "../contexts/ToastContext";
import OTPModal from "../components/OTPModal"; // Import the new OTP modal

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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false); // State to control the OTP modal

  // Handle the initial form submission (Step 1: Registration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This backend call now creates the user and sends the OTP email
      await registerUser(form);
      showToast("Registration successful! Check your email for a 6-digit OTP.", "info");
      // Open the OTP modal to proceed to the next step
      setShowOtpModal(true);
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.email?.[0] || "Registration failed. The email may already be in use.";
      showToast(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  // This function is called by OTPModal upon successful verification (Step 2: Verification)
  const handleVerificationSuccess = (data) => {
    // The /verify-otp/ endpoint returns tokens and user data upon success
    const { access, refresh, user_id, name, email } = data;

    // Save tokens to localStorage to log the user in
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify({ user_id, name, email }));

    // Close the modal and navigate to the profile completion page (Step 3)
    setShowOtpModal(false);
    navigate("/register/step-2");
  };

  // Google Signup (This remains unchanged as it's a separate flow)
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

  // Initialize Google Signup Button (remains unchanged)
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
      {/* Left Panel - No Changes */}
      <div className="register-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={registerIllustration} alt="Register Illustration" className="img-fluid mb-4 animate-fade-in" style={{ maxHeight: 450 }} />
        <h2 className="fw-bold text-center animate-slide-up">Sign up to join us</h2>
        <p className="text-center mt-2 animate-slide-up">Think, ask, and learn from <span className="text-warning">Syntax Fission</span></p>
      </div>

      {/* Right Panel - No Changes to the form inputs */}
      <div className="register-right d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="register-form-wrapper w-100" style={{ maxWidth: "550px" }}>
          <Link to="/" className="text-decoration-none text-muted mb-3 d-inline-block back-icon">
            <BiArrowBack size={24} className="me-2" /> Back to Home
          </Link>

          <h3 className="fw-bold mb-2">Sign Up</h3>
          <p className="mb-4">Please enter your details below</p>

          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-info text-white btn-lg w-100 mb-3" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="text-center my-3 text-muted">──────── or continue ────────</div>
          <div className="d-flex justify-content-center" id="google-signup-button"></div>
          <p className="mt-4 text-center text-muted">Already have an account? <Link to="/login" className="text-primary">Login here</Link></p>
        </div>
      </div>

      {/* NEW: Render the OTP Modal when showOtpModal is true */}
      {showOtpModal && (
        <OTPModal
          email={form.email}
          onVerifySuccess={handleVerificationSuccess}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
};

export default Register;