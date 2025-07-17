import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import registerIllustration from "../assets/mention_rafiki.svg";
import {registerUser, loginWithGoogle } from "../services/authService"; // reuse same API as login

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage for step 2
    localStorage.setItem("userTempData", JSON.stringify(form));
    navigate("/register/step-2");
  };

  const handleGoogleSignup = async (response) => {
    const idToken = response.credential;
    if (!idToken) {
      alert("Google signup failed");
      return;
    }

    try {
      const res = await loginWithGoogle(idToken); // handles both login & register
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Google Sign-up successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Google signup failed");
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSignup,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("google-signup-button"),
      {
        theme: "outline",
        size: "large",
        width: 400,
      }
    );
  }, []);

  return (
    <div className="container-fluid register-page d-flex flex-column flex-md-row p-0">
      {/* Left Section */}
      <div className="register-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={registerIllustration} alt="Register Illustration" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
        <h2 className="fw-bold text-center">Sign up to join us</h2>
        <p className="text-center mt-2">
          Think, ask, and learn from <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Right Section */}
      <div className="register-right bg-white d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h3 className="fw-bold mb-2">Sign Up</h3>
          <p className="mb-4">Please enter your details below</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control form-control-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control form-control-lg"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="adminCheck"
                checked={form.isAdmin}
                onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="adminCheck">Are you Admin?</label>
            </div>

            <button type="submit" className="btn btn-info text-white btn-lg w-100 mb-3">
              Register
            </button>
          </form>

          <div className="text-center my-3 text-muted">──────── or continue ────────</div>

          {/* Google Sign-up button container */}
          {/* <div id="google-signup-button" className="w-100 mb-3"></div> */}
          <div className="d-flex justify-content-center" id="google-signup-button"></div>

          <p className="mt-4 text-center text-muted">
            Already have an account? <Link to="/login" className="text-primary">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
