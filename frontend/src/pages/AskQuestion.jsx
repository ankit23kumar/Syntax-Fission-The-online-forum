// src/pages/AskQuestion.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AskQuestion.css";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({ title, content, tags });
  };

  return (
    <div className="ask-question-page d-flex">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold">Ask a public question</h2>
        <form className="question-form mt-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Title<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Content<span className="text-danger">*</span>
            </label>
            <textarea
              placeholder="Include all the information someone would need to answer your question"
              className="form-control"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Tags<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. spring html laravel"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-info text-white">
              Post Question
            </button>
            <button type="reset" className="btn btn-warning text-dark">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AskQuestion;
