import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between">
        <div>
          <h5>Syntax Fission</h5>
          <p>© 2025 | Designed and Coded by Ankit Kumar</p>
        </div>
        <div>
          <h6>Quick Links</h6>
          <ul className="list-unstyled">
            <li>Home</li>
            <li>About</li>
            <li>Q&A</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h6>Terms & Policy</h6>
          <ul className="list-unstyled">
            <li>FAQ</li>
            <li>Privacy & Conditions</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
