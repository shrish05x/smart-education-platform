const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { awardPoints } = require('../services/gamificationService');
const { createNotification } = require('../services/notificationService');

// GET /api/comments/:postId
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ isAcceptedAnswer: -1, upvotes: -1, createdAt: 1 })
      .populate('author', 'name profileImage reputation badges');
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { postId, parentId = null, content, attachments = [] } = req.body;
    if (!content || content.trim().length < 1)
      return res.status(400).json({ success: false, message: 'Content is required' });
    if (content.trim().length > 3000)
      return res.status(400).json({ success: false, message: 'Content must be under 3000 characters' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Extract @mentions
    const mentionMatches = content.match(/@(\w+)/g) || [];
    const mentions = [...new Set(mentionMatches)];

    const comment = await Comment.create({
      author: req.user._id,
      postId,
      parentId: parentId || null,
      content: content.trim(),
      mentions,
      attachments,
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    // Award points for answering
    if (!parentId) {
      const newBadges = await awardPoints(req.user._id, 'answer_question');
      await User.findByIdAndUpdate(req.user._id, { $inc: { answerCount: 1 } });

      for (const badge of newBadges) {
        await createNotification({ recipient: req.user._id, type: 'badge', message: `🎉 You earned the "${badge.name}" ${badge.icon} badge!` });
      }

      // Notify post author of new answer
      if (post.author.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: post.author,
          sender: req.user._id,
          type: 'reply',
          postId,
          commentId: comment._id,
          message: `${req.user.name} answered your question: "${post.title.slice(0, 60)}"`,
        });
      }
    } else {
      // Notify parent comment author of reply
      const parent = await Comment.findById(parentId);
      if (parent && parent.author.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: parent.author,
          sender: req.user._id,
          type: 'reply',
          postId,
          commentId: comment._id,
          message: `${req.user.name} replied to your comment`,
        });
      }
    }

    // Notify mentioned users
    for (const mention of mentions) {
      const mentionedUser = await User.findOne({ name: { $regex: new RegExp(`^${mention.slice(1)}$`, 'i') } });
      if (mentionedUser && mentionedUser._id.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: mentionedUser._id,
          sender: req.user._id,
          type: 'mention',
          postId,
          commentId: comment._id,
          message: `${req.user.name} mentioned you in a comment`,
        });
      }
    }

    const populated = await Comment.findById(comment._id).populate('author', 'name profileImage reputation badges');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const { content } = req.body;
    if (content) comment.content = content.trim();
    await comment.save();

    const populated = await Comment.findById(comment._id).populate('author', 'name profileImage reputation badges');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    // Cascade delete replies
    const replyIds = await Comment.find({ parentId: req.params.id }).distinct('_id');
    const totalDeleted = 1 + replyIds.length;
    await Comment.deleteMany({ $or: [{ _id: req.params.id }, { parentId: req.params.id }] });
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -totalDeleted } });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/comments/:id/vote
exports.voteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const userId = req.user._id;
    const hasVoted = comment.voters.some((v) => v.toString() === userId.toString());

    if (hasVoted) {
      // Toggle off
      comment.voters = comment.voters.filter((v) => v.toString() !== userId.toString());
      comment.upvotes = Math.max(0, comment.upvotes - 1);
    } else {
      comment.voters.push(userId);
      comment.upvotes += 1;
      // Notify comment author
      if (comment.author.toString() !== userId.toString()) {
        await createNotification({
          recipient: comment.author,
          sender: userId,
          type: 'upvote',
          postId: comment.postId,
          commentId: comment._id,
          message: `${req.user.name} upvoted your answer`,
        });
      }
    }

    await comment.save();
    res.json({ success: true, data: { upvotes: comment.upvotes, hasVoted: !hasVoted } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
