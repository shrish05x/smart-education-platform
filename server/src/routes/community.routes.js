const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, addComment, likePost } = require('../controllers/community.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.get('/posts/:id', getPostById);
router.post('/posts/:id/comments', protect, addComment);
router.put('/posts/:id/like', protect, likePost);

module.exports = router;
