import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; //import your custom hook
import "./HeroSection.css";
import heroImg from "../assets/herosection.png";

const HeroSection = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleGetStarted = () => {
    if (accessToken) {
      navigate("/ask-question");
    } else {
      navigate("/login");
    }
  };

  const handleExplore = () => {
    navigate("/new-questions");
  };

  return (
    <section className="hero-section text-dark d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Left: Text Content */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="hero-title">Ask. Answer. Evolve.</h1>
            <h2 className="hero-subtitle">
              A clean, intelligent Q&A platform for coders, students, and
              communities.
            </h2>
            <p className="hero-description">
              Collaborate, solve problems, and build knowledge — all in one
              fast, responsive, and user-friendly space tailored for technical
              discussions.
            </p>
            <div className="mt-4 d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
              <button className="btn-cta-start" onClick={handleGetStarted}>
                Get Started
              </button>
              <button className="btn-cta-explore" onClick={handleExplore}>
                Explore Q & A
              </button>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="col-md-6 text-center mt-4 mt-md-0">
            <img
              src={heroImg}
              alt="Programmer Working"
              className="img-fluid hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
