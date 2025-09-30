
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
  
  
  const [speakBtnHover, setSpeakBtnHover] = useState(false);
  const [endBtnHover, setEndBtnHover] = useState(false);

  
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

  const resetInactivityTimer = () => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      speakText("Are you there?");
    }, 30 * 1000);
  };

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
  

  const colors = {
    primary: '#4facfe', 
    secondary: '#00f2fe', 
    background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', 
    card: '#FFFFFF',
    textDark: '#2C3E50', 
    textSubtle: '#7F8C8D', 
    shadowStrong: 'rgba(0, 0, 0, 0.2)', 
    shadowSoft: 'rgba(0, 0, 0, 0.08)',
  };

  
  const interviewContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '40px 20px', 
    background: colors.background,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    width: '100vw',
    boxSizing: 'border-box',
  };

  
  const mainContentWrapper = {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px', 
    width: 'min(95vw, 900px)',
  };

  
  const headerStyle = {
    color: colors.textDark,
    fontSize: 'min(6vw, 2.5rem)',
    fontWeight: '800', 
    textAlign: 'center',
    marginBottom: '15px',
  };

  
  const infoBarWrapper = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    padding: '0 5px',
  };

  const infoCardStyle = {
    padding: '15px 25px',
    backgroundColor: colors.card,
    borderRadius: '10px',
    boxShadow: `0 4px 15px ${colors.shadowSoft}`,
    fontSize: 'min(4vw, 1.1rem)',
    flex: '1 1 200px', 
    textAlign: 'center',
    borderBottom: `3px solid ${colors.primary}99`,
  };

  
  const questionBoxStyle = {
    padding: '35px',
    backgroundColor: colors.card,
    borderRadius: '15px',
    
    boxShadow: `0 10px 30px ${colors.shadowStrong}`, 
    textAlign: 'left',
    fontSize: 'min(4.5vw, 1.4rem)',
    fontWeight: '500',
    lineHeight: '1.6',
    color: colors.textDark,
    borderLeft: `8px solid ${colors.primary}`, 
  };
  
  
  const buttonGroupStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const buttonBase = {
    padding: '16px 30px',
    borderRadius: '30px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: 'min(4vw, 1rem)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)', 
    flex: '1 1 250px',
    maxWidth: '350px',
    boxShadow: `0 4px 10px ${colors.shadowSoft}`,
  };

  
  const speakButtonStyle = {
    ...buttonBase,
    background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
    color: colors.card,
    
    transform: speakBtnHover ? 'translateY(-3px)' : 'translateY(0)',
    boxShadow: speakBtnHover 
      ? `0 10px 20px ${colors.primary}66` 
      : `0 4px 10px ${colors.shadowSoft}`,
  };

  
  const endButtonStyle = {
    ...buttonBase,
    backgroundColor: '#E74C3C',
    color: colors.card,
    
    transform: endBtnHover ? 'translateY(-3px)' : 'translateY(0)',
    boxShadow: endBtnHover 
      ? '0 10px 20px rgba(231, 76, 60, 0.6)'
      : `0 4px 10px ${colors.shadowSoft}`,
  };

  const disabledOverlay = isWaiting ? { opacity: 0.6, cursor: 'not-allowed', transform: 'translateY(0)', boxShadow: 'none' } : {};

  
  const conversationContainerStyle = {
    padding: '20px',
    backgroundColor: colors.card,
    borderRadius: '15px',
    boxShadow: `0 4px 15px ${colors.shadowSoft}`,
    maxHeight: '40vh',
    overflowY: 'auto',
    border: `1px solid ${colors.secondary}33`,
  };

  const messageBaseStyle = {
    padding: '12px 18px',
    borderRadius: '10px',
    marginBottom: '10px',
    lineHeight: '1.4',
    fontSize: 'min(3.5vw, 0.95rem)',
  };

  const assistantStyle = {
    ...messageBaseStyle,
    backgroundColor: '#ECF0F1', 
    borderLeft: `4px solid ${colors.primary}`,
    textAlign: 'left',
  };

  const userStyle = {
    ...messageBaseStyle,
    backgroundColor: '#DCDFE2', 
    borderRight: `4px solid ${colors.secondary}`,
    textAlign: 'right',
    marginLeft: 'auto', 
    width: 'fit-content',
    maxWidth: '85%',
  };
  

  return (
    <div style={interviewContainerStyle}>
      <h2 style={headerStyle}>
        Mock Interview: <span style={{ color: colors.primary }}>{candidateName}</span>
      </h2>
      
      <div style={mainContentWrapper}>
        
      
        <div style={infoBarWrapper}>
          
          <div style={infoCardStyle}>
            <span style={{ fontSize: '0.8rem', color: colors.textSubtle, display: 'block' }}>TIME REMAINING</span>
            <span style={{ 
              fontWeight: '800', 
              color: timeLeft < 120 ? '#E74C3C' : colors.textDark,
              fontSize: '1.4rem'
            }}>
              {Math.floor(timeLeft / 60)}:{('0' + timeLeft % 60).slice(-2)}
            </span>
          </div>
          
        
          <div style={infoCardStyle}>
            <span style={{ fontSize: '0.8rem', color: colors.textSubtle, display: 'block' }}>CURRENT STATUS</span>
            <span style={{
                fontWeight: '800',
                color: isWaiting ? colors.primary : colors.textDark,
                fontSize: '1.4rem'
            }}>
              {isWaiting ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
        
        {/* QUESTION BOX */}
        <div style={questionBoxStyle}>
          <strong style={{ color: colors.primary, display: 'block', marginBottom: '10px' }}>Interviewer:</strong>
          {question}
        </div>
        
        {/* ACTION BUTTONS */}
        <div style={buttonGroupStyle}>
          <button 
            className="answer-btn"
            style={{ ...speakButtonStyle, ...disabledOverlay }} 
            onClick={handleAnswer} 
            disabled={isWaiting}
            onMouseEnter={() => setSpeakBtnHover(true)}
            onMouseLeave={() => setSpeakBtnHover(false)}
          >
            {isWaiting ? 'PROCESSING ANSWER...' : 'SPEAK ANSWER'}
          </button>
          <button 
            className="end-btn"
            style={{ ...endButtonStyle, ...disabledOverlay }} 
            onClick={handleEndInterview} 
            disabled={isWaiting}
            onMouseEnter={() => setEndBtnHover(true)}
            onMouseLeave={() => setEndBtnHover(false)}
          >
            END INTERVIEW
          </button>
        </div>
        
        {/* CONVERSATION LOG */}
        <div style={conversationContainerStyle}>
          <h3 style={{ color: colors.textLight, fontSize: '1.1rem', marginBottom: '15px', borderBottom: `1px solid #eee`, paddingBottom: '10px' }}>
            Conversation Log (Scrollable)
          </h3>
          {conversation.map((c, i) => (
            <p 
              key={i} 
              style={c.role === 'assistant' ? assistantStyle : userStyle}
            >
              <strong style={{ textTransform: 'capitalize', color: c.role === 'assistant' ? colors.primary : colors.textDark }}>{c.role}:</strong> {c.content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}