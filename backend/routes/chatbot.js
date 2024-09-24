const express = require('express');
const router = express.Router();

// Predefined sorular
const questions = [
  "What is your favorite breed of cat, and why?",
  "How do you think cats communicate with their owners?",
  // Diğer soruları ekle...
];

// Soruları al
router.get('/questions', (req, res) => {
  res.json(questions);
});

// Cevapları kaydet
router.post('/save-answer', (req, res) => {
  const { question, answer } = req.body;
  // Burada veritabanına kaydetme işlemi yapılacak
  res.status(200).send('Answer saved');
});

module.exports = router;
