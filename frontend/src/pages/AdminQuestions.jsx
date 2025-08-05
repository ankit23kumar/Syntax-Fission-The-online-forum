import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminUsers.css"; // reuse styling

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await axiosInstance.get("/admin/questions/");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axiosInstance.delete(`/admin/questions/${id}/`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete question.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="admin-page">
      <h2>All Questions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
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
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.title}</td>
                  <td>{q.user?.name || "Unknown"}</td>
                  <td>{new Date(q.created_at).toLocaleString()}</td>
                  <td>{q.view_count}</td>
                  <td>
                    <button
                      onClick={() => deleteQuestion(q.question_id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
