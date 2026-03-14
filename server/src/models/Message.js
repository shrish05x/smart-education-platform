const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studyGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' },
  content: { type: String, required: true },
  type: { type: String, enum: ['direct', 'group', 'community'], default: 'direct' },
  isRead: { type: Boolean, default: false },
  attachments: [{ filename: String, url: String }],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
