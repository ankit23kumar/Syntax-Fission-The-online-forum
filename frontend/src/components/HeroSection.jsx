// src/components/HeroSection.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./HeroSection.css";
import heroImg from "../assets/herosection.png";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const imageVariants = {
  hidden: { x: 100, opacity: 0, scale: 0.9 },
  visible: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.8, ease: "circOut" } },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleGetStarted = () => navigate(accessToken ? "/ask-question" : "/login");
  const handleExplore = () => navigate("/new-questions");

  return (
    <section className="hero-section">
      {/* --- NEW: Aura Effect Background Blobs --- */}
      <div className="auras">
        <div className="aura-blob pink"></div>
        <div className="aura-blob yellow"></div>
        <div className="aura-blob purple"></div>
      </div>
      
      <div className="container hero-content">
        <div className="row align-items-center">
          <motion.div
            className="col-lg-6 text-center text-lg-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="hero-title">
              Ask. Answer. Evolve.
            </motion.h1>
            <motion.h2 variants={itemVariants} className="hero-subtitle">
              A clean, intelligent Q&A platform for coders, students, and
              communities.
            </motion.h2>
            <motion.p variants={itemVariants} className="hero-description">
              Collaborate, solve problems, and build knowledge — all in one
              fast, responsive, and user-friendly space tailored for technical
              discussions.
            </motion.p>
            <motion.div variants={itemVariants} className="hero-cta-group">
              <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                className="btn-cta-start" onClick={handleGetStarted}>
                Get Started
              </motion.button>
              <motion.button whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
                className="btn-cta-explore" onClick={handleExplore}>
                Explore Q & A
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="col-lg-6 d-none d-lg-block mt-5 mt-lg-0"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.img src={heroImg} alt="Programmer Working" className="img-fluid hero-image"/>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;