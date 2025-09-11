// src/pages/FeaturesPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import FeatureSection from '../components/FeatureSection'; // <-- Reusing your existing component
import '../styles/PageHeader.css'; // <-- Using our new shared styles

const FeaturesPage = () => {
  return (
    <div className="page-header-container">
      <div className="container">
        <motion.div
          className="page-header text-center"
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

      {/* 
        Here, we render your existing FeatureSection.
        The scroll-triggered animations will work perfectly here as well.
      */}
      <FeatureSection />
    </div>
  );
};

export default FeaturesPage;