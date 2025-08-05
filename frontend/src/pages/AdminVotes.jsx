import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminUsers.css";

const AdminVotes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVotes = async () => {
    try {
      const res = await api.get("/admin/votes/");
      setVotes(res.data);
    } catch (err) {
      console.error("Failed to fetch votes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <div className="admin-page">
      <h2>All Votes</h2>
      {loading ? (
        <p>Loading votes...</p>
      ) : votes.length === 0 ? (
        <p>No votes found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Vote Type</th>
                <th>Question</th>
                <th>Answer</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote) => (
                <tr key={vote.id}>
                  <td>{vote.id}</td>
                  <td>{vote.user?.name || "Unknown"}</td>
                  <td>{vote.vote_type}</td>
                  <td>{vote.question ? vote.question.title : "-"}</td>
                  <td>{vote.answer ? vote.answer.body?.slice(0, 30) + "..." : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVotes;
