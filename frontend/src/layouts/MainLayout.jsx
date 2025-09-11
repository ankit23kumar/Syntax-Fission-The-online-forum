// src/layouts/MainLayout.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import './MainLayout.css'; // We will create this CSS file next

const MainLayout = ({ children }) => {
  const location = useLocation();

  // Define paths where the sidebar should be hidden
  const noSidebarPaths = ['/', '/login', '/register', '/register/step-2', '/about', '/features', '/contact'];
  const showSidebar = !noSidebarPaths.includes(location.pathname);
  // Define paths where the Navbar should be hidden
  const noNavbarPaths = [ '/login', '/register', '/register/step-2'];
  const showNavbar = !noNavbarPaths.includes(location.pathname);
  // Define paths where the Navbar should be hidden
  const noFooterPaths = [ '/login', '/register', '/register/step-2'];
  const showFooter = !noFooterPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="main-layout-container">
        {showSidebar && <Sidebar />}
        <main className="main-content">
          {children}
        </main>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default MainLayout;