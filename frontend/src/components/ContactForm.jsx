import React from 'react';
import './ContactForm.css';

const ContactForm = () => {
  return (
    <section className="contact-section py-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-4 align-items-start">
        
        {/* Contact Info */}
        <div className="contact-info col-md-5">
          <h4 className="fw-bold mb-3">Contact Us</h4>
          <p>Have questions about Syntax Fission? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.</p>
          <p><i className="bi bi-envelope-fill text-info me-2"></i><strong>Email Us</strong><br />contact@syntaxfission.com</p>
          <p><i className="bi bi-people-fill text-info me-2"></i><strong>Follow Us</strong><br />Join our social community</p>
        </div>

        {/* Contact Form */}
        <form className="contact-form col-md-6">
          <div className="mb-3 d-flex flex-column flex-md-row gap-2">
            <input type="text" placeholder="Your First Name" className="form-control" />
            <input type="text" placeholder="Your Last Name" className="form-control" />
          </div>
          <input type="email" placeholder="Your Email Address" className="form-control mb-3" />
          <textarea rows="3" placeholder="Your Thought & Feedback" className="form-control mb-3"></textarea>
          <button type="submit" className="btn">📨Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;

