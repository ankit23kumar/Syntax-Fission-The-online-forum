// src/pages/AdminQuestions.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
import "../styles/AdminQuestions.css"; // <-- Import the new CSS

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { showToast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/questions/");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      showToast("Failed to fetch questions.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (question) => {
    setSelectedQuestion(question);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedQuestion(null);
    setShowConfirmModal(false);
  };

  const deleteQuestion = async () => {
    if (!selectedQuestion) return;
    try {
      // Note: Make sure your backend uses question_id, not id
      await axiosInstance.delete(`/admin/questions/${selectedQuestion.question_id}/`);
      setQuestions((prev) => prev.filter((q) => q.question_id !== selectedQuestion.question_id));
      showToast("Question deleted successfully.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete question.", "danger");
    } finally {
      closeConfirmModal();
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">Manage Questions</h2>
            <p className="page-subtitle">Moderate and manage all questions submitted on the platform.</p>
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
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading questions...</td></tr>
            ) : questions.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No questions found.</td></tr>
            ) : (
              questions.map((q) => (
                <tr key={q.question_id}>
                  <td>{q.question_id}</td>
                  <td>
                    <Link to={`/questions/${q.question_id}`} className="question-title-link" title={q.title}>
                      {q.title.substring(0, 50)}{q.title.length > 50 && '...'}
                    </Link>
                  </td>
                  <td>
                    <div className="author-info-cell">
                      <img src={q.user?.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt={q.user?.name} />
                      <span>{q.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>{new Date(q.created_at).toLocaleDateString()}</td>
                  <td>{q.view_count}</td>
                  <td>
                    <button
                      onClick={() => openConfirmModal(q)}
                      className="action-btn delete"
                      title="Delete Question"
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
                <h5>Delete Question</h5>
                <p>Are you sure you want to delete this question? This action cannot be undone.</p>
              </div>
              <div className="modal-footer-dark confirm-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteQuestion}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminQuestions;