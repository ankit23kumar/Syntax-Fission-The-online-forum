import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginIllustration from "../assets/login_cuate.svg";
import { loginUser, loginWithGoogle } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handles redirection for both normal and Google login
  const redirectAfterLogin = (userData) => {
    localStorage.setItem("access", userData.access);
    localStorage.setItem("refresh", userData.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Login Response:", userData);

    setSuccessMessage("Login successful!");
    setTimeout(() => {
      setSuccessMessage("");
      navigate(userData.is_admin ? "/admin/dashboard" : "/dashboard");
    }, 2000);
  };

  //  Handle form login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      redirectAfterLogin(res.data);
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Login failed. Please check your credentials.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  //  Handle Google login
  const handleGoogleLogin = (response) => {
    const id_token = response.credential;
    if (!id_token) {
      setErrorMessage("Google login failed.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    loginWithGoogle(id_token)
      .then((res) => redirectAfterLogin(res.data))
      .catch((err) => {
        console.error("Google login error:", err);
        setErrorMessage("Google login failed.");
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  //  Initialize Google identity button
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleLogin,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      { theme: "outline", size: "large", width: 400 }
    );

    window.google?.accounts.id.prompt();
  }, []);

  return (
    <div className="container-fluid login-page d-flex flex-column flex-md-row p-0">
      {/*  Success/Error Alerts */}
      <div className="position-absolute top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 9999 }}>
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Left Illustration */}
      <div className="login-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={loginIllustration} alt="Login Illustration" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
        <h2 className="fw-bold text-center">Login to join us</h2>
        <p className="text-center mt-2">
          Think, ask, and learn with <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Login Form */}
      <div className="login-right bg-white d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h3 className="fw-bold mb-2">Welcome Back!</h3>
          <p className="mb-4">Please enter your login details</p>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-control form-control-lg"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="form-control form-control-lg"
                required
              />
            </div>
            <button type="submit" className="btn btn-info text-white btn-lg w-100 mb-3">
              Login
            </button>
          </form>

          <div className="text-center my-3 text-muted">──────── or continue ────────</div>

          {/* Google Login */}
          <div className="d-flex justify-content-center" id="google-login-button"></div>

          <p className="mt-4 text-center text-muted">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
