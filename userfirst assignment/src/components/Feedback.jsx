
import React from "react";

export default function Feedback({ feedback }) {
  

 
  const colors = {
    primary: '#4facfe',
    background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', 
    card: '#FFFFFF',
    textDark: '#333333',
    textLight: '#666666',
    shadow: 'rgba(0, 0, 0, 0.15)', 
  };

  
  const feedbackContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 'min(5vw, 40px)',
    background: colors.background,
    fontFamily: 'Roboto, sans-serif',
    width: '100vw',
    boxSizing: 'border-box',
  };

  
  const feedbackCardStyle = {
    backgroundColor: colors.card,
    padding: 'min(7vw, 40px)',
    borderRadius: '15px',
    boxShadow: `0 15px 40px ${colors.shadow}`, 
    textAlign: 'left',
    maxWidth: '800px', 
    width: '95%',
    
    margin: '20px auto', 
  };

  
  const headerStyle = {
    color: colors.primary,
    fontSize: 'min(6vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '25px',
    textAlign: 'center',
    borderBottom: `2px solid ${colors.primary}33`, 
    paddingBottom: '15px',
  };

  
  const contentAreaStyle = {
    fontSize: 'min(4vw, 1.1rem)',
    color: colors.textDark,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap', 
    maxHeight: '60vh', 
    overflowY: 'auto',
    paddingRight: '10px', 
  };

 
  const paragraphStyle = {
      marginBottom: '15px',
   
  };

  

  return (
    <div style={feedbackContainerStyle}>
      <div style={feedbackCardStyle}>
        <h2 style={headerStyle}>Interview Feedback Summary 📝</h2>
        <div style={contentAreaStyle}>
            <p style={paragraphStyle}>{feedback}</p>
        </div>
      </div>
    </div>
  );
}