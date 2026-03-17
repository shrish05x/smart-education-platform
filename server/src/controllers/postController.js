const Post = require('../models/Post');
const User = require('../models/User');
const { awardPoints } = require('../services/gamificationService');
const { createNotification } = require('../services/notificationService');

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const { search, subject, tags, type, sort } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (subject) query.subject = subject;
    if (type) query.type = type;
    if (tags) query.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()) };

    let sortObj = { isPinned: -1, createdAt: -1 };
    if (sort === 'popular') sortObj = { isPinned: -1, upvotes: -1, createdAt: -1 };
    else if (sort === 'trending') sortObj = { isPinned: -1, views: -1, createdAt: -1 };
    else if (sort === 'unanswered') { query.commentCount = 0; sortObj = { createdAt: -1 }; }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name profileImage reputation points badges'),
      Post.countDocuments(query),
    ]);

    res.json({ success: true, data: { posts, totalPosts: total, totalPages: Math.ceil(total / limit), currentPage: page } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name profileImage reputation points badges');

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, description, type = 'question', subject = '', tags = [], attachments = [] } = req.body;

    if (!title || title.trim().length < 5) return res.status(400).json({ success: false, message: 'Title must be at least 5 characters' });
    if (!description || description.trim().length < 20) return res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });

    const post = await Post.create({
      author: req.user._id,
      title: title.trim(),
      description: description.trim(),
      type,
      subject,
      tags: tags.slice(0, 5).map((t) => t.toLowerCase().trim()),
      attachments,
    });

    // Award points for asking a question/posting
    const pointAction = type === 'resource' ? 'share_resource' : 'ask_question';
    const newBadges = await awardPoints(req.user._id, pointAction);
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: 1 } });

    // Emit badge notifications
    for (const badge of newBadges) {
      await createNotification({
        recipient: req.user._id,
        type: 'badge',
        message: `🎉 Congratulations! You earned the "${badge.name}" ${badge.icon} badge!`,
      });
    }

    const populated = await Post.findById(post._id).populate('author', 'name profileImage reputation points badges');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const { title, description, subject, tags, attachments } = req.body;
    if (title) post.title = title.trim();
    if (description) post.description = description.trim();
    if (subject !== undefined) post.subject = subject;
    if (tags) post.tags = tags.slice(0, 5).map((t) => t.toLowerCase().trim());
    if (attachments) post.attachments = attachments;
    await post.save();

    const populated = await Post.findById(post._id).populate('author', 'name profileImage reputation points badges');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await post.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $inc: { postCount: -1 } });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/accept-answer
exports.acceptAnswer = async (req, res) => {
  try {
    const { commentId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Only the question author can accept answers' });

    const Comment = require('../models/Comment');
    // Unmark previous accepted answer
    if (post.acceptedAnswer) await Comment.findByIdAndUpdate(post.acceptedAnswer, { isAcceptedAnswer: false });

    // Toggle: if same answer, unaccept it
    if (post.acceptedAnswer && post.acceptedAnswer.toString() === commentId) {
      post.acceptedAnswer = null;
      await post.save();
      await Comment.findByIdAndUpdate(commentId, { isAcceptedAnswer: false });
      return res.json({ success: true, data: { acceptedAnswer: null } });
    }

    post.acceptedAnswer = commentId;
    await post.save();
    const comment = await Comment.findByIdAndUpdate(commentId, { isAcceptedAnswer: true }, { new: true });

    // Award points to comment author and notify them
    if (comment) {
      await awardPoints(comment.author, 'answer_accepted');
      await createNotification({
        recipient: comment.author,
        sender: req.user._id,
        type: 'accepted_answer',
        postId: post._id,
        commentId,
        message: `Your answer was accepted as the best answer! 🎉`,
      });
    }

    res.json({ success: true, data: { acceptedAnswer: commentId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/rate
exports.ratePost = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

    const post = await Post.findById(req.params.id);
    if (!post || post.type !== 'resource')
      return res.status(404).json({ success: false, message: 'Resource post not found' });

    // Remove existing rating from this user if any
    post.resourceRatings = post.resourceRatings.filter((r) => r.userId.toString() !== req.user._id.toString());
    post.resourceRatings.push({ userId: req.user._id, rating });
    post.averageRating = post.resourceRatings.reduce((sum, r) => sum + r.rating, 0) / post.resourceRatings.length;
    await post.save();

    res.json({ success: true, data: { averageRating: post.averageRating, totalRatings: post.resourceRatings.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
