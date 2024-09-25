import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/chatbot-form.css';

const Chatbot = () => {
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState([]); 
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const bottomRef = useRef(null); 


  useEffect(() => {

    const savedConversation = JSON.parse(localStorage.getItem('conversation')) || [];
    const savedSessionCompleted = JSON.parse(localStorage.getItem('sessionCompleted')) || false; 
  
    if (savedConversation.length > 0) {
      setConversation(savedConversation); 
    }
  
    if (savedSessionCompleted) {
      setSessionCompleted(true); 
    }
  
  
    if (!sessionId && !savedSessionCompleted) {
      axios.post('http://localhost:5000/api/v1/session/start-session')
        .then(res => {
          setSessionId(res.data.sessionId);
          localStorage.setItem('sessionId', res.data.sessionId); 
  

          const newConversation = [
            { type: 'bot', message: 'Welcome to Bolt Insight!' },
            { type: 'bot', message: res.data.currentQuestion }
          ];
          setConversation(newConversation);
          localStorage.setItem('conversation', JSON.stringify(newConversation)); 
        })
        .catch(err => {
          setErrorMessage("Error starting session.");
          console.error(err);
        });
    }
  }, [sessionId]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null); 
      }, 2000);
      return () => clearTimeout(timer); 
    }
  }, [errorMessage]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);


const handleAnswerSubmit = () => {
  if (response !== '') {
    axios.post('http://localhost:5000/api/v1/session/save-answer', {
      sessionId,
      answer: response, 
    })
    .then(res => {

      const newConversation = [
        ...conversation,
        { type: 'user', message: response }
      ];
      setConversation(newConversation); 
      localStorage.setItem('conversation', JSON.stringify(newConversation)); 
      setResponse(''); 


      if (res.data.nextQuestion) {
        const updatedConversation = [
          ...newConversation,
          { type: 'bot', message: res.data.nextQuestion }
        ];
        setConversation(updatedConversation); 
        localStorage.setItem('conversation', JSON.stringify(updatedConversation)); 
      } else {
        setSessionCompleted(true); 
        localStorage.setItem('sessionCompleted', JSON.stringify(true));
      }
    })
    .catch(err => {
      setErrorMessage("Error saving your answer. Please try again.");
      console.error(err);
    });
  } else {
    setErrorMessage("Please enter a response before submitting.");
  }
};
  return (
    <div className='chatbot'>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    <div className="chatbot-container">
      <div className="chatbot-box">
        {conversation.map((msg, index) => (
          <div 
            key={index} 
            className={msg.type === 'bot' ? 'bot-message' : 'user-message'}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} /> 
      </div>
      {!sessionCompleted ? (
        <>
          <input 
            type="text" 
            value={response} 
            onChange={(e) => setResponse(e.target.value)} 
            placeholder="Enter your answer..." 
            className="input-field"
          />
          <button onClick={handleAnswerSubmit} className="submit-button">Send</button>
        </>
      ) : (
        <h1 className='chatbot-completed'>Thank you for completing the survey!</h1> 
      )}
    </div>
    </div>
  );
};

export default Chatbot;
