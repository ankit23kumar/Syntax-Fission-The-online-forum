// src/components/Dashboard/Activity.jsx

import { useEffect, useState } from 'react';
import { getActivity } from '../../services/userService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Activity = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivity()
      .then(res => setActivity(res.data))
      .catch(err => console.error("Failed to fetch activity:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading activity...</p>;
  if (!activity) return <p>Could not load activity.</p>;

  return (
    <motion.div
      className="card p-4 shadow-sm activity-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="fw-bold mb-4">Your Activity</h4>

      {/* --- Stats Overview Section --- */}
      <div className="stats-overview">
        <div className="stat-box">
          <h3>{activity.total_questions}</h3>
          <span>Questions</span>
        </div>
        <div className="stat-box">
          <h3>{activity.total_answers}</h3>
          <span>Answers</span>
        </div>
        <div className="stat-box">
          <h3>{activity.total_views}</h3>
          <span>Total Views</span>
        </div>
        <div className="stat-box">
          <h3>{activity.total_reputation}</h3>
          <span>Reputation</span>
        </div>
      </div>

      {/* --- Questions List Section --- */}
      <div className="activity-list-section">
        <h5 className="fw-semibold">Your Questions</h5>
        <div className="activity-list">
          {activity.questions.length > 0 ? (
            activity.questions.map((q) => (
              <Link to={`/questions/${q.question_id}`} key={q.question_id} className="activity-item">
                {q.title}
              </Link>
            ))
          ) : (
            <p className="empty-message">You haven't asked any questions yet.</p>
          )}
        </div>
      </div>

      {/* --- Answers List Section --- */}
      <div className="activity-list-section">
        <h5 className="fw-semibold">Your Answers</h5>
        <div className="activity-list">
          {activity.answers.length > 0 ? (
            activity.answers.map((a) => (
              <Link to={`/questions/${a.question_id}`} key={a.answer_id} className="activity-item">
                Answer to: {a.question_title}
              </Link>
            ))
          ) : (
            <p className="empty-message">You haven't answered any questions yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Activity;