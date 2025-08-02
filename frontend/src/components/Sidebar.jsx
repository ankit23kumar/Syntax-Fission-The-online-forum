import React from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isDashboard = location.pathname.startsWith("/dashboard");
  const currentTag = searchParams.get("tags")?.toLowerCase() || "";

  const tagList = [
    "C", "C++", "Python", "Java", "HTML",
    "CSS", "JavaScript", "Others"
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleTagFilter = (tag) => {
    const updatedParams = new URLSearchParams(location.search);
    const normalizedTag = tag.toLowerCase();

    if (currentTag === normalizedTag) {
      // If already active → remove tag filter
      updatedParams.delete("tags");
    } else {
      // Otherwise → set the selected tag
      updatedParams.set("tags", normalizedTag);
    }

    navigate({
      pathname: "/new-questions",
      search: updatedParams.toString(),
    });
  };

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
          <NavLink to="/new-questions" className="nav-item">❓ Questions & Answers</NavLink>
        </li>
        <li>
          <NavLink to="/features" className="nav-item">✨ Features</NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-item">ℹ️ About</NavLink>
        </li>
      </ul>

      {!isDashboard && (
        <div className="topics mt-4">
          <h6 className="fw-bold mb-3">Topics & Language</h6>
          {tagList.map((lang) => {
            const normalizedLang = lang.toLowerCase();
            const isActive = currentTag === normalizedLang;

            return (
              <div
                key={lang}
                role="button"
                onClick={() => handleTagFilter(lang)}
                className={`badge bg-light text-dark d-block mb-2 sidebar-tag ${
                  isActive ? "border border-info fw-semibold" : ""
                }`}
              >
                {lang}
              </div>
            );
          })}
        </div>
      )}

      {isDashboard && (
        <div className="mt-5">
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
