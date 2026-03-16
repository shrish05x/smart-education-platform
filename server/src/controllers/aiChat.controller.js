const ChatMessage = require('../models/ChatMessage');
const { generateChatResponse } = require('../services/aiChat.service');

/**
 * Chat with the AI assistant.
 *
 * Request body: { message: string }
 */
const chatWithAI = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required.' });
    }

    // Load recent chat history (oldest first)
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const orderedHistory = history.reverse();

    // Generate a response from the AI model
    const aiResponse = await generateChatResponse(message, orderedHistory);

    // Persist user message and AI response
    const userMessageDoc = await ChatMessage.create({
      userId,
      role: 'user',
      message,
    });

    const assistantMessageDoc = await ChatMessage.create({
      userId,
      role: 'assistant',
      message: aiResponse,
    });

    return res.json({
      response: aiResponse,
      messageId: assistantMessageDoc._id,
      userMessageId: userMessageDoc._id,
    });
  } catch (error) {
    console.error('AI Chat controller error:', error.message);
    return res.status(500).json({ message: 'Failed to chat with AI.' });
  }
};

/**
 * Get recent chat history for the authenticated user.
 */
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Return in chronological order
    const ordered = messages.reverse();

    res.json({ messages: ordered });
  } catch (error) {
    console.error('AI Chat history error:', error.message);
    res.status(500).json({ message: 'Failed to load chat history.' });
  }
};

module.exports = { chatWithAI, getChatHistory };
