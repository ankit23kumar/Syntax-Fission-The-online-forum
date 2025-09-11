// src/components/Footer.jsx

import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-black text-white py-4 mt-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.0, ease: "easeIn" }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold">Syntax Fission</h5>
            <p className="mb-0">© 2025 | Designed and Coded by Ankit Kumar</p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">Home</motion.a></li>
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">About</motion.a></li>
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">Q&A</motion.a></li>
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">Contact</motion.a></li>
            </ul>
          </div>

          {/* Terms & Policy */}
          <div className="col-6 col-md-4">
            <h6 className="fw-semibold">Terms & Policy</h6>
            <ul className="list-unstyled">
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">FAQ</motion.a></li>
              <li><motion.a whileHover={{ x: 5, color: '#29c1e2' }} href="#" className="text-white text-decoration-none d-inline-block">Privacy & Conditions</motion.a></li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;