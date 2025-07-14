// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar p-3">
      <h4 className="logo text-info">Syntax Fission</h4>
      <ul className="nav flex-column mt-4">
        <li>
          <NavLink to="/" className="nav-item">🏠 Home</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className="nav-item">📊 Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/questions" className="nav-item">❓ Questions & Answers</NavLink>
        </li>
        <li>
          <NavLink to="/features" className="nav-item">✨ Features</NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-item">ℹ️ About</NavLink>
        </li>
      </ul>

      <div className="topics mt-4">
        <h6 className="fw-bold mb-3">Topics & Language</h6>
        {["C", "C++", "Python", "Java", "HTML", "CSS", "JavaScript", "Others"].map((lang) => (
          <div key={lang} className="badge bg-light text-dark d-block mb-4">{lang}</div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
