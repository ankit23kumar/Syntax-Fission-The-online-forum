// src/components/ContactForm.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../contexts/ToastContext';
import { submitContactForm } from '../services/contactService';
import './ContactForm.css';

const ContactForm = ({ isStandalonePage = false }) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      await submitContactForm(data);
      showToast("Message sent! We'll be in touch soon.", "success");
      e.target.reset();
    } catch (error) {
      showToast(error.response?.data?.error || "Something went wrong.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <motion.form 
      className="contact-form"
      onSubmit={handleSubmit}
      initial={{ x: 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    >
      <div className="d-flex flex-column flex-md-row gap-3">
        <input name="first_name" type="text" placeholder="First Name" className="form-control" required />
        <input name="last_name" type="text" placeholder="Last Name" className="form-control" required />
      </div>
      <input name="email" type="email" placeholder="Email Address" className="form-control" required />
      <textarea name="message" rows="4" placeholder="Your Thought & Feedback" className="form-control" required></textarea>
      <motion.button 
        type="submit" 
        className="btn-submit" 
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? <span className="spinner-border spinner-border-sm"></span> : "Send Message"}
      </motion.button>
    </motion.form>
  );

  const infoContent = (
    <motion.div 
      className="contact-info"
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className="fw-bold mb-3">{isStandalonePage ? "Contact Information" : "Contact Us"}</h2>
      <p>Have questions about Syntax Fission? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.</p>
      <div className="info-item"> <i className="bi bi-envelope-fill"></i> <div> <strong>Email Us</strong> <span>contact@syntaxfission.com</span> </div> </div>
      <div className="info-item"> <i className="bi bi-people-fill"></i> <div> <strong>Follow Us</strong> <span>Join our social community</span> </div> </div>
    </motion.div>
  );
  
  if (isStandalonePage) {
    // For the Contact Us page, wrap in a container with a light background
    return (
      <div className="contact-page-wrapper">
        <div className="container contact-container">
          {infoContent}
          {formContent}
        </div>
      </div>
    );
  }

  // Default render for the homepage (with the dark gradient background)
  return (
    <motion.section 
      className="contact-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container contact-container">
        {infoContent}
        {formContent}
      </div>
    </motion.section>
  );
};

export default ContactForm;