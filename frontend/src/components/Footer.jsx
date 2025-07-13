import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className="container">
        <div className="row gy-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold">Syntax Fission</h5>
            <p className="mb-0">© 2025 | Designed and Coded by Ankit Kumar</p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Home</a></li>
              <li><a href="#" className="text-white text-decoration-none">About</a></li>
              <li><a href="#" className="text-white text-decoration-none">Q&A</a></li>
              <li><a href="#" className="text-white text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Terms & Policy */}
          <div className="col-6 col-md-4">
            <h6 className="fw-semibold">Terms & Policy</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy & Conditions</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
