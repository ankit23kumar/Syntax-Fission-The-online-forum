import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import loginIllustration from "../assets/login_cuate.svg";

const Login = () => {
  return (
    <div className="container-fluid login-page d-flex flex-column flex-md-row p-0">
      {/* Left Illustration Section */}
      <div className="login-left d-flex flex-column justify-content-center align-items-center text-white px-4 py-5">
        <img src={loginIllustration} alt="Login Illustration" className="img-fluid mb-4" style={{ maxHeight: 300 }} />
        <h2 className="fw-bold text-center">Login for join with us</h2>
        <p className="text-center mt-2">
          Think, ask, and learn from <span className="text-warning">Syntax Fission</span>
        </p>
      </div>

      {/* Right Form Section */}
      <div className="login-right bg-white d-flex flex-column justify-content-center align-items-center px-4 py-5">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h3 className="fw-bold mb-2">Welcome Back!</h3>
          <p className="mb-4">Please enter log in details below</p>
          <form>
            <div className="mb-3">
              <input type="email" placeholder="Email" className="form-control form-control-lg" />
            </div>
            <div className="mb-3">
              <input type="password" placeholder="Password" className="form-control form-control-lg" />
            </div>
            <button type="submit" className="btn btn-info text-white btn-lg w-100 mb-3">Login</button>

            <div className="text-center my-3 text-muted">──────── or continue ────────</div>

            <button type="button" className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-2">
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
              Log in with Google
            </button>
          </form>

          <p className="mt-4 text-center text-muted">
            Don’t have an account? <Link to="/register" className="text-primary">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
