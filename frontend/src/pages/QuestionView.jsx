// src/pages/QuestionView.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/QuestionView.css";

const QuestionView = () => {
  const question = {
    title: "How to implement JWT authentication in Django?",
    content: "I'm building a full-stack project and want to add secure login using JWT. What packages or steps should I follow?",
    tags: ["django", "authentication", "jwt"],
    author: "Ankit Kumar",
    date: "July 12, 2025",
  };

  const answers = [
    {
      id: 1,
      content: "You can use `djangorestframework-simplejwt`. Install it via pip and configure it in your Django REST settings.",
      author: "DevMaster",
      date: "July 13, 2025",
    },
    {
      id: 2,
      content: "Make sure to set access and refresh token lifetime in your settings and secure your secret key.",
      author: "CoderGirl",
      date: "July 13, 2025",
    },
  ];

  return (
    <div className="question-view-page d-flex">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        {/* Question Details */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h3 className="fw-bold">{question.title}</h3>
          <div className="text-muted mb-2">
            Asked by <strong>{question.author}</strong> on {question.date}
          </div>
          <p className="mt-3">{question.content}</p>
          <div className="d-flex flex-wrap gap-2 mt-3">
            {question.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-info text-dark">{tag}</span>
            ))}
          </div>
        </div>

        {/* Answers */}
        <div className="answers-section">
          <h5 className="fw-bold mb-3">Answers ({answers.length})</h5>
          {answers.map((ans) => (
            <div key={ans.id} className="bg-light rounded p-3 mb-3">
              <p className="mb-2">{ans.content}</p>
              <small className="text-muted">
                Answered by <strong>{ans.author}</strong> on {ans.date}
              </small>
            </div>
          ))}
        </div>

        {/* Answer Form */}
        <div className="mt-5">
          <h5 className="fw-bold mb-3">Your Answer</h5>
          <form>
            <div className="mb-3">
              <textarea
                rows="5"
                className="form-control"
                placeholder="Write your answer here..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-info text-white">Post Answer</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default QuestionView;
