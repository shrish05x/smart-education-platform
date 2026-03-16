const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  message: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'ai_chats',
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
