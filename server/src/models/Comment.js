const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  content: { type: String, required: true, maxlength: 3000 },
  mentions: [{ type: String }],            // '@username' strings
  upvotes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAcceptedAnswer: { type: Boolean, default: false },
  attachments: [{ type: { type: String }, url: String }],
}, { timestamps: true });

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ parentId: 1 });

module.exports = mongoose.model('Comment', commentSchema);
