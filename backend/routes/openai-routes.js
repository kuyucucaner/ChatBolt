const express = require('express');
const router = express.Router();
const { generateQuestion } = require('../controllers/openai-controller');

router.get('/generate-question', generateQuestion);

module.exports = router;
