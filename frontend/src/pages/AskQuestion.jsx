// src/pages/AskQuestion.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext"; // Using toast for better feedback
import { askQuestion } from "../services/qaService"; // Using the single, correct service function
import QuillEditor from "../components/QuillEditor";
import "../styles/AskQuestion.css"; // Your beautiful CSS is unchanged

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); // The string input from the user
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!title.trim() || !content.trim() || content === '<p><br></p>') {
      showToast("Title and content are required.", "warning");
      return;
    }
    setLoading(true);

    try {
      // 1. Parse the tags string into a clean array of tag names.
      // This regex is robust and handles spaces, commas, and hashtags as separators.
      const parsedTagNames = tags.trim().split(/[\s,;#]+/).filter(Boolean);

      if (parsedTagNames.length === 0) {
        showToast("Please provide at least one tag.", "warning");
        setLoading(false);
        return;
      }
      
      // 2. Create the single, clean data payload for the backend.
      // The `tag_names` key matches the `write_only` field in your Django serializer.
      const payload = {
        title,
        content,
        tag_names: parsedTagNames,
      };

      // 3. Make ONE efficient API call.
      const res = await askQuestion(payload);

      showToast("Question posted successfully!", "success");
      // 4. Redirect to the newly created question's page.
      navigate(`/questions/${res.data.question_id}`);

    } catch (error) {
      console.error("Error posting question:", error.response?.data || error.message);
      showToast(error.response?.data?.detail || "Something went wrong. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <div className="ask-question-page d-flex">
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold">Ask a Public Question</h2>

        <form
          className="question-form mt-4"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          {/* Title */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Title<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. How to center a div using Flexbox?"
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
            <div className="form-control p-0" style={{ minHeight: "200px" }}>
              <QuillEditor value={content} onChange={setContent} placeholder="Explain your question clearly and concisely..."/>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Tags<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. #react #css #flexbox"
              className="form-control"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
            />
            <div className="form-text">
              Separate tags with space or `#` — for example: `html css javascript`
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3">
            <button
              type="submit"
              className="btn btn-info text-white"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
            <button type="reset" className="btn btn-warning text-dark">
              Clear
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AskQuestion;