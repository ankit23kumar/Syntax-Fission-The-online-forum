// src/components/FeatureSection.jsx

import React from 'react';
import { motion } from 'framer-motion'; // <-- Import framer-motion

const features = [
  { icon: '💬', title: 'AI Question & Answer', desc: 'Get intelligent answers powered by community-trained AI.' },
  { icon: '🔍', title: 'Advanced Q&A Filter', desc: 'Search by tags, difficulty, and more with powerful filters.' },
  { icon: '👤', title: 'User Profiles', desc: 'Build professional presence with rich user profiles.' },
  { icon: '🛡️', title: 'Content Moderation', desc: 'AI-powered moderation ensures respectful, quality content.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track engagement and contributions across the platform.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with intelligent, personalized alerts.' },
];

// Re-using the same animation logic for consistency
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }, // A slightly faster stagger for more items
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

const FeatureSection = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-info fw-bold mb-4"
        >
          Powerful Features
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted mb-5"
        >
          Everything you need for the perfect forum experience.
        </motion.p>

        <motion.div 
          className="row g-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger when the top of the grid is 10% visible
        >
          {features.map((feat, index) => (
            <motion.div 
              key={index} 
              className="col-sm-10 col-md-6 col-lg-4" 
              variants={cardVariants}
            >
              <motion.div 
                className="p-4 border rounded shadow-sm h-100"
                whileHover={{ y: -10, scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }} // Interactive hover effect
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="fs-1 text-warning mb-3">{feat.icon}</div>
                <h5 className="fw-semibold">{feat.title}</h5>
                <p className="text-secondary">{feat.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;