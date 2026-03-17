const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'resource', 'system'],
      default: 'text',
    },
    resourceRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupResource',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
