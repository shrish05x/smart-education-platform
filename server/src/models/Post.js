const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['question', 'discussion', 'resource', 'achievement', 'challenge'],
    default: 'question'
  },
  title: { type: String, required: true, maxlength: 150, trim: true },
  description: { type: String, required: true, maxlength: 5000 },
  subject: { type: String, trim: true, default: '' },
  tags: [{ type: String, lowercase: true, trim: true }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, type: { type: String, enum: ['upvote', 'downvote'] } }],
  commentCount: { type: Number, default: 0 },
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  attachments: [{
    type: { type: String, enum: ['pdf', 'image', 'video', 'link'] },
    url: String,
    name: String
  }],
  resourceRatings: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number, min: 1, max: 5 } }],
  averageRating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

// Text search index
postSchema.index({ title: 'text', description: 'text', tags: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ subject: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema);
