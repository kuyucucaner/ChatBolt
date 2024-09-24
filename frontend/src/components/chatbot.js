import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:5000/start-session')
    .then(res => {
      setSessionId(res.data.sessionId);
      axios.get('http://localhost:5000/generate-question')
        .then(response => setCurrentQuestion(response.data.question))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, []);

  const handleAnswerSubmit = () => {
    if (response !== '') {
      axios.post('http://localhost:5000/save-answer', {
        sessionId,
        answer: response,
      })
        .then(res => {
        if (res.data.nextQuestion) {
          axios.get('http://localhost:5000/generate-question')
            .then(response => setCurrentQuestion(response.data.question))
            .catch(err => console.log(err));
          setResponse('');
        } else {
          setSessionCompleted(true);
        }
      })
      .catch(err => console.log(err));
    }
  };

  return (
    <div>
      {!sessionCompleted ? (
        <>
          <h1>{currentQuestion}</h1>
          <input 
            type="text" 
            value={response} 
            onChange={(e) => setResponse(e.target.value)} 
          />
          <button onClick={handleAnswerSubmit}>Submit</button>
        </>
      ) : (
        <h1>Chatbot completed. Thank you for your responses!</h1>
      )}
    </div>
  );
};

export default Chatbot;
