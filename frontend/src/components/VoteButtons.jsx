// components/VoteButtons.jsx
import React from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const VoteButtons = ({ targetType, targetId, upvotes, downvotes, onVote }) => {
  const handleVote = (type) => {
    onVote({ target_type: targetType, target_id: targetId, vote_type: type });
  };

  return (
    <div className="d-flex gap-3 align-items-center">
      <FaThumbsUp className="vote-icon" onClick={() => handleVote("upvote")} />
      <span>{upvotes}</span>
      <FaThumbsDown className="vote-icon" onClick={() => handleVote("downvote")} />
      <span>{downvotes}</span>
    </div>
  );
};

export default VoteButtons;
