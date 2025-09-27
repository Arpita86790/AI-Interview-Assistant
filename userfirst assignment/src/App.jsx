// src/App.jsx
import React, { useState } from "react";
import Login from "./components/Login";
import Interview from "./components/Interview";
import Feedback from "./components/Feedback";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState(null);

  if (!user) return <Login onLogin={setUser} />;
  if (feedback) return <Feedback feedback={feedback} />;

  return <Interview candidateName={user} onEnd={setFeedback} />;
}

export default App;
