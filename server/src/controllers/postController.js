const Post = require('../models/Post');
const Vote = require('../models/Vote');

// GET /api/posts
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sort = 'newest' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {};

    // Full-text search
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Tag filter (comma-separated)
    if (tags && tags.trim()) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (tagList.length > 0) query.tags = { $in: tagList };
    }

    // Sort options
    let sortObj = { createdAt: -1 }; // newest default
    if (sort === 'popular') sortObj = { upvotes: -1, createdAt: -1 };
    if (sort === 'unanswered') {
      query.commentCount = 0;
      sortObj = { createdAt: -1 };
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'name email profileImage'),
      Post.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        posts,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        totalPosts: total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/posts/:id
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email profileImage');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, description, tags = [] } = req.body;

    // Validation
    if (!title || title.trim().length < 5)
      return res.status(400).json({ success: false, message: 'Title must be at least 5 characters' });
    if (title.trim().length > 150)
      return res.status(400).json({ success: false, message: 'Title must be under 150 characters' });
    if (!description || description.trim().length < 20)
      return res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
    if (description.trim().length > 5000)
      return res.status(400).json({ success: false, message: 'Description must be under 5000 characters' });

    // Clean tags
    const cleanTags = tags
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 30))
      .filter(Boolean)
      .slice(0, 5);

    const post = await Post.create({
      author: req.user._id,
      title: title.trim(),
      description: description.trim(),
      tags: cleanTags,
    });

    const populated = await post.populate('author', 'name email profileImage');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });

    const { title, description, tags } = req.body;

    if (title !== undefined) {
      if (title.trim().length < 5 || title.trim().length > 150)
        return res.status(400).json({ success: false, message: 'Title must be 5–150 characters' });
      post.title = title.trim();
    }
    if (description !== undefined) {
      if (description.trim().length < 20 || description.trim().length > 5000)
        return res.status(400).json({ success: false, message: 'Description must be 20–5000 characters' });
      post.description = description.trim();
    }
    if (tags !== undefined) {
      post.tags = tags.map((t) => t.trim().toLowerCase().replace(/\s+/g, '-').substring(0, 30)).slice(0, 5);
    }

    await post.save();
    const populated = await post.populate('author', 'name email profileImage');
    res.json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
