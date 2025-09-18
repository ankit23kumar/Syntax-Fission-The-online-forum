// src/pages/AdminVotes.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
import "../styles/AdminVotes.css";

const AdminVotes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [voteToDelete, setVoteToDelete] = useState(null);
  const { showToast } = useToast();

  const fetchVotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/votes/");
      setVotes(res.data);
    } catch (err) {
      console.error("Failed to fetch votes", err);
      showToast("Failed to fetch votes.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (vote) => {
    setVoteToDelete(vote);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setVoteToDelete(null);
    setShowConfirmModal(false);
  };

  const deleteVote = async () => {
    if (!voteToDelete) return;
    try {
      await api.delete(`/admin/votes/${voteToDelete.vote_id}/delete/`);
      setVotes((prev) => prev.filter((v) => v.vote_id !== voteToDelete.vote_id));
      showToast("Vote deleted successfully.", "success");
    } catch (err) {
      console.error("Delete failed", err);
      showToast("Failed to delete vote.", "danger");
    } finally {
      closeConfirmModal();
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const createTextPreview = (html, length) => {
    if (!html) return "-";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").substring(0, length) + '...';
  };

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">Manage Votes</h2>
            <p className="page-subtitle">Monitor and moderate all voting activity.</p>
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
              <th>User</th>
              <th>Vote Type</th>
              <th>Target Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading votes...</td></tr>
            ) : votes.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-4">No votes found.</td></tr>
            ) : (
              votes.map((vote) => (
                <tr key={vote.vote_id}>
                  <td>
                    <div className="author-info-cell">
                      <span>{vote.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`vote-type-badge ${vote.vote_type}`}>
                      {vote.vote_type === 'upvote' ? <FaThumbsUp /> : <FaThumbsDown />}
                      {vote.vote_type}
                    </span>
                  </td>
                  <td>
                    {vote.target_type === 'question' && vote.target_object ? (
                      <Link to={`/questions/${vote.target_object.question_id}`} className="question-title-link">
                        Q: {vote.target_object.title}
                      </Link>
                    ) : vote.target_type === 'answer' && vote.target_object ? (
                      <span className="text-muted">
                        A: {createTextPreview(vote.target_object.content, 50)}
                      </span>
                    ) : (
                      <span className="text-danger">Content Deleted</span>
                    )}
                  </td>
                  <td>{new Date(vote.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => openConfirmModal(vote)}
                      className="action-btn delete"
                      title="Delete Vote"
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
                <h5>Delete Vote</h5>
                <p>Are you sure you want to delete this vote? This action cannot be undone.</p>
              </div>
              <div className="modal-footer-dark confirm-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteVote}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVotes;