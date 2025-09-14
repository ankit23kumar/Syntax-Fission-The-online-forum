// src/pages/AboutPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AboutPage.css'; // <-- Import the enhanced CSS
import logo from '../assets/logo_sf.png'; // <-- Import your logo
// Import professional icons to replace emojis
import { FaRocket, FaQuestionCircle, FaHandsHelping } from 'react-icons/fa';

// Animation variants for the cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const AboutPage = () => {
  return (
    <div className="about-page-wrapper">
      <div className="container">
        {/* --- Top Header --- */}
        <motion.div
          className="about-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="display-4">About Syntax Fission</h1>
          <p className="fs-5 mt-2">
            Discover our mission, our community, and the vision that drives our platform.
          </p>
        </motion.div>
      </div>

      {/* --- NEW: Mission Section with Logo --- */}
      <section className="mission-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <motion.div 
              className="col-lg-6 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <img src={logo} alt="Syntax Fission Logo" className="mission-logo" />
            </motion.div>
            <motion.div 
              className="col-lg-6 mission-text"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h2 className="fw-bold">Our Mission</h2>
              <p>
                At Syntax Fission, our mission is to break down the barriers to technical knowledge. We believe in the power of community to solve complex problems and foster growth. We're building an intelligent, intuitive, and respectful space where developers, students, and enthusiasts can connect, share, and evolve together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Main Content Section with Cards --- */}
      <section className="about-content-section">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="section-title-cyan"
          >
            What We Offer
          </motion.h2>
          
          <motion.div 
            className="row g-4 justify-content-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { icon: <FaRocket />, title: 'What is?', desc: 'A next-gen forum platform for modern communities.' },
              { icon: <FaQuestionCircle />, title: 'FAQ', desc: 'Instant answers to commonly asked questions.' },
              { icon: <FaHandsHelping />, title: 'Support', desc: '24/7 community and expert support.' },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="col-sm-10 col-md-6 col-lg-4" 
                variants={cardVariants}
              >
                <div className="about-card">
                  <div className="icon">{item.icon}</div>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-secondary mb-0">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;