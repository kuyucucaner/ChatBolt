const OpenAI = require('openai');
const SessionModel = require('../models/session-model');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

//Billing issues!
//[0] Error generating question: 429 You exceeded your current quota, please check your plan
// and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.
//probably it would work

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateOpenAIQuestion() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Generate a question about cats." }],
      max_tokens: 30,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating question:', error.message);
    throw new Error('Failed to generate question');
  }
}

exports.startSession = async (req, res) => {
  const sessionId = uuidv4();

  try {
    const questions = [];

    for (let i = 0; i < 11; i++) {  
      const question = await generateOpenAIQuestion();
      questions.push(question);
    }

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
