const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['reply', 'mention', 'upvote', 'accepted_answer', 'badge', 'event', 'connection_request', 'connection_accepted'],
    required: true
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
