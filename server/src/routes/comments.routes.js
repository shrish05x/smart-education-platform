const express = require('express');
const router = express.Router();
const c = require('../controllers/commentController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/:postId', c.getComments);
router.post('/', protect, c.createComment);
router.put('/:id', protect, c.updateComment);
router.delete('/:id', protect, c.deleteComment);
router.post('/:id/vote', protect, c.voteComment);

module.exports = router;
