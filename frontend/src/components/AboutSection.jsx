// src/components/AboutSection.jsx

import React from 'react';
import { motion } from 'framer-motion'; // <-- Import framer-motion

// Animation for the container to orchestrate staggered animations for its children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }, // Each card will animate 0.15s after the previous one
  },
};

// Animation for the individual cards
const cardVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const AboutSection = () => {
  return (
    <section className="py-5 bg-light text-center">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} // Animate when the element is in the viewport
          viewport={{ once: true, amount: 0.5 }} // Trigger animation once, when 50% is visible
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fw-bold text-info mb-4"
        >
          About Syntax Fission
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}
        >
          Syntax Fission is a vibrant community where knowledge meets innovation. It's a next-gen Q&A platform designed for collaboration, expert advice, and growth.
        </motion.p>

        <motion.div 
          className="row g-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible" // Start the container animation when it's in view
          viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the grid is visible
        >
          {[
            { icon: '🚀', title: 'What is?', desc: 'A next-gen forum platform for modern communities.' },
            { icon: '❓', title: 'FAQ', desc: 'Instant answers to commonly asked questions.' },
            { icon: '🛠️', title: 'Support', desc: '24/7 community and expert support.' },
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="col-sm-10 col-md-6 col-lg-4" 
              variants={cardVariants} // Each card uses the same animation variant
            >
              <motion.div 
                className="bg-white rounded shadow-sm p-4 h-100"
                whileHover={{ y: -10, scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} // Interactive hover effect
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="fs-1 mb-3">{item.icon}</div>
                <h5 className="fw-semibold">{item.title}</h5>
                <p className="text-secondary">{item.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;