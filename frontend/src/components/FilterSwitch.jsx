import React, { useState } from "react";
import "../styles/NewQuestions.css";

const FilterSwitch = () => {
  const filters = ["Newest", "Active", "Bountied", "Unanswered", "Week", "Month"];
  const [activeFilter, setActiveFilter] = useState("Newest");

  return (
    <div className="switch-btn-group d-flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`switch-btn ${activeFilter === filter ? "active" : ""}`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterSwitch;
