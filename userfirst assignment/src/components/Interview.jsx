// src/components/Interview.jsx
import React, { useEffect, useState, useRef } from "react";
import { speakText, listenOnce } from "../utils/speech";
import { chatCompletion } from "../api/openai";

export default function Interview({ candidateName, onEnd }) {
  const [conversation, setConversation] = useState([]);
  const [question, setQuestion] = useState("Tell me about yourself.");
  const [isWaiting, setIsWaiting] = useState(false);
  const inactivityRef = useRef(null);
  const totalTime = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      speakText("Are you there?");
    }, 30 * 1000);
  };

  // Ask next question
  const askNext = async (userAnswer) => {
    setIsWaiting(true);
    const newConv = [...conversation, { role: "user", content: userAnswer }];
    setConversation(newConv);

    const aiResponse = await chatCompletion([
      { role: "system", content: "You are a friendly HR interviewer. Ask relevant follow-up questions." },
      ...newConv.map(c => ({ role: c.role, content: c.content }))
    ]);

    setConversation([...newConv, { role: "assistant", content: aiResponse }]);
    setQuestion(aiResponse);
    speakText(aiResponse);
    setIsWaiting(false);
    resetInactivityTimer();
  };

  // Handle voice answer
  const handleAnswer = async () => {
    if (isWaiting) return;
    setIsWaiting(true);
    const answer = await listenOnce({ timeout: 12 });
    if (!answer) {
      speakText("Are you there?");
      const secondAnswer = await listenOnce({ timeout: 10 });
      if (!secondAnswer) return handleEndInterview();
      askNext(secondAnswer);
    } else {
      askNext(answer);
    }
  };

  // End interview
  const handleEndInterview = async () => {
    setIsWaiting(true);
    speakText("Ending interview and generating feedback.");
    const feedback = await chatCompletion([
      { role: "system", content: "You are an HR expert. Evaluate candidate answers and provide feedback + score out of 10." },
      ...conversation
    ]);
    onEnd(feedback);
  };

  useEffect(() => {
    speakText(question);
    resetInactivityTimer();
  }, []);

  return (
    <div className="interview-container">
      <h2>Interview in Progress: {candidateName}</h2>
      <div className="timer-box">Time left: {Math.floor(timeLeft/60)}:{timeLeft%60}</div>
      <div className="question-box">{question}</div>
      <button className="answer-btn" onClick={handleAnswer} disabled={isWaiting}>Speak Answer</button>
      <button className="end-btn" onClick={handleEndInterview} disabled={isWaiting}>End Interview</button>
      <div className="conversation">
        {conversation.map((c, i) => (
          <p key={i} className={c.role}>
            <strong>{c.role}:</strong> {c.content}
          </p>
        ))}
      </div>
    </div>
  );
}
