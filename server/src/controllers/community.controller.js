const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create post
const createPost = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comments = await Comment.find({ post: req.params.id }).populate('author', 'name avatar');
    res.json({ post, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({ ...req.body, post: req.params.id, author: req.user._id });
    await Post.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts, createPost, getPostById, addComment, likePost };
