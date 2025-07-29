import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuillEditor from "../components/QuillEditor"; // Custom component
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import {
  getQuestionById,
  submitAnswer,
  incrementViewCount,
} from "../services/qaService";
import "../styles/QuestionView.css";

const QuestionView = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionById(questionId);
        setQuestion(res.data);
        await incrementViewCount(questionId);
      } catch (err) {
        console.error(
          "Failed to fetch question:",
          err.response?.data || err.message
        );
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

  // if (loading) return <p className="p-4">Loading question...</p>;
  if (loading)
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-info" role="status" />
      </div>
    );

  if (!question) return <p className="p-4 text-danger">Question not found.</p>;

  return (
    <>
      <Navbar />
      <div className="question-view-page d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h3 className="fw-bold">{question.title}</h3>
            <div className="text-muted mb-2 d-flex justify-content-between">
              <div>
                Asked by <strong>{question.user.name}</strong> on{" "}
                {new Date(question.created_at).toLocaleDateString()}
              </div>
              <div>
                Viewed <strong>002</strong> times
              </div>
            </div>
            <p className="mt-3">{question.content}</p>
            <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
              {question.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-info text-dark">
                  {tag.tag_name}
                </span>
              ))}
            </div>
            <div className="d-flex gap-3 align-items-center">
              <FaThumbsUp className="vote-icon" /> <span>0</span>
              <FaThumbsDown className="vote-icon" /> <span>0</span>
            </div>
          </div>

          <div className="answers-section mb-5">
            <h5 className="fw-bold mb-3">
              Answers ({question.answers.length})
            </h5>
            {question.answers.map((ans) => (
              <div key={ans.id} className="bg-light rounded p-3 mb-3">
                <div dangerouslySetInnerHTML={{ __html: ans.content }} />
                <small className="text-muted d-block mt-2">
                  Answered by <strong>{ans.user.name}</strong> on{" "}
                  {new Date(ans.created_at).toLocaleDateString()}
                </small>
                <div className="d-flex gap-3 align-items-center mt-2">
                  <FaThumbsUp className="vote-icon" /> <span>0</span>
                  <FaThumbsDown className="vote-icon" /> <span>0</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h5 className="fw-bold mb-3">Your Answer</h5>
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-3">
                <QuillEditor value={answerText} onChange={setAnswerText} placeholder="Write your answer here..."/>
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
      <Footer />
    </>
  );
};

export default QuestionView;
