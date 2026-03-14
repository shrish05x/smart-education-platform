const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  type: { type: String, enum: ['tutor', 'recommendation', 'resume'], default: 'tutor' },
}, { timestamps: true });

module.exports = mongoose.model('AiChat', aiChatSchema);
