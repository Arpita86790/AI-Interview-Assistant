// src/components/Feedback.jsx
import React from "react";

export default function Feedback({ feedback }) {
  return (
    <div className="feedback-container">
      <h2>Interview Feedback</h2>
      <p>{feedback}</p>
    </div>
  );
}
