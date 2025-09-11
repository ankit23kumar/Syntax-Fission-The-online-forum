// src/pages/NewQuestions.jsx

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllQuestions } from "../services/qaService";
import FilterSwitch from "../components/FilterSwitch";
import DOMPurify from 'dompurify'; // <-- Import DOMPurify for security
import "../styles/NewQuestions.css"; // We will rewrite this file

const QuestionItem = ({ question }) => {
  // Sanitize the HTML content before rendering
  const sanitizedContent = DOMPurify.sanitize(question.content);

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
        <h4 className="question-title">
          <Link to={`/questions/${question.question_id}`}>{question.title}</Link>
        </h4>
        <div
          className="question-excerpt"
          dangerouslySetInnerHTML={{ __html: sanitizedContent.substring(0, 150) + '...' }}
        />
        <div className="question-meta">
          <div className="tag-list">
            {question.tags.map((tag) => (
              <span key={tag.tag_id} className="tag">{tag.tag_name}</span>
            ))}
          </div>
          <div className="author-info">
            <img
              src={question.user.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt={question.user.name}
              className="author-avatar"
            />
            <span className="author-name">{question.user.name}</span>
            <span className="timestamp">
              asked {new Date(question.created_at).toLocaleDateString()}
            </span>
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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "Newest";
  const tags = searchParams.get("tags") || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Simulate a slightly longer load time to see the skeleton
        await new Promise(resolve => setTimeout(resolve, 500)); 
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

  return (
    <div className="questions-page-container">
      <div className="questions-header">
        <h2 className="fw-bold">All Questions</h2>
        <Link to="/ask-question">
          <button className="btn ask-question-btn">Ask Question</button>
        </Link>
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
            <p className="text-muted">No questions found. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewQuestions;