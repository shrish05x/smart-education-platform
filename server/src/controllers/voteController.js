const Post = require('../models/Post');
const User = require('../models/User');
const { awardPoints } = require('../services/gamificationService');
const { createNotification } = require('../services/notificationService');

// POST /api/vote
exports.castVote = async (req, res) => {
  try {
    const { postId, type } = req.body;
    if (!['upvote', 'downvote'].includes(type))
      return res.status(400).json({ success: false, message: 'Invalid vote type' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId = req.user._id;
    const existingVote = post.voters.find((v) => v.userId.toString() === userId.toString());

    if (!existingVote) {
      // New vote
      post.voters.push({ userId, type });
      if (type === 'upvote') post.upvotes += 1;
      else post.downvotes += 1;

      const action = type === 'upvote' ? 'upvote_received_post' : 'downvote_received_post';
      await awardPoints(post.author, action);

      if (type === 'upvote' && post.author.toString() !== userId.toString()) {
        await createNotification({
          recipient: post.author,
          sender: userId,
          type: 'upvote',
          postId: post._id,
          message: `${req.user.name} upvoted your post: "${post.title.slice(0, 50)}"`,
        });
      }
    } else if (existingVote.type === type) {
      // Toggle off same vote
      post.voters = post.voters.filter((v) => v.userId.toString() !== userId.toString());
      if (type === 'upvote') post.upvotes = Math.max(0, post.upvotes - 1);
      else post.downvotes = Math.max(0, post.downvotes - 1);

      // Reverse reputation
      const reverseAction = type === 'upvote' ? 'downvote_received_post' : 'upvote_received_post';
      await awardPoints(post.author, reverseAction);
    } else {
      // Switch vote
      existingVote.type = type;
      if (type === 'upvote') { post.upvotes += 1; post.downvotes = Math.max(0, post.downvotes - 1); }
      else { post.downvotes += 1; post.upvotes = Math.max(0, post.upvotes - 1); }
    }

    await post.save();

    const userVote = post.voters.find((v) => v.userId.toString() === userId.toString());
    res.json({
      success: true,
      data: { upvotes: post.upvotes, downvotes: post.downvotes, userVote: userVote ? userVote.type : null }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/vote/:postId — get current user's vote
exports.getUserVote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).select('voters upvotes downvotes');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const userId = req.user?._id;
    const userVote = userId ? post.voters.find((v) => v.userId.toString() === userId.toString()) : null;
    res.json({ success: true, data: userVote ? userVote.type : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
