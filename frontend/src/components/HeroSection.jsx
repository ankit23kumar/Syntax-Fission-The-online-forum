import React from 'react';
// import heroImg from '../assets/images/hero-banner.png'; // Use correct image path

const HeroSection = () => {
  return (
    <section className="bg-gradient text-white py-5" style={{ background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}>
      <div className="container d-flex flex-column flex-md-row align-items-center">
        <div className="col-md-6">
          <h1 className="display-4 fw-bold">Ask . Answer . Evolve</h1>
          <p className="lead mt-3">A clean, intelligent Q&A platform for coders, students, and communities.</p>
          <p>Collaborate, solve problems, and build knowledge — all in one user-friendly space.</p>
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-info btn-lg">Get Started</button>
            <button className="btn btn-warning btn-lg">Explore Q & A</button>
          </div>
        </div>
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <img src={heroImg} alt="Hero Visual" className="img-fluid" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
