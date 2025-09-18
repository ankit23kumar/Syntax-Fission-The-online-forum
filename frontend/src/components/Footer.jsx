// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for proper navigation
import { motion } from 'framer-motion';
import '../styles/Footer.css'; // <-- Import the new dedicated CSS

const Footer = () => {
  return (
    <motion.footer 
      className="footer-wrapper"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      <div className="container footer-container">
        {/* Brand Info */}
        <div className="footer-brand">
          <h5 className="fw-bold">Syntax Fission</h5>
          <p>© 2025 | Designed and Coded by Ankit Kumar</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h6>Quick Links</h6>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/new-questions">Q&A</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Terms & Policy */}
        <div className="footer-links">
          <h6>Terms & Policy</h6>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy & Conditions</Link></li>
          </ul>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;