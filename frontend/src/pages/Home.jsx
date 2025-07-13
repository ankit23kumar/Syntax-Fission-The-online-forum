import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeatureSection from '../components/FeatureSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Home;
