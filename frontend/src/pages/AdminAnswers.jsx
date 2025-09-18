// src/pages/AdminAnswers.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
// Reuse the same styles as the other admin pages for consistency
import "../styles/AdminQuestions.css";

const AdminAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { showToast } = useToast();

  const fetchAnswers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/answers/");
      setAnswers(res.data);
    } catch (err) {
      console.error("Failed to fetch answers", err);
      showToast("Failed to fetch answers.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (answer) => {
    setSelectedAnswer(answer);
    setShowConfirmModal(true);
  };
  
  const closeConfirmModal = () => {
    setSelectedAnswer(null);
    setShowConfirmModal(false);
  };

  const deleteAnswer = async () => {
    if (!selectedAnswer) return;
    try {
      // Use the correct primary key 'answer_id' from the serializer
      await api.delete(`/admin/answers/${selectedAnswer.answer_id}/delete/`);
      setAnswers((prev) => prev.filter((a) => a.answer_id !== selectedAnswer.answer_id));
      showToast("Answer deleted successfully.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete answer.", "danger");
    } finally {
      closeConfirmModal();
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const createTextPreview = (html, length) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").substring(0, length) + '...';
  };

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">Manage Answers</h2>
            <p className="page-subtitle">Review and moderate all answers submitted on the platform.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="admin-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <table className="admin-table">
          <thead>
            <tr>
              <th>Answer Preview</th>
              <th>User</th>
              <th>Original Question</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading answers...</td></tr>
            ) : answers.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-4">No answers found.</td></tr>
            ) : (
              answers.map((answer) => (
                <tr key={answer.answer_id}>
                  <td>
                    {/* Use the correct data key 'content' */}
                    <span className="text-muted">{createTextPreview(answer.content, 70)}</span>
                  </td>
                  <td>
                    <div className="author-info-cell">
                      <img src={answer.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={answer.user?.name} />
                      <span>{answer.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <Link to={`/questions/${answer.question?.question_id}`} className="question-title-link" title={answer.question?.title}>
                      {answer.question?.title.substring(0, 40) || "Deleted Question"}...
                    </Link>
                  </td>
                  <td>{new Date(answer.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => openConfirmModal(answer)}
                      className="action-btn delete"
                      title="Delete Answer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div className="modal-backdrop-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content-dark confirm-modal" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
              <div className="modal-body-dark text-center">
                <div className="confirm-icon"><FaTrash /></div>
                <h5>Delete Answer</h5>
                <p>Are you sure you want to delete this answer? This action is irreversible.</p>
              </div>
              <div className="modal-footer-dark confirm-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteAnswer}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnswers;