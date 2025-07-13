import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo_sf.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

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
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <Link to="/about" className="nav-link-custom">About</Link>
          <Link to="/questions" className="nav-link-custom">Questions & Answers</Link>
          <Link to="/features" className="nav-link-custom">Features</Link>
          <Link to="/contact" className="nav-link-custom">Contact Us</Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="d-none d-lg-flex gap-2">
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Register</Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="navbar-collapse d-lg-none text-center">
          <Link to="/about" className="nav-link-custom d-block my-2">About</Link>
          <Link to="/questions" className="nav-link-custom d-block my-2">Questions & Answers</Link>
          <Link to="/features" className="nav-link-custom d-block my-2">Features</Link>
          <Link to="/contact" className="nav-link-custom d-block my-2">Contact Us</Link>
          <div className="d-flex flex-column gap-2 mt-3">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
