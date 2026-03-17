const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET /api/comments/:postId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .populate('author', 'name email profileImage');

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/comments
const createComment = async (req, res) => {
  try {
    const { postId, content, parentId = null } = req.body;

    if (!postId) return res.status(400).json({ success: false, message: 'postId is required' });
    if (!content || content.trim().length === 0)
      return res.status(400).json({ success: false, message: 'Content is required' });
    if (content.trim().length > 2000)
      return res.status(400).json({ success: false, message: 'Comment must be under 2000 characters' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // If it's a reply, verify the parent exists
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) return res.status(404).json({ success: false, message: 'Parent comment not found' });
    }

    const comment = await Comment.create({
      author: req.user._id,
      postId,
      parentId: parentId || null,
      content: content.trim(),
    });

    // Increment commentCount on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    const populated = await comment.populate('author', 'name email profileImage');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });

    // Also delete replies to this comment
    const replyCount = await Comment.countDocuments({ parentId: comment._id });
    await Comment.deleteMany({ parentId: comment._id });
    await comment.deleteOne();

    // Decrement commentCount (comment + its replies)
    await Post.findByIdAndUpdate(comment.postId, {
      $inc: { commentCount: -(1 + replyCount) },
    });

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getComments, createComment, deleteComment };
