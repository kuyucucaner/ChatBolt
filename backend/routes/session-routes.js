const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session-controller');

router.post('/start-session', sessionController.startSession);
router.post('/save-answer', sessionController.saveAnswer);

module.exports = router;
