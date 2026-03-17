const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    // null = top-level comment; ObjectId = reply to another comment
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
