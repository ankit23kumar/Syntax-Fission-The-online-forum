import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/NewQuestions.css";

const FilterSwitch = () => {
  const filters = ["Newest", "Active", "Bountied", "Unanswered", "Week", "Month"];
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeFilter = searchParams.get("filter") || "Newest";

  const handleFilterChange = (filter) => {
    const newParams = new URLSearchParams(searchParams.toString()); // 🛠️ clone first
    newParams.set("filter", filter);
    navigate(`/new-questions?${newParams.toString()}`);
  };

  return (
    <div className="switch-btn-group d-flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`switch-btn ${activeFilter === filter ? "active" : ""}`}
          onClick={() => handleFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterSwitch;
