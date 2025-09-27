// src/components/Login.jsx
import React from "react";

export default function Login({ onLogin }) {
  const handleLogin = () => {
    // Simulate Google login (you can integrate Google OAuth here)
    onLogin("Arpita Goyal");
  };

  return (
    <div className="login-container">
      <h1>Welcome to Mock Interview</h1>
      <button className="login-btn" onClick={handleLogin}>Login with Google</button>
    </div>
  );
}
