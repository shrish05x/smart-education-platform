const AiChat = require('../models/AiChat');
const { chatWithTutor, getRecommendations, analyzeResume } = require('../ai/ai.service');

// @desc    AI tutor chat
const tutorChat = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    let chat;

    if (chatId) {
      chat = await AiChat.findById(chatId);
    } else {
      chat = await AiChat.create({ user: req.user._id, type: 'tutor' });
    }

    chat.messages.push({ role: 'user', content: message });
    const reply = await chatWithTutor(chat.messages);
    chat.messages.push({ role: 'assistant', content: reply });
    await chat.save();

    res.json({ chatId: chat._id, reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource recommendations
const recommend = async (req, res) => {
  try {
    const { topic, level } = req.body;
    const recommendations = await getRecommendations(topic, level);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze resume
const resumeAnalysis = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const analysis = await analyzeResume(resumeText);
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's AI chats
const getChats = async (req, res) => {
  try {
    const chats = await AiChat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { tutorChat, recommend, resumeAnalysis, getChats };
