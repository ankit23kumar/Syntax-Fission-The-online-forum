import React from "react";
import "../styles/QuestionsFeed.css";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const sampleQuestions = [
  {
    id: 1,
    title: "A Huge Text of Title of Questions in New Question Page",
    description: "Lorem ipsum dolor sit amet consectetur. Purus vel placerat pellentesque eleifend dui ornare risus. Fringilla sed eget adipiscing elit suspendisse.",
    author: "Jack William",
    tags: ["Tag", "Tag", "Tag"],
    postedAgo: "2 days ago"
  },
  // Add more dummy questions here if needed
];

const QuestionsFeed = () => {
  return (
    <div className="questions-page d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h3 className="fw-bold mb-2 mb-md-0">New Questions</h3>
          <button className="btn btn-info text-white">Ask Question</button>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {["Newest", "Active", "Bountied", "Unanswered", "Week", "Month"].map((filter) => (
            <button key={filter} className="btn btn-sm btn-outline-secondary">{filter}</button>
          ))}
        </div>

        {/* Questions List */}
        {sampleQuestions.map((q) => (
          <div key={q.id} className="question-card mb-4 p-3 bg-white shadow-sm rounded">
            <div className="row">
              <div className="col-md-1 d-none d-md-flex flex-column align-items-center text-center small text-muted">
                <div>00<br />Votes</div>
                <div className="mt-2">00<br />Answer</div>
                <div className="mt-2">00<br />Views</div>
              </div>
              <div className="col">
                <h5 className="fw-bold">{q.title}</h5>
                <p>{q.description}</p>
                <div className="d-flex flex-wrap align-items-center justify-content-between mt-2">
                  <div className="tags">
                    {q.tags.map((tag, i) => (
                      <span key={i} className="badge bg-light text-dark me-2">{tag}</span>
                    ))}
                  </div>
                  <div className="author d-flex align-items-center text-muted small">
                    <FaUserCircle className="me-1" />
                    {q.author} &nbsp;·&nbsp; asked {q.postedAgo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default QuestionsFeed;
