const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/geminiController');

router.post('/gemini/generate', generateContent);

module.exports = router;
