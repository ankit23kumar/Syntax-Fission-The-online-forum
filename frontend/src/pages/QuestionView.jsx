import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuillEditor from "../components/QuillEditor";
import VoteButtons from "../components/VoteButtons";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import "../styles/QuestionView.css";

const QuestionView = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(questionId);
        setQuestion(res.data);
        await incrementViewCount(questionId);
      } catch (err) {
        console.error("Failed to fetch question:", err.response?.data || err.message);
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
      console.error("Failed to submit answer:", err.response?.data || err.message);
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
    setEditing(true);
  };

  const handleUpdateQuestion = async () => {
    try {
      const payload = {
        title: editedTitle,
        content: editedContent,
      };
      const res = await updateQuestion(questionId, payload);
      setQuestion((prev) => ({
        ...prev,
        title: res.data.title,
        content: res.data.content,
      }));
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  const handleDeleteQuestion = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this question?");
    if (!confirmed) return;

    try {
      await deleteQuestion(questionId);
      navigate("/new-questions");
    } catch (err) {
      console.error("Question deletion failed:", err.response?.data || err.message);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const confirmed = window.confirm("Delete this answer?");
    if (!confirmed) return;

    try {
      await deleteAnswer(answerId);
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.filter((a) => a.answer_id !== answerId),
      }));
    } catch (err) {
      console.error("Answer deletion failed:", err.response?.data || err.message);
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

  return (
    <>
      <div className="question-view-page d-flex">
        <main className="flex-grow-1 p-4">
          {/* Question Section */}
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-start">
              <h3 className="fw-bold mb-0">{question.title}</h3>
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
                  onClick={handleDeleteQuestion}
                />
              </div>
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
              dangerouslySetInnerHTML={{ __html: question.content }}
              className="mt-3"
            />

            <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
              {question.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-info text-dark">
                  {tag.tag_name}
                </span>
              ))}
            </div>

            <VoteButtons
              targetType="question"
              targetId={question.question_id}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              onVote={handleVote}
            />
          </div>

          {/* Answers Section */}
          <div className="answers-section mb-5">
            <h5 className="fw-bold mb-3">Answers ({question.answers.length})</h5>
            {question.answers.map((ans) => (
              <div key={ans.answer_id} className="bg-light rounded p-3 mb-3">
                <div dangerouslySetInnerHTML={{ __html: ans.content }} />
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small className="text-muted">
                    Answered by <strong>{ans.user.name}</strong> on{" "}
                    {new Date(ans.created_at).toLocaleDateString()}
                  </small>
                  <div className="d-flex gap-2">
                    <FaEdit
                      className="text-primary cursor-pointer"
                      title="Edit Answer"
                      onClick={() => handleEditAnswer(ans)}
                    />
                    <FaTrash
                      className="text-danger cursor-pointer"
                      title="Delete Answer"
                      onClick={() => handleDeleteAnswer(ans.answer_id)}
                    />
                  </div>
                </div>
                <VoteButtons
                  targetType="answer"
                  targetId={ans.answer_id}
                  upvotes={ans.upvotes}
                  downvotes={ans.downvotes}
                  onVote={handleVote}
                />
              </div>
            ))}
          </div>

          {/* Answer Form */}
          <div>
            <h5 className="fw-bold mb-3">Your Answer</h5>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-3">
                <QuillEditor
                  value={answerText}
                  onChange={setAnswerText}
                  placeholder="Write your answer here..."
                />
              </div>
              <button
                type="submit"
                className="btn btn-info text-white"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post Answer"}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Question Edit Modal */}
      {editing && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-info text-white"
                  onClick={handleUpdateQuestion}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Answer Edit Modal */}
      {editingAnswerId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                  className="btn btn-info text-white"
                  onClick={handleUpdateAnswer}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionView;
