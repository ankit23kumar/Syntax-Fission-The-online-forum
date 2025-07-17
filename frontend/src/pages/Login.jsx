import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginIllustration from "../assets/login_cuate.svg";
import { loginUser, loginWithGoogle } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('user', JSON.stringify(res.data));
      alert('Login successful');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  // Handle Google login (button click)
  const handleGoogleLogin = (response) => {
    const id_token = response.credential;
    if (!id_token) {
      alert("Google login failed");
      return;
    }

    loginWithGoogle(id_token)
      .then((res) => {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Google login successful');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error(err);
        alert('Google login failed');
      });
  };

  // Google Identity initialization
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    /* global google */
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleLogin,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("google-login-button"),
      {
        theme: "outline",
        size: "large",
        width: 400,
      }
    );

    // Optional: One Tap prompt
    window.google?.accounts.id.prompt();
  }, []);

  return (
    <div className="container-fluid login-page d-flex flex-column flex-md-row p-0">
      {/* Left Illustration */}
      <div className="login-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={loginIllustration} alt="Login Illustration" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
        <h2 className="fw-bold text-center">Login to join us</h2>
        <p className="text-center mt-2">
          Think, ask, and learn with <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Right Form */}
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

          {/* Google button placeholder */}
          {/* <div id="google-login-button" className="w-100 mb-3"></div> */}
          <div className="d-flex justify-content-center" id="google-login-button"></div>


          <p className="mt-4 text-center text-muted">
            Don’t have an account? <Link to="/register" className="text-primary">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
