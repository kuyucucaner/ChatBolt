const SessionModel = require('../models/session-model');
const { v4: uuidv4 } = require('uuid');


exports.startSession = async (req, res) => {
  const sessionId = uuidv4();
  const questions = [
    "What is your favorite breed of cat, and why?",
    "How do you think cats communicate with their owners?",
    "Have you ever owned a cat? If so, what was their name and personality like?",
    "Why do you think cats love to sleep in small, cozy places?",
    "What’s the funniest or strangest behavior you’ve ever seen a cat do?",
    "Do you prefer cats or kittens, and what’s the reason for your preference?",
    "Why do you think cats are known for being independent animals?",
    "How do you think cats manage to land on their feet when they fall?",
    "What’s your favorite fact or myth about cats?",
    "How would you describe the relationship between humans and cats in three words?",
  ];

  try {
    const newSession = new SessionModel({
      sessionId,
      questions,
      answers: [],
      currentQuestionIndex: 0,  
    });
    await newSession.save();
    res.status(201).json({ sessionId, currentQuestion: questions[0] });
  } catch (error) {
    console.error('Error starting session:', error.message);
    res.status(500).json({ message: 'Error starting session' });
  }
};

exports.saveAnswer = async (req, res) => {
  const { sessionId, answer } = req.body;

  try {
    const session = await SessionModel.findOne({ sessionId });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const currentQuestion = session.questions[session.currentQuestionIndex];
    session.answers.push({ question: currentQuestion, answer });

    session.currentQuestionIndex += 1; 


    if (session.currentQuestionIndex < session.questions.length) {
      await session.save();
      res.json({ nextQuestion: session.questions[session.currentQuestionIndex] });
    } else {
      session.endedAt = Date.now();
      await session.save();
      res.json({ message: 'Session completed' });
    }
  } catch (error) {
    console.error('Error saving answer:', error.message);
    res.status(500).json({ message: 'Error saving answer' });
  }
};
