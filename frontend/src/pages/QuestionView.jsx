// src/pages/QuestionView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuillEditor from "../components/QuillEditor";
import VoteButtons from "../components/VoteButtons";
import { FaEdit, FaTrash } from "react-icons/fa";
import DOMPurify from "dompurify";
import {
  getQuestionById,
  submitAnswer,
  incrementViewCount,
  updateQuestion,
  submitVote,
  deleteAnswer,
  deleteQuestion,
  updateAnswer,
} from "../services/qaService";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/QuestionView.css";

const QuestionView = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // State for Edit Question Modal
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedTags, setEditedTags] = useState("");

  // State for Edit Answer Modal
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState("");

  // State for Custom Deletion Modals
  const [showDeleteQuestionConfirm, setShowDeleteQuestionConfirm] =
    useState(false);
  const [showDeleteAnswerConfirm, setShowDeleteAnswerConfirm] = useState(null);

  // Check if any modal is open
  const isModalOpen = editing || editingAnswerId || showDeleteQuestionConfirm || showDeleteAnswerConfirm;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(questionId);
        setQuestion(res.data);
        incrementViewCount(questionId).catch(console.error);
      } catch (err) {
        console.error("Failed to fetch question:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || answerText === "<p><br></p>") return;

    setSubmitting(true);
    try {
      const res = await submitAnswer(questionId, answerText);
      setAnswerText("");
      setQuestion((prev) => ({
        ...prev,
        answers: [...prev.answers, res.data],
      }));
    } catch (err) {
      console.error(
        "Failed to submit answer:",
        err.response?.data || err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async ({ target_type, target_id, vote_type }) => {
    try {
      await submitVote({ target_type, target_id, vote_type });
      const updated = await getQuestionById(questionId);
      setQuestion(updated.data);
    } catch (err) {
      console.error("Failed to vote:", err.response?.data || err.message);
    }
  };

  const startEditing = () => {
    setEditedTitle(question.title);
    setEditedContent(question.content);
    setEditedTags(question.tags.map((tag) => tag.tag_name).join(" "));
    setEditing(true);
  };

  const handleUpdateQuestion = async () => {
    try {
      const parsedTags = editedTags
        .trim()
        .split(/[\s,;#]+/)
        .filter(Boolean);

      const payload = {
        title: editedTitle,
        content: editedContent,
        tag_names: parsedTags,
      };
      await updateQuestion(questionId, payload);
      
      // Refresh the entire question data including answers
      const updatedQuestion = await getQuestionById(questionId);
      setQuestion(updatedQuestion.data);
      
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  const handleDeleteQuestion = async () => {
    setShowDeleteQuestionConfirm(false);
    try {
      await deleteQuestion(questionId);
      navigate("/new-questions");
    } catch (err) {
      console.error("Question deletion failed:", err);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    setShowDeleteAnswerConfirm(null);
    try {
      await deleteAnswer(answerId);
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.filter((a) => a.answer_id !== answerId),
      }));
    } catch (err) {
      console.error("Answer deletion failed:", err);
    }
  };

  const handleEditAnswer = (ans) => {
    setEditingAnswerId(ans.answer_id);
    setEditedAnswerContent(ans.content);
  };

  const handleUpdateAnswer = async () => {
    try {
      await updateAnswer(editingAnswerId, { content: editedAnswerContent });
      const updated = await getQuestionById(questionId);
      setQuestion(updated.data);
      setEditingAnswerId(null);
    } catch (err) {
      console.error("Answer update failed:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-info" role="status" />
      </div>
    );
  }

  if (!question) {
    return <p className="p-4 text-danger">Question not found.</p>;
  }

  const sanitizedQuestionContent = DOMPurify.sanitize(question.content);

  return (
    <>
      <div className={`question-view-page d-flex ${isModalOpen ? 'modal-open' : ''}`}>
        <main className="flex-grow-1 p-4">
          {/* Question Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 rounded shadow-sm mb-4"
          >
            <div className="d-flex justify-content-between align-items-start">
              <h3 className="fw-bold mb-0">{question.title}</h3>
              {user && user.user_id === question.user.user_id && (
                <div className="d-flex gap-3">
                  <FaEdit
                    className="text-primary cursor-pointer"
                    size={18}
                    title="Edit Question"
                    onClick={startEditing}
                  />
                  <FaTrash
                    className="text-danger cursor-pointer"
                    size={18}
                    title="Delete Question"
                    onClick={() => setShowDeleteQuestionConfirm(true)}
                  />
                </div>
              )}
            </div>

            <div className="text-muted my-2 d-flex justify-content-between">
              <div>
                Asked by <strong>{question.user.name}</strong> on{" "}
                {new Date(question.created_at).toLocaleDateString()}
              </div>
              <div>
                Viewed <strong>{question.view_count}</strong> times
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: sanitizedQuestionContent }}
              className="mt-3"
            />

            <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
              {question.tags &&
                question.tags.map((tag, idx) => (
                  <motion.span 
                    key={idx} 
                    className="badge bg-info text-dark"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.1 }}
                  >
                    {tag.tag_name}
                  </motion.span>
                ))}
            </div>

            <VoteButtons
              targetType="question"
              targetId={question.question_id}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              onVote={handleVote}
            />
          </motion.div>

          {/* Answers Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="answers-section mb-5"
          >
            <h5 className="fw-bold mb-3">
              Answers ({question.answers ? question.answers.length : 0})
            </h5>
            <AnimatePresence>
              {question.answers &&
                question.answers.map((ans, index) => {
                  const sanitizedAnswerContent = DOMPurify.sanitize(ans.content);
                  return (
                    <motion.div
                      key={ans.answer_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-light rounded p-3 mb-3"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: sanitizedAnswerContent }}
                      />
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">
                          Answered by <strong>{ans.user.name}</strong> on{" "}
                          {new Date(ans.created_at).toLocaleDateString()}
                        </small>
                        {user && user.user_id === ans.user.user_id && (
                          <div className="d-flex gap-2">
                            <FaEdit
                              className="text-primary cursor-pointer"
                              title="Edit Answer"
                              onClick={() => handleEditAnswer(ans)}
                            />
                            <FaTrash
                              className="text-danger cursor-pointer"
                              title="Delete Answer"
                              onClick={() =>
                                setShowDeleteAnswerConfirm(ans.answer_id)
                              }
                            />
                          </div>
                        )}
                      </div>
                      <VoteButtons
                        targetType="answer"
                        targetId={ans.answer_id}
                        upvotes={ans.upvotes}
                        downvotes={ans.downvotes}
                        onVote={handleVote}
                      />
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>

          {/* Answer Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h5 className="fw-bold mb-3">Your Answer</h5>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-3">
                <QuillEditor
                  value={answerText}
                  onChange={setAnswerText}
                  placeholder="Write your answer here..."
                />
              </div>
              <motion.button
                type="submit"
                className="btn btn-info text-white"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                {submitting ? "Posting..." : "Post Answer"}
              </motion.button>
            </form>
          </motion.div>
        </main>
      </div>

      {/* --- MODALS SECTION --- */}

      <AnimatePresence>
        {/* Question Edit Modal */}
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.10 }}
            className="modal show d-block"
            tabIndex="-1"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.10 }}
              className="modal-dialog modal-lg modal-dialog-centered"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Question</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditing(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <label className="form-label fw-semibold">Content</label>
                  <QuillEditor
                    value={editedContent}
                    onChange={setEditedContent}
                  />
                  <label className="form-label fw-semibold mt-3">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editedTags}
                    onChange={(e) => setEditedTags(e.target.value)}
                    placeholder="e.g., python django react"
                  />
                  <div className="form-text">Separate tags with a space.</div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateQuestion}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Answer Edit Modal */}
        {editingAnswerId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.10 }}
            className="modal show d-block"
            tabIndex="-1"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.10 }}
              className="modal-dialog modal-lg modal-dialog-centered"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Answer</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingAnswerId(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <QuillEditor
                    value={editedAnswerContent}
                    onChange={setEditedAnswerContent}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingAnswerId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateAnswer}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Custom Question Deletion Modal */}
        {showDeleteQuestionConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.10 }}
            className="modal show d-block confirm-modal-backdrop"
            tabIndex="-1"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.10 }}
              className="modal-dialog modal-sm modal-dialog-centered"
            >
              <div className="modal-content confirm-modal-content">
                <div className="modal-body text-center">
                  <h5 className="fw-bold">
                    Are you sure you want to delete this question?
                  </h5>
                </div>
                <div className="modal-footer justify-content-center">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteQuestionConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteQuestion}
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Custom Answer Deletion Modal */}
        {showDeleteAnswerConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.10 }}
            className="modal show d-block confirm-modal-backdrop"
            tabIndex="-1"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.10 }}
              className="modal-dialog modal-sm modal-dialog-centered"
            >
              <div className="modal-content confirm-modal-content">
                <div className="modal-body text-center">
                  <h5 className="fw-bold">
                    Are you sure you want to delete this answer?
                  </h5>
                </div>
                <div className="modal-footer justify-content-center">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteAnswerConfirm(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAnswer(showDeleteAnswerConfirm)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionView;