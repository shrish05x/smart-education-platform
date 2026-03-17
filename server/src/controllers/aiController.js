const Post = require('../models/Post');
const Comment = require('../models/Comment');
const aiService = require('../services/aiService');

// POST /api/ai/suggest-answer
exports.suggestAnswer = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId).select('title description');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const suggestion = await aiService.suggestAnswer(post.title, post.description);
    res.json({ success: true, data: { suggestion } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service unavailable: ' + err.message });
  }
};

// POST /api/ai/summarize
exports.summarizeThread = async (req, res) => {
  try {
    const { postId } = req.body;
    const [post, comments] = await Promise.all([
      Post.findById(postId).select('title description'),
      Comment.find({ postId }).select('content parentId').limit(20),
    ]);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const summary = await aiService.summarizeThread(post, comments);
    res.json({ success: true, data: { summary } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service unavailable: ' + err.message });
  }
};

// POST /api/ai/auto-tag
exports.autoTag = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const tags = await aiService.autoTag(title, description || '');
    res.json({ success: true, data: { tags } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service unavailable: ' + err.message });
  }
};

// GET /api/ai/similar-posts
exports.findSimilarPosts = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ success: false, message: 'Title query param is required' });

    const existingPosts = await Post.find({}).select('_id title').limit(100).lean();
    const similar = await aiService.findSimilarPosts(title, existingPosts);
    res.json({ success: true, data: { similar } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'AI service unavailable: ' + err.message });
  }
};
