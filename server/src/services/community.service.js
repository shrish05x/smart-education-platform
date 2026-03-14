const Post = require('../models/Post');
const Comment = require('../models/Comment');
const StudyGroup = require('../models/StudyGroup');

const getAllPosts = async () => {
  return await Post.find().populate('author', 'name avatar').sort({ createdAt: -1 });
};

const getPostById = async (id) => {
  return await Post.findById(id).populate('author', 'name avatar');
};

const createPost = async (data) => {
  return await Post.create(data);
};

const getCommentsByPost = async (postId) => {
  return await Comment.find({ post: postId }).populate('author', 'name avatar');
};

const createComment = async (data) => {
  return await Comment.create(data);
};

const getStudyGroups = async () => {
  return await StudyGroup.find({ isActive: true }).populate('creator', 'name');
};

module.exports = { getAllPosts, getPostById, createPost, getCommentsByPost, createComment, getStudyGroups };
