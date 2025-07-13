import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">SYNTAX <span className="text-dark">FISSION</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/questions">Questions & Answers</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/features">Features</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
            <li className="nav-item"><Link className="btn btn-outline-primary" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="btn btn-warning text-white" to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
