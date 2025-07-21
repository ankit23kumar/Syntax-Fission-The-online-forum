import { useEffect, useState } from 'react';
import { getActivity } from '../../services/userService';
import '../../styles/UserDashboard.css';

const Activity = () => {
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getActivity().then(res => setActivity(res.data));
  }, []);

  return activity ? (
    <div className="card p-4 shadow-sm border-0">
      <h4 className="fw-bold">Activity</h4>
      <div className="d-flex justify-content-evenly my-3">
        <div className="text-center">
          <h5 className="fw-bold">{activity.total_questions}</h5>
          <p>Questions</p>
        </div>
        <div className="text-center">
          <h5 className="fw-bold">{activity.total_answers}</h5>
          <p>Answers</p>
        </div>
      </div>

      <div>
        <h5 className="mt-4 fw-medium">Your asked questions</h5>
        {activity.questions.map((q, i) => (
          <p key={i}><a href={`/question/${q.id}`} className="text-primary">{q.title}</a></p>
        ))}
      </div>

      <div>
        <h5 className="mt-4 fw-medium">Answered Questions</h5>
        {activity.answers.map((a, i) => (
          <p key={i}><a href={`/question/${a.question_id}`} className="text-primary">{a.question_title}</a></p>
        ))}
      </div>
    </div>
  ) : <p>Loading activity...</p>;
};

export default Activity;
