// src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IoSearch } from "react-icons/io5";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";
import logo from "../assets/logo_sf.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  // Get the full user object to check for the is_admin flag
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we are on the homepage for the transparent effect
  const isHomePage = location.pathname === '/';

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/new-questions?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchVisible(false);
      setIsOpen(false);
    }
  };

  const closeMenu = () => setIsOpen(false);

  // --- DEFINITIVE FIX FOR ADMIN REDIRECTION ---
  // Dynamically determine the correct paths based on user role.
  const dashboardPath = user?.is_admin ? "/admin/dashboard" : "/dashboard";
  const profilePath = user?.is_admin ? "/admin/profile" : "/dashboard";

  // Animation variants for the mobile menu
  const mobileMenuVariants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };
  const mobileLinkVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 50, opacity: 0 }
  };

  return (
    <>
      <header className={`navbar-wrapper ${(scrolled || !isHomePage) ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Left: Brand */}
          <Link to="/" className="navbar-brand-link">
            <img src={logo} alt="Syntax Fission Logo" className="navbar-logo" />
            <h1 className="navbar-title">
              <span className="title-syntax">SYNTAX</span>
              <span className="title-fission"> FISSION</span>
            </h1>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="navbar-center d-none d-lg-flex">
            <Link to="/about" className="nav-link-custom">About</Link>
            <Link to="/new-questions" className="nav-link-custom">Questions & Answers</Link>
            <Link to="/features" className="nav-link-custom">Features</Link>
            <Link to="/contact" className="nav-link-custom">Contact Us</Link>
          </nav>

          {/* Right: Actions */}
          <div className="navbar-right d-flex align-items-center">
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="search-form d-none d-lg-flex" onMouseLeave={() => setSearchVisible(false)}>
              <motion.button type="button" className="search-icon-btn" onMouseEnter={() => setSearchVisible(true)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IoSearch size={18} />
              </motion.button>
              <AnimatePresence>
                {searchVisible && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }} animate={{ width: 200, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }} type="text" className="form-control search-input" value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} autoFocus placeholder="Search questions..."
                  />
                )}
              </AnimatePresence>
            </form>
            
            {/* Desktop Auth */}
            <div className="auth-actions d-none d-lg-flex">
              {user ? (
                <>
                  <NotificationBell />
                  <div className="dropdown">
                    <button className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src={user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                           alt="Avatar" className="user-avatar" />
                      <span>{user.name || "User"}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                      <li><Link className="dropdown-item" to={dashboardPath}>Dashboard</Link></li>
                      <li><Link className="dropdown-item" to={profilePath}>Profile</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Register</Link>
                </>
              )}
            </div>
            
            {/* Mobile Toggler */}
            <button className={`navbar-toggler d-lg-none ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
              <div className="hamburger-icon"></div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
           <motion.nav
            className="mobile-menu d-lg-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="mobile-menu-content"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div variants={mobileLinkVariants}><Link onClick={closeMenu} to="/about" className="mobile-link">About</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link onClick={closeMenu} to="/new-questions" className="mobile-link">Questions & Answers</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link onClick={closeMenu} to="/features" className="mobile-link">Features</Link></motion.div>
              <motion.div variants={mobileLinkVariants}><Link onClick={closeMenu} to="/contact" className="mobile-link">Contact Us</Link></motion.div>
              
              <motion.form variants={mobileLinkVariants} onSubmit={handleSearchSubmit} className="mobile-search-form">
                <input type="text" placeholder="Search..." className="form-control" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit" className="search-icon-btn"><IoSearch /></button>
              </motion.form>
              
              <motion.div variants={mobileLinkVariants} className="w-100"><hr/></motion.div>
              
              {!user ? (
                <motion.div variants={mobileLinkVariants} className="mobile-auth-actions">
                  <Link onClick={closeMenu} to="/login" className="btn-login w-100">Login</Link>
                  <Link onClick={closeMenu} to="/register" className="btn-register w-100">Register</Link>
                </motion.div>
              ) : (
                <motion.div variants={mobileLinkVariants} className="mobile-user-info">
                  <img src={user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="User" className="user-avatar-large" />
                  <strong>Welcome, {user.name || "User"}</strong>
                  <div className="d-flex flex-column align-items-center gap-3 mt-3">
                    <Link onClick={closeMenu} to={dashboardPath} className="mobile-link-small">Dashboard</Link>
                    <Link onClick={closeMenu} to={profilePath} className="mobile-link-small">Profile</Link>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">Logout</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;