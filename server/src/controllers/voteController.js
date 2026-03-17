const Vote = require('../models/Vote');
const Post = require('../models/Post');
const User = require('../models/User');

// POST /api/vote
const castVote = async (req, res) => {
  try {
    const { postId, type } = req.body;
    if (!postId) return res.status(400).json({ success: false, message: 'postId is required' });
    if (!['upvote', 'downvote'].includes(type))
      return res.status(400).json({ success: false, message: 'type must be upvote or downvote' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const existing = await Vote.findOne({ userId: req.user._id, postId });

    let scoreChange = 0;
    let repChange = 0;

    if (!existing) {
      // No existing vote — create it
      await Vote.create({ userId: req.user._id, postId, type });
      if (type === 'upvote') {
        post.upvotes += 1;
        repChange = 10;
      } else {
        post.downvotes += 1;
        repChange = -2;
      }
    } else if (existing.type === type) {
      // Same type — toggle off (remove vote)
      await existing.deleteOne();
      if (type === 'upvote') {
        post.upvotes = Math.max(0, post.upvotes - 1);
        repChange = -10;
      } else {
        post.downvotes = Math.max(0, post.downvotes - 1);
        repChange = 2;
      }
    } else {
      // Opposite type — switch vote
      const oldType = existing.type;
      existing.type = type;
      await existing.save();
      if (type === 'upvote') {
        post.upvotes += 1;
        post.downvotes = Math.max(0, post.downvotes - 1);
        repChange = 12; // +10 for new upvote, +2 to reverse downvote penalty
      } else {
        post.downvotes += 1;
        post.upvotes = Math.max(0, post.upvotes - 1);
        repChange = -12;
      }
    }

    await post.save();

    // Update author reputation
    if (repChange !== 0) {
      await User.findByIdAndUpdate(post.author, {
        $inc: { reputation: repChange },
      });
    }

    // Return the user's current vote on this post (null if removed)
    const userVote = await Vote.findOne({ userId: req.user._id, postId });

    res.json({
      success: true,
      data: {
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        score: post.upvotes - post.downvotes,
        userVote: userVote?.type || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vote/:postId  — get current user's vote for a post
const getUserVote = async (req, res) => {
  try {
    if (!req.user) return res.json({ success: true, data: null });
    const vote = await Vote.findOne({ userId: req.user._id, postId: req.params.postId });
    res.json({ success: true, data: vote?.type || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { castVote, getUserVote };
