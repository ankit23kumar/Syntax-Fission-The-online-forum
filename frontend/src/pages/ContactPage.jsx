import React from 'react';
import ContactForm from '../components/ContactForm'; // We'll use the component here

const ContactPage = () => {
  return (
    <div className="container py-5">
      {/* You can add more content here if you like */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Get In Touch</h1>
        <p className="text-muted">We're here to help and answer any question you might have.</p>
      </div>
      
      {/* Render the ContactForm component. 
          Note: We are passing a prop to tell it it's on a standalone page. */}
      <ContactForm isStandalonePage={true} />
    </div>
  );
};

export default ContactPage