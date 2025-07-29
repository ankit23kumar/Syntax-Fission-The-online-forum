import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ make sure path is correct
import "./Navbar.css";
import logo from "../assets/logo_sf.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar-gradient border-bottom">
      <div className="container d-flex align-items-center justify-content-between py-3 px-2">
        {/* Logo + Brand */}
        <div className="navbar-left d-flex align-items-center gap-3">
          <img src={logo} alt="Syntax Fission Logo" className="navbar-logo" />
          <h1 className="navbar-title mb-0">
            <span className="text-info">SYNTAX</span>
            <span className="text-dark"> FISSION</span>
          </h1>
        </div>

        {/* Hamburger Icon */}
        <button className="navbar-toggler d-lg-none" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <Link to="/about" className="nav-link-custom">About</Link>
          <Link to="/new-questions" className="nav-link-custom">Questions & Answers</Link>
          <Link to="/features" className="nav-link-custom">Features</Link>
          <Link to="/contact" className="nav-link-custom">Contact Us</Link>
        </nav>

        {/* Right section based on auth */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="dropdown-toggle d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-circle"
                />
                <span>{user.name || user.username || "User"}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/account">Account</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="navbar-collapse d-lg-none text-center">
          <Link to="/about" className="nav-link-custom d-block my-2">About</Link>
          <Link to="/questions" className="nav-link-custom d-block my-2">Questions & Answers</Link>
          <Link to="/features" className="nav-link-custom d-block my-2">Features</Link>
          <Link to="/contact" className="nav-link-custom d-block my-2">Contact Us</Link>
          {!user ? (
            <div className="d-flex flex-column gap-2 mt-3">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center mt-3">
              <img
                src={user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                alt="User"
                width={40}
                height={40}
                className="rounded-circle mb-2"
              />
              <strong>{user.name || user.username || "User"}</strong>
              <Link to="/dashboard" className="nav-link-custom my-2">Dashboard</Link>
              <Link to="/profile" className="nav-link-custom my-1">Profile</Link>
              <Link to="/account" className="nav-link-custom my-1">Account</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-outline-danger mt-2">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
