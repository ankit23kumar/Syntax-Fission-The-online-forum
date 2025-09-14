// src/pages/FeaturesPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import '../styles/FeaturesPage.css'; // <-- Import the new dedicated CSS

// Animation variants for the cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  },
};

// Your existing features data
const features = [
  { icon: '💬', title: 'AI Question & Answer', desc: 'Get intelligent answers powered by community-trained AI.' },
  { icon: '🔍', title: 'Advanced Q&A Filter', desc: 'Search by tags, difficulty, and more with powerful filters.' },
  { icon: '👤', title: 'User Profiles', desc: 'Build professional presence with rich user profiles.' },
  { icon: '🛡️', title: 'Content Moderation', desc: 'AI-powered moderation ensures respectful, quality content.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track engagement and contributions across the platform.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with intelligent, personalized alerts.' },
];


const FeaturesPage = () => {
  return (
    <div className="features-page-wrapper">
      <div className="container">
        {/* --- Top Header --- */}
        <motion.div
          className="features-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="display-4">Powerful Features</h1>
          <p className="fs-5 mt-2">
            Everything you need for the perfect forum experience, all in one place.
          </p>
        </motion.div>
      </div>

      {/* --- Main Content Section with Cards --- */}
      <section className="features-content-section">
        <div className="container">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="section-title-cyan"
          >
            Our Platform's Capabilities
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-paragraph"
          >
            We've packed Syntax Fission with tools designed to enhance collaboration, simplify knowledge sharing, and empower our community.
          </motion.p>
          
          <motion.div 
            className="row g-4 justify-content-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feat, index) => (
              <motion.div 
                key={index} 
                className="col-sm-10 col-md-6 col-lg-4" 
                variants={cardVariants}
              >
                <div className="feature-card">
                  <div className="icon">{feat.icon}</div>
                  <h5 className="fw-semibold">{feat.title}</h5>
                  <p className="text-secondary mb-0">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;