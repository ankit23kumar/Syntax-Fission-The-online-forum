import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { askQuestion, createOrGetTag } from "../services/qaService";
import "../styles/AskQuestion.css";
import QuillEditor from "../components/QuillEditor";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tagList = tags
      .trim()
      .split(/[\s#]+/)
      .filter((tag) => tag.length > 0);

    try {
      const tagIDs = await Promise.all(
        tagList.map(async (tag) => {
          try {
            const res = await createOrGetTag(tag);
            return res.data.tag_id;
          } catch (err) {
            console.warn(
              `Failed to create or fetch tag "${tag}"`,
              err.response?.data || err.message
            );
            return null;
          }
        })
      );

      const validTags = tagIDs.filter(Boolean);

      const payload = {
        title,
        content,
        tag_id: validTags,
      };

      const res = await askQuestion(payload);
      console.log("Question posted:", res.data);

      navigate(`/questions/${res.data.question_id}`); // redirect to newly created question
    } catch (error) {
      console.error(
        "Error posting question:",
        error.response?.data || error.message
      );
      alert("Something went wrong. Please try again.");
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

          {/* Content
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Content<span className="text-danger">*</span>
            </label>
            <textarea
              rows="8"
              placeholder="Explain your question clearly and concisely..."
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div> */}
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
              Separate tags with space or `#` — for example: `#html css
              javascript`
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
