const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
