const express = require('express');
const router = express.Router();
const c = require('../controllers/aiController');
const { protect } = require('../middlewares/auth.middleware');

router.post('/suggest-answer', protect, c.suggestAnswer);
router.post('/summarize', protect, c.summarizeThread);
router.post('/auto-tag', protect, c.autoTag);
router.get('/similar-posts', protect, c.findSimilarPosts);

module.exports = router;
