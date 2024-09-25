const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openai-controller');

router.post('/start-session', openaiController.startSession);
router.post('/save-answer', openaiController.saveAnswer);

module.exports = router;
