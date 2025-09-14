// src/pages/NewQuestions.jsx

import React, { useEffect, useState } from "react";
// +++ ADDED: Import useNavigate to handle redirection +++
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAllQuestions } from "../services/qaService";
import FilterSwitch from "../components/FilterSwitch";
import DOMPurify from 'dompurify';
// +++ ADDED: Import useAuth to check the user's login status +++
import { useAuth } from "../contexts/AuthContext";
import "../styles/NewQuestions.css";

const QuestionItem = ({ question }) => {
  // Function to create a clean text-only preview from HTML
  const createTextPreview = (html, length) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").substring(0, length) + '...';
  };

  const textPreview = createTextPreview(question.content, 180);

  return (
    <div className="question-card">
      <div className="question-stats">
        <div className="stat-item">
          <strong>{question.upvotes - question.downvotes}</strong>
          <span>votes</span>
        </div>
        <div className={`stat-item ${question.answer_count > 0 ? 'answered' : ''}`}>
          <strong>{question.answer_count}</strong>
          <span>answers</span>
        </div>
        <div className="stat-item">
          <strong>{question.view_count || 0}</strong>
          <span>views</span>
        </div>
      </div>
      <div className="question-summary">
        <h3 className="question-title">
          <Link to={`/questions/${question.question_id}`}>{question.title}</Link>
        </h3>
        <p className="question-excerpt">
          {textPreview}
        </p>
        <div className="question-meta">
          <div className="tag-list">
            {question.tags.map((tag) => (
              <Link to={`/new-questions?tags=${tag.tag_name}`} key={tag.tag_id} className="tag">
                {tag.tag_name}
              </Link>
            ))}
          </div>
          <div className="author-info">
            <img
              src={question.user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt={question.user.name}
              className="author-avatar"
            />
            <div className="author-details">
              <span className="author-name">{question.user.name}</span>
              <span className="timestamp">
                asked {new Date(question.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="question-card skeleton">
    <div className="question-stats">
      <div className="stat-item"><div className="skeleton-line w-50"></div></div>
      <div className="stat-item"><div className="skeleton-line w-50"></div></div>
      <div className="stat-item"><div className="skeleton-line w-50"></div></div>
    </div>
    <div className="question-summary">
      <div className="skeleton-line w-75 mb-3" style={{ height: '24px' }}></div>
      <div className="skeleton-line w-100"></div>
      <div className="skeleton-line w-100"></div>
      <div className="skeleton-line w-25 mt-3"></div>
    </div>
  </div>
);

const NewQuestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "Newest";
  const tags = searchParams.get("tags") || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await getAllQuestions({ filter, tags });
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [filter, tags]);

  const handleAskQuestionClick = () => {
    if (user) {
      navigate('/ask-question');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="questions-page-container">
      <div className="questions-header">
        <div className="d-flex flex-column">
            <h2 className="fw-bold mb-0">New Questions</h2>
            {!loading && (
                <span className="question-count text-muted mt-1">
                    {questions.length} questions
                </span>
            )}
        </div>
        {/* --- CORRECTED: Removed the unnecessary <Link> wrapper --- */}
        <button className="ask-question-btn" onClick={handleAskQuestionClick}>
          Ask Question
        </button>
      </div>

      <FilterSwitch />

      <div className="question-list-container">
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <QuestionItem key={question.question_id} question={question} />
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No questions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewQuestions;