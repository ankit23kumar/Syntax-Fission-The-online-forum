import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminUsers.css"; // reuse styles

const AdminAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = async () => {
    try {
      const res = await api.get("/admin/answers/");
      setAnswers(res.data);
    } catch (err) {
      console.error("Failed to fetch answers", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnswer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;
    try {
      await api.delete(`/admin/answers/${id}/`);
      setAnswers((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <div className="admin-page">
      <h2>All Answers</h2>
      {loading ? (
        <p>Loading answers...</p>
      ) : answers.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Answer</th>
                <th>User</th>
                <th>Question</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.body.slice(0, 100)}...</td>
                  <td>{a.user?.name || "Unknown"}</td>
                  <td>{a.question?.title || "Deleted Question"}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => deleteAnswer(a.id)}
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

export default AdminAnswers;
