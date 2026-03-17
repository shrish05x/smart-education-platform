const express = require('express');
const router = express.Router();
const c = require('../controllers/postController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', c.getPosts);
router.get('/:id', c.getPost);
router.post('/', protect, c.createPost);
router.put('/:id', protect, c.updatePost);
router.delete('/:id', protect, c.deletePost);
router.post('/:id/accept-answer', protect, c.acceptAnswer);
router.post('/:id/rate', protect, c.ratePost);

module.exports = router;
