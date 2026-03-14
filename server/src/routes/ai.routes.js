const express = require('express');
const router = express.Router();
const { tutorChat, recommend, resumeAnalysis, getChats } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/tutor', protect, tutorChat);
router.post('/recommend', protect, recommend);
router.post('/resume', protect, resumeAnalysis);
router.get('/chats', protect, getChats);

module.exports = router;
