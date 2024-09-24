import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [response, setResponse] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // İlk soruları backend'den alalım
    axios.get('http://localhost:5000/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAnswerSubmit = () => {
    if (response !== '') {
      const newAnswers = [...answers, response];
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
      setResponse('');

      // Cevapları backend'e gönder
      axios.post('http://localhost:5000/save-answer', {
        question: questions[currentQuestion],
        answer: response,
      });
    }
  };

  return (
    <div>
      {questions.length > 0 && currentQuestion < questions.length ? (
        <>
          <h1>{questions[currentQuestion]}</h1>
          <input 
            type="text" 
            value={response} 
            onChange={(e) => setResponse(e.target.value)} 
          />
          <button onClick={handleAnswerSubmit}>Submit</button>
        </>
      ) : (
        <h1>Chatbot completed</h1>
      )}
    </div>
  );
};

export default Chatbot;
