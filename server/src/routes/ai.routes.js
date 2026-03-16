const express = require('express');
const router = express.Router();
const { tutorChat, recommend, resumeAnalysis, getChats } = require('../controllers/ai.controller');
const { chatWithAI, getChatHistory } = require('../controllers/aiChat.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/tutor', protect, tutorChat);
router.post('/recommend', protect, recommend);
router.post('/resume', protect, resumeAnalysis);
router.post('/chat', protect, chatWithAI);
router.get('/chats', protect, getChatHistory);

module.exports = router;
