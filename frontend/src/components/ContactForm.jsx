import React from 'react';

const ContactForm = () => {
  return (
    <section className="bg-dark text-white py-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between">
        <div className="col-md-5 mb-4">
          <h4>Contact Us</h4>
          <p>Send us a message and we’ll respond as soon as possible.</p>
          <p><strong>Email:</strong> contact@syntaxfission.com</p>
          <p><strong>Follow:</strong> Join our social community</p>
        </div>
        <form className="col-md-6 bg-primary p-4 rounded shadow">
          <div className="mb-3 d-flex gap-2">
            <input type="text" placeholder="First Name" className="form-control" />
            <input type="text" placeholder="Last Name" className="form-control" />
          </div>
          <input type="email" placeholder="Email Address" className="form-control mb-3" />
          <textarea rows="3" placeholder="Your Message" className="form-control mb-3"></textarea>
          <button className="btn btn-dark w-100">📨 Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
