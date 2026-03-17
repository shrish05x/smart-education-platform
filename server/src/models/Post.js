const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 150,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      validate: [(arr) => arr.length <= 5, 'Maximum 5 tags allowed'],
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }, // denormalized for feed perf
  },
  { timestamps: true }
);

// Full-text search index
postSchema.index({ title: 'text', description: 'text' });
// Common query indexes
postSchema.index({ createdAt: -1 });
postSchema.index({ upvotes: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
