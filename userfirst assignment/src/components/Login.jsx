
import React from "react";

export default function Login({ onLogin }) {
  const handleLogin = () => {
    onLogin("Arpita Goyal");
  };

  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
    fontFamily: 'Roboto, sans-serif',
    
    width: '100vw', 
  };

  
  const loginBoxStyle = {
    backgroundColor: '#ffffff',
    padding: '30px 20px', 
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    
    
    maxWidth: '400px', 
    width: '90%',     
    
    margin: '20px', 
  };

  
  const headingStyle = {
    color: '#333',
    marginBottom: '30px',
    fontSize: 'min(5vw, 2rem)', 
    fontWeight: '700',
  };

  
  const buttonStyle = {
    background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    border: 'none',
    color: 'white',
    width: '100%', 
    
    padding: '15px 0',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={headingStyle}>Welcome to Mock Interview 👋</h1>
        <button 
          style={buttonStyle} 
          onClick={handleLogin}
          className="login-btn" 
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}